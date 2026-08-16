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
const phoneRe = /^[0-9+\-\s]{10,15}$/;

const vehicleTypes = [
  { value: 'car', label: 'Car (4 seats)' },
  { value: 'auto', label: 'Auto (3 seats)' },
  { value: 'moto', label: 'Motorcycle (1 seat)' },
];

const CaptainSignup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const validate = () => {
    const next = {};
    if (!firstName.trim()) next.firstName = 'First name is required.';
    else if (firstName.trim().length < 3) next.firstName = 'First name must be at least 3 characters.';
    if (lastName.trim() && lastName.trim().length < 3)
      next.lastName = 'Last name must be at least 3 characters.';
    if (!email.trim()) next.email = 'Email is required.';
    else if (!emailRe.test(email.trim())) next.email = 'Enter a valid email address.';
    if (phone.trim() && !phoneRe.test(phone.trim())) next.phone = 'Enter a valid 10–15 digit mobile number.';
    if (!password) next.password = 'Password is required.';
    else if (password.length < 6) next.password = 'Password must be at least 6 characters.';
    if (!vehicleColor.trim()) next.vehicleColor = 'Vehicle color is required.';
    else if (vehicleColor.trim().length < 3) next.vehicleColor = 'Color must be at least 3 characters.';
    if (!vehiclePlate.trim()) next.vehiclePlate = 'Plate number is required.';
    else if (vehiclePlate.trim().length < 3) next.vehiclePlate = 'Plate must be at least 3 characters.';
    const capacity = Number(vehicleCapacity);
    if (!vehicleCapacity) next.vehicleCapacity = 'Capacity is required.';
    else if (!Number.isInteger(capacity) || capacity < 1) next.vehicleCapacity = 'Capacity must be 1 or more.';
    if (!vehicleType) next.vehicleType = 'Select a vehicle type.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.post('/captains/register', {
        fullname: { firstname: firstName.trim(), lastname: lastName.trim() || undefined },
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        vehicle: {
          color: vehicleColor.trim(),
          plate: vehiclePlate.trim(),
          capacity: Number(vehicleCapacity),
          vehicleType,
        },
      });
      setCaptain(response.data.captain);
      localStorage.setItem('token', response.data.token);
      navigate('/captain-home');
    } catch (err) {
      setServerError(getErrorMessage(err, 'Unable to create your captain account. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Become a RideX captain"
      subtitle="Register your vehicle and start earning on your schedule."
      caption="Captain portal"
      footer={
        <p className="text-center text-sm text-ui-muted">
          Already driving with us?{' '}
          <Link to="/captain-login" className="font-semibold text-ui-ink underline underline-offset-2 hover:opacity-70">
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
            placeholder="Sam"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={errors.firstName}
            autoComplete="given-name"
          />
          <Input
            label="Last name"
            name="lastName"
            placeholder="Rivera (optional)"
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
          placeholder="captain@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <Input
          label="Mobile number"
          name="phone"
          type="tel"
          placeholder="e.g. 98765 43210 (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
          autoComplete="tel"
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

        <div className="rounded-2xl border border-ui-line bg-ui-card2/60 p-4">
          <p className="mb-4 flex items-center gap-2 text-sm font-bold text-ui-ink">
            <i className="ri-car-line" /> Vehicle information
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Color"
                name="vehicleColor"
                placeholder="e.g. Black"
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                error={errors.vehicleColor}
              />
              <Input
                label="Plate number"
                name="vehiclePlate"
                placeholder="e.g. MH-12-AB-1234"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                error={errors.vehiclePlate}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Capacity"
                name="vehicleCapacity"
                type="number"
                min="1"
                placeholder="e.g. 4"
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
                error={errors.vehicleCapacity}
              />
              <div>
                <label htmlFor="vehicleType" className="mb-1.5 block text-sm font-semibold text-ui-ink">
                  Vehicle type
                </label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className={`w-full rounded-xl border bg-ui-card px-4 py-2.5 text-sm text-ui-ink transition-colors focus:outline-none focus:ring-2 ${
                    errors.vehicleType
                      ? 'border-red-500/60 focus:ring-red-500/15'
                      : 'border-ui-line focus:border-ui-ink focus:ring-ui-ink/10'
                  }`}
                  aria-invalid={!!errors.vehicleType}
                >
                  <option value="" disabled>
                    Select vehicle type
                  </option>
                  {vehicleTypes.map((v) => (
                    <option key={v.value} value={v.value}>
                      {v.label}
                    </option>
                  ))}
                </select>
                {errors.vehicleType && (
                  <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
                    {errors.vehicleType}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Create captain account
        </Button>
      </form>
    </AuthLayout>
  );
};

export default CaptainSignup;
