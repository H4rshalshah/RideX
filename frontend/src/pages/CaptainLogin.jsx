import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import PasswordField from '../components/ui/PasswordField';
import Button from '../components/ui/Button';
import api, { getErrorMessage } from '../lib/api';
import { CaptainDataContext } from '../context/CapatainContext';
import { useContext } from 'react';

const emailRe = /^\S+@\S+\.\S+$/;

const CaptainLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setCaptain } = useContext(CaptainDataContext);
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
      const response = await api.post('/captains/login', { email: email.trim(), password });
      setCaptain(response.data.captain);
      localStorage.setItem('token', response.data.token);
      navigate('/captain-home');
    } catch (err) {
      setServerError(getErrorMessage(err, 'Unable to log in. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Captain login"
      subtitle="Go online and start accepting rides."
      caption="Captain portal"
      footer={
        <p className="text-center text-sm text-ui-muted">
          Want to drive with RideX?{' '}
          <Link to="/captain-signup" className="font-semibold text-ui-ink underline underline-offset-2 hover:opacity-70">
            Register as a Captain
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
          placeholder="captain@example.com"
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
          <span className="h-px flex-1 bg-ui-line" /> Rider? <span className="h-px flex-1 bg-ui-line" />
        </div>
        <Link to="/login" className="mt-4 block w-full">
          <Button variant="secondary" size="lg" className="w-full">
            <i className="ri-taxi-line" /> Sign in as a Rider
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
};

export default CaptainLogin;
