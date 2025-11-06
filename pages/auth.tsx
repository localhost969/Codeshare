import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth-context';
import { useTheme } from '../lib/theme-context';
import Link from 'next/link';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const API_BASE_URL = '/api';

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [step, setStep] = useState<'search' | 'password' | 'createPassword'>('search');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userExists, setUserExists] = useState(false);

  // Check if user exists by username
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call a check-username endpoint to see if user exists
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
        // Fallback for older response format
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
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      {/* Header with Theme Toggle */}
      <header className="flex justify-between items-center p-6 border-b transition-colors duration-300"
        style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white"
            style={{ backgroundColor: 'var(--accent)' }}>
            C
          </div>
          <h1 className="font-bold text-xl">CodeShare</h1>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors hover:bg-opacity-10 hover:bg-current"
          title="Toggle theme"
        >
          {isDark ? <LightModeIcon /> : <DarkModeIcon />}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-md rounded-xl p-8 border transition-colors duration-300"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: isDark ? 'rgba(15, 20, 25, 0.6)' : 'rgba(255, 255, 255, 0.6)',
          }}
        >
          {step === 'search' && (
            <>
              <h2 className="text-2xl font-bold mb-2">Welcome to CodeShare</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
                Enter your username to get started
              </p>

              <form onSubmit={handleSearch} className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                    '--tw-ring-color': 'var(--accent)',
                  } as any}
                  disabled={isLoading}
                  required
                />

                <button
                  type="submit"
                  disabled={isLoading || !username.trim()}
                  className="w-full py-2 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  style={{
                    backgroundColor: 'var(--accent)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
                >
                  {isLoading ? 'Checking...' : 'Continue'}
                </button>
              </form>
              {error && (
                <div
                  className="px-4 py-2 rounded-lg text-sm mt-4"
                  style={{
                    backgroundColor: isDark ? 'rgba(220, 38, 38, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                    color: '#dc2626',
                  }}
                >
                  {error}
                </div>
              )}
            </>
          )}

          {step === 'password' && (
            <>
              <h2 className="text-2xl font-bold mb-2">
                {userExists ? 'Welcome Back' : 'Create Your Space'}
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
                {userExists
                  ? `Sign in to ${username}'s space`
                  : `Create a secure space for ${username}`}
              </p>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                    '--tw-ring-color': 'var(--accent)',
                  } as any}
                  disabled={isLoading}
                  required
                />

                {!userExists && (
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--background)',
                      color: 'var(--foreground)',
                      '--tw-ring-color': 'var(--accent)',
                    } as any}
                    disabled={isLoading}
                    required
                  />
                )}

                {error && (
                  <div
                    className="px-4 py-2 rounded-lg text-sm"
                    style={{
                      backgroundColor: isDark ? 'rgba(220, 38, 38, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                      color: '#dc2626',
                    }}
                  >
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBackToSearch}
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors border"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || !password}
                    className="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
                    style={{
                      backgroundColor: 'var(--accent)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
                  >
                    {isLoading ? 'Processing...' : userExists ? 'Sign In' : 'Create Space'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="text-center text-sm py-6 border-t transition-colors duration-300"
        style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
      >
        <p>Share code snippets securely • Simple • Fast </p>
      </footer>
    </div>
  );
}
