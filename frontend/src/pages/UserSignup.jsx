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

const UserSignup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const validate = () => {
    const next = {};
    if (!firstName.trim()) next.firstName = 'First name is required.';
    else if (firstName.trim().length < 3) next.firstName = 'First name must be at least 3 characters.';
    if (lastName.trim() && lastName.trim().length < 3)
      next.lastName = 'Last name must be at least 3 characters.';
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
      const response = await api.post('/users/register', {
        fullname: { firstname: firstName.trim(), lastname: lastName.trim() || undefined },
        email: email.trim(),
        password,
      });
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (err) {
      setServerError(getErrorMessage(err, 'Unable to create your account. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join RideX and book your first ride in minutes."
      footer={
        <p className="text-center text-sm text-ui-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-ui-ink underline underline-offset-2 hover:opacity-70">
            Log in
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
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First name"
            name="firstName"
            placeholder="Alex"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={errors.firstName}
            autoComplete="given-name"
          />
          <Input
            label="Last name"
            name="lastName"
            placeholder="Morgan (optional)"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={errors.lastName}
            autoComplete="family-name"
          />
        </div>
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
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-xs leading-relaxed text-ui-faint">
        By creating an account you agree to RideX&apos;s Terms of Service and Privacy Policy.
      </p>
    </AuthLayout>
  );
};

export default UserSignup;
