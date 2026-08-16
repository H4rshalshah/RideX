import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/brand/Logo';
import Spinner from '../components/ui/Spinner';
import api from '../lib/api';
import { CaptainDataContext } from '../context/CapatainContext';
import { useContext } from 'react';

const CaptainLogout = () => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);

  useEffect(() => {
    let cancelled = false;
    api
      .get('/captains/logout')
      .then(() => {
        if (cancelled) return;
        localStorage.removeItem('token');
        setCaptain(null);
        navigate('/captain-login');
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem('token');
        setCaptain(null);
        navigate('/captain-login');
      });
    return () => {
      cancelled = true;
    };
  }, [navigate, setCaptain]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950">
      <Logo light size={40} />
      <div className="flex items-center gap-2.5 text-white/80">
        <Spinner className="h-5 w-5" />
        <p className="text-sm font-medium">Signing you out…</p>
      </div>
    </div>
  );
};

export default CaptainLogout;
