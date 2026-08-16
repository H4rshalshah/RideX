import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/brand/Logo';
import Spinner from '../components/ui/Spinner';
import { UserDataContext } from '../context/UserContext';
import api from '../lib/api';

const UserProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    let cancelled = false;
    api
      .get('/users/profile')
      .then((response) => {
        if (cancelled) return;
        setUser(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem('token');
        navigate('/login');
      });
    return () => {
      cancelled = true;
    };
  }, [navigate, setUser]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950">
        <Logo light size={40} />
        <div className="flex items-center gap-2.5 text-white/80">
          <Spinner className="h-5 w-5" />
          <p className="text-sm font-medium">Loading your ride…</p>
        </div>
      </div>
    );
  }

  return children;
};

export default UserProtectWrapper;
