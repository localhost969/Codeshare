
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth-context';

const API_BASE_URL = '/api';

export default function Bar() {
    const [isDark, setIsDark] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [step, setStep] = useState<'search' | 'password'>('search');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userExists, setUserExists] = useState(false);

    const router = useRouter();
    const { login } = useAuth();

    useEffect(() => {
        const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    // Check if user exists by username
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/check-username`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            const data = await response.json();
            if (response.ok && data.exists) {
                setUserExists(true);
            } else {
                setUserExists(false);
            }
            setStep('password');
        } catch (err: any) {
            setError('Failed to check username');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle password submission
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            let response;
            if (userExists) {
                // Try login
                response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        setError('Invalid password');
                    } else {
                        setError('Login failed');
                    }
                    setIsLoading(false);
                    return;
                }
            } else {
                // Try register
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    setIsLoading(false);
                    return;
                }
                if (password.length < 6) {
                    setError('Password must be at least 6 characters');
                    setIsLoading(false);
                    return;
                }
                response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 409) {
                        setError('Username already taken');
                    } else {
                        setError(errorData.error || 'Registration failed');
                    }
                    setIsLoading(false);
                    return;
                }
            }
            const data = await response.json();
            if (data.token && data.user) {
                login(data.user.username, data.token, data.user.userId, data.user.email);
                router.push(`/dashboard/${data.user.userId}`);
            } else if (data.token) {
                login(data.username, data.token, data.userId, data.email);
                router.push(`/dashboard/${data.userId}`);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToSearch = () => {
        setStep('search');
        setPassword('');
        setConfirmPassword('');
        setError('');
        setUserExists(false);
    };

    return (
        <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
                {step === 'search' && (
                    <form onSubmit={handleSearch} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter username "
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 pr-10 rounded-lg border transition-colors"
                            style={{
                                borderColor: isFocused ? (isDark ? 'white' : 'var(--accent)') : (isDark ? 'white' : 'var(--border)'),
                                backgroundColor: 'var(--background)',
                                color: isDark ? 'white' : 'var(--foreground)',
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            aria-label="Enter username or code ID"
                            disabled={isLoading}
                            required
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !username.trim()}
                            className="w-full py-2 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
                            style={{ backgroundColor: 'var(--accent)' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
                        >
                            {isLoading ? 'Checking...' : 'Continue'}
                        </button>
                        {error && (
                            <div className="px-4 py-2 rounded-lg text-sm mt-2" style={{ backgroundColor: isDark ? 'rgba(220, 38, 38, 0.1)' : 'rgba(220, 38, 38, 0.1)', color: '#dc2626' }}>{error}</div>
                        )}
                    </form>
                )}
                {step === 'password' && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 pr-10 rounded-lg border transition-colors"
                            style={{
                                borderColor: isFocused ? (isDark ? 'white' : 'var(--accent)') : (isDark ? 'white' : 'var(--border)'),
                                backgroundColor: 'var(--background)',
                                color: isDark ? 'white' : 'var(--foreground)',
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            aria-label="Password"
                            disabled={isLoading}
                            required
                        />
                        {!userExists && (
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-10 rounded-lg border transition-colors"
                                style={{
                                    borderColor: isFocused ? (isDark ? 'white' : 'var(--accent)') : (isDark ? 'white' : 'var(--border)'),
                                    backgroundColor: 'var(--background)',
                                    color: isDark ? 'white' : 'var(--foreground)',
                                }}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                aria-label="Confirm Password"
                                disabled={isLoading}
                                required
                            />
                        )}
                        {error && (
                            <div className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: isDark ? 'rgba(220, 38, 38, 0.1)' : 'rgba(220, 38, 38, 0.1)', color: '#dc2626' }}>{error}</div>
                        )}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleBackToSearch}
                                disabled={isLoading}
                                className="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors border"
                                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !password}
                                className="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
                                style={{ backgroundColor: 'var(--accent)' }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
                            >
                                {isLoading ? 'Processing...' : userExists ? 'Sign In' : 'Create Space'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}