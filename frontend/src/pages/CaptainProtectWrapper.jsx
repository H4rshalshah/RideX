import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/brand/Logo';
import Spinner from '../components/ui/Spinner';
import { CaptainDataContext } from '../context/CapatainContext';
import api from '../lib/api';

const CaptainProtectWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/captain-login');
      return;
    }

    let cancelled = false;
    api
      .get('/captains/profile')
      .then((response) => {
        if (cancelled) return;
        setCaptain(response.data.captain);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem('token');
        navigate('/captain-login');
      });
    return () => {
      cancelled = true;
    };
  }, [navigate, setCaptain]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ui-canvas">
        <Logo size={40} />
        <div className="flex items-center gap-2.5 text-ui-muted">
          <Spinner className="h-5 w-5" />
          <p className="text-sm font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return children;
};

export default CaptainProtectWrapper;
