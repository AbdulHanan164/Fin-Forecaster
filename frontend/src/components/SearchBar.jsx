import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanies } from '../api';

const SearchBar = ({ placeholder = 'Search company or symbol...' }) => {
    const [query, setQuery] = useState('');
    const [companies, setCompanies] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [open, setOpen] = useState(false);
    const [highlighted, setHighlighted] = useState(-1);
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        getCompanies().then(setCompanies).catch(console.error);
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setFiltered([]);
            setOpen(false);
            return;
        }
        const q = query.toLowerCase();
        const results = companies
            .filter(c =>
                c.name?.toLowerCase().includes(q) ||
                c.label2?.toLowerCase().includes(q) ||
                c.symbol?.toLowerCase().includes(q)
            )
            .slice(0, 10);
        setFiltered(results);
        setOpen(results.length > 0);
        setHighlighted(-1);
    }, [query, companies]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const selectCompany = (company) => {
        setQuery('');
        setOpen(false);
        navigate(`/company/${company.value}/overview`);
    };

    const handleKeyDown = (e) => {
        if (!open) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlighted(h => Math.min(h + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlighted(h => Math.max(h - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlighted >= 0 && filtered[highlighted]) {
                selectCompany(filtered[highlighted]);
            }
        } else if (e.key === 'Escape') {
            setOpen(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-sm">
            <div className="relative flex items-center">
                <svg
                    className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => filtered.length > 0 && setOpen(true)}
                    placeholder={placeholder}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setOpen(false); }}
                        className="absolute right-3 text-slate-400 hover:text-slate-600"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {open && (
                <div className="absolute z-50 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                    {filtered.map((company, i) => (
                        <button
                            key={company.value}
                            onMouseDown={() => selectCompany(company)}
                            onMouseEnter={() => setHighlighted(i)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                highlighted === i ? 'bg-blue-50' : 'hover:bg-slate-50'
                            }`}
                        >
                            <span className="inline-block min-w-[52px] text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                                {company.label2 || company.symbol}
                            </span>
                            <span className="text-sm text-slate-800 truncate">{company.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
