import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

// Set at build time on the public demo: shows a one-click "Try the demo" sign-in instead of sign-up.
const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL;
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, token } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  const signIn = async (signInEmail, signInPassword) => {
    setError('');
    setLoading(true);
    try {
      await login(signInEmail, signInPassword);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-notes-bg">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-notes-yellow rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-notes-text">Tickdown</h1>
          <p className="text-notes-muted text-sm mt-1">Sign in to your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-notes-border p-8 space-y-4"
        >
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-notes-text mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-notes-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-notes-yellow/50 focus:border-notes-yellow transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-notes-text mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-notes-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-notes-yellow/50 focus:border-notes-yellow transition-colors"
              placeholder="••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-notes-yellow text-notes-text font-semibold py-2.5 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {DEMO_EMAIL ? (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => signIn(DEMO_EMAIL, DEMO_PASSWORD)}
              disabled={loading}
              className="w-full bg-notes-text text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Try the demo
            </button>
            <p className="text-xs text-notes-muted mt-2">A shared demo account. Notes reset every night.</p>
          </div>
        ) : (
          <p className="text-center text-sm text-notes-muted mt-4">
            No account?{' '}
            <Link to="/register" className="text-notes-text font-medium hover:underline">
              Create one
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
