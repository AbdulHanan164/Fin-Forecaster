import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER", "amirrehman223220@gmail.com")
EMAIL_PASS = os.getenv("EMAIL_PASS", "ernu vkxz nyqq iewe")

def send_otp_email(to_email: str, subject: str, otp_code: str, name: str = "User"):
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = EMAIL_USER
    msg['To'] = to_email

    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f0fdfa; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #ccfbf1;">
            <h2 style="color: #134e4a; text-align: center;">FinForecaster Verification Code</h2>
            <p style="color: #0f766e;">Hello {name},</p>
            <p style="color: #0f766e;">Your One-Time Password (OTP) code is:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #047857; background: #ecfdf5; padding: 10px 20px; border-radius: 8px;">
                    {otp_code}
                </span>
            </div>
            <p style="color: #0f766e;">This code will expire in 10 minutes. Please do not share it with anyone.</p>
            <hr style="border: none; border-top: 1px solid #ccfbf1; margin-top: 30px;" />
            <p style="font-size: 12px; color: #99f6e4; text-align: center;">FinForecaster Analytics &copy; 2026</p>
        </div>
      </body>
    </html>
    """
    msg.set_content(f"Your FinForecaster OTP code is: {otp_code}")
    msg.add_alternative(html_content, subtype='html')

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(EMAIL_USER, EMAIL_PASS)
            smtp.send_message(msg)
    except Exception as e:
        print(f"Failed to send email: {e}")
