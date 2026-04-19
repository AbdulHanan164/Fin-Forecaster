from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
import datetime
import random
import os
from dotenv import load_dotenv

from database import engine, get_db
import models
from email_service import send_otp_email

load_dotenv()

# Ensure tables are created
models.Base.metadata.create_all(bind=engine)

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET", "super_secret_finforecaster_key_123")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days

# --- Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

class ForgotPassword(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

# --- Helpers ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def generate_otp():
    return str(random.randint(100000, 999999))

# --- Routes ---

@router.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if user:
        if user.is_active:
            raise HTTPException(status_code=400, detail="Email already registered and active.")
        else:
            # Re-send OTP for inactive user
            otp = generate_otp()
            user.otp_code = otp
            user.otp_expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
            user.password_hash = get_password_hash(user_data.password)
            user.name = user_data.name
            db.commit()
            send_otp_email(user.email, "Verify your FinForecaster Account", otp, user.name)
            return {"message": "OTP resent to email. Please verify."}

    otp = generate_otp()
    new_user = models.User(
        name=user_data.name,
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        is_active=False,
        otp_code=otp,
        otp_expires_at=datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    send_otp_email(new_user.email, "Verify your FinForecaster Account", otp, new_user.name)
    return {"message": "User registered. OTP sent to email."}

@router.post("/verify-otp", response_model=Token)
def verify_otp(data: OTPVerify, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    if user.is_active:
        pass # Allow re-login via OTP if needed, or ignore
    
    if user.otp_code != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP code.")
    if user.otp_expires_at and datetime.datetime.utcnow() > user.otp_expires_at:
        raise HTTPException(status_code=400, detail="OTP has expired.")

    user.is_active = True
    user.otp_code = None
    user.otp_expires_at = None
    db.commit()

    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "name": user.name}
    }

@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account not verified. Please verify your OTP.")

    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "name": user.name}
    }

@router.post("/forgot-password")
def forgot_password(data: ForgotPassword, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        # Prevent email enumeration by returning a generic success message
        return {"message": "If that email is registered, an OTP has been sent."}
    
    otp = generate_otp()
    user.otp_code = otp
    user.otp_expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    db.commit()

    send_otp_email(user.email, "FinForecaster Password Reset", otp, user.name)
    return {"message": "If that email is registered, an OTP has been sent."}

@router.post("/reset-password", response_model=Token)
def reset_password(data: ResetPassword, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    if user.otp_code != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP code.")
    if user.otp_expires_at and datetime.datetime.utcnow() > user.otp_expires_at:
        raise HTTPException(status_code=400, detail="OTP has expired.")

    user.password_hash = get_password_hash(data.new_password)
    user.is_active = True # Force active in case it wasn't
    user.otp_code = None
    user.otp_expires_at = None
    db.commit()

    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "name": user.name}
    }
