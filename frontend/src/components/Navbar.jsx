import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, admin, logout, adminLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (admin) {
      adminLogout();
    } else {
      logout();
    }
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-semibold text-indigo-600">
          PrimeTrade
        </Link>
        {user || admin ? (
          <div className="flex items-center gap-3 text-sm">
            <div className="text-slate-700">
              <div className="font-semibold">{admin?.name || user?.name}</div>
              {admin && <div className="text-xs text-purple-600">Admin</div>}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-slate-900 px-3 py-2 text-white transition hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;

