import { useState, FormEvent } from 'react';
import { useAuth } from './auth-context';
import { ErrorMessage } from '@/components/error-message';
import { LoadingSpinner } from '@/components/loading-spinner';

export function LoginForm() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
    } catch {
      // Error is handled by the auth context
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Login">
      <ErrorMessage message={error} />
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required="true"
          placeholder="Enter your email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-required="true"
          placeholder="Enter your password"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white"
      >
        {loading ? <LoadingSpinner color="white" /> : 'Login'}
      </button>
    </form>
  );
}

export function SignupForm() {
  const { signup, loading, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await signup(name, email, password, role);
    } catch {
      // Error is handled by the auth context
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Sign up">
      <ErrorMessage message={error} />
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-required="true"
          placeholder="Enter your name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required="true"
          placeholder="Enter your email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-required="true"
          placeholder="Enter your password"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          aria-required="true"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="user">User</option>
          <option value="carrier">Carrier</option>
          <option value="company">Company</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white"
      >
        {loading ? <LoadingSpinner color="white" /> : 'Sign up'}
      </button>
    </form>
  );
}

export function UserProfile() {
  const { user, logout, loading } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <button
        onClick={logout}
        disabled={loading}
        className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white"
      >
        {loading ? <LoadingSpinner color="white" /> : 'Logout'}
      </button>
    </div>
  );
} 