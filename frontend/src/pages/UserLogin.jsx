import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import PasswordField from '../components/ui/PasswordField';
import Button from '../components/ui/Button';
import api, { getErrorMessage } from '../lib/api';
import { UserDataContext } from '../context/UserContext';
import { useContext } from 'react';

const emailRe = /^\S+@\S+\.\S+$/;

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = 'Email is required.';
    else if (!emailRe.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.post('/users/login', { email: email.trim(), password });
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (err) {
      setServerError(getErrorMessage(err, 'Unable to log in. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to book your next ride."
      footer={
        <p className="text-center text-sm text-ui-muted">
          New to RideX?{' '}
          <Link to="/signup" className="font-semibold text-ui-ink underline underline-offset-2 hover:opacity-70">
            Create an account
          </Link>
        </p>
      }
    >
      {serverError && (
        <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500">
          <i className="ri-error-warning-line mt-0.5" /> {serverError}
        </div>
      )}
      <form onSubmit={submitHandler} noValidate className="space-y-5">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <PasswordField
          id="password"
          name="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Log in
        </Button>
      </form>
      <div className="mt-8">
        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-ui-faint">
          <span className="h-px flex-1 bg-ui-line" /> Captain? <span className="h-px flex-1 bg-ui-line" />
        </div>
        <Link to="/captain-login" className="mt-4 block w-full">
          <Button variant="secondary" size="lg" className="w-full">
            <i className="ri-steering-2-line" /> Sign in as a Captain
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
};

export default UserLogin;
