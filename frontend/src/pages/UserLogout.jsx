import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/brand/Logo';
import Spinner from '../components/ui/Spinner';
import api from '../lib/api';
import { UserDataContext } from '../context/UserContext';
import { useContext } from 'react';

const UserLogout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/users/logout')
      .then(() => {
        if (cancelled) return;
        localStorage.removeItem('token');
        setUser({ email: '', fullName: { firstName: '', lastName: '' } });
        navigate('/login');
      })
      .catch(() => {
        if (cancelled) return;
        // Clear local state even if the server call failed
        localStorage.removeItem('token');
        setUser({ email: '', fullName: { firstName: '', lastName: '' } });
        navigate('/login');
      });
    return () => {
      cancelled = true;
    };
  }, [navigate, setUser]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ui-canvas">
      <Logo size={40} />
      <div className="flex items-center gap-2.5 text-ui-muted">
        <Spinner className="h-5 w-5" />
        <p className="text-sm font-medium">Signing you out…</p>
      </div>
    </div>
  );
};

export default UserLogout;
