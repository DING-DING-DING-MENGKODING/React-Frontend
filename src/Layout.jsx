import { useParams, Link, useNavigate } from 'react-router-dom';
import { users } from './dummy/users';

export default function Layout({ children }) {
  const { facilityId } = useParams();
  const navigate = useNavigate();
  const user = users[facilityId];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <header className="bg-[#E30030] shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-bold text-white">{user?.facilityName}</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-4">
              <Link to={`/${facilityId}`} className="text-white hover:text-white/80">
                Dashboard
              </Link>
              <Link to={`/${facilityId}/ambulance`} className="text-white hover:text-white/80">
                Ambulance
              </Link>
              {user?.features.includes('blood') && (
                <Link to={`/${facilityId}/darah`} className="text-white hover:text-white/80">
                  Kantong Darah
                </Link>
              )}
              {user?.features.includes('oxygen') && (
                <Link to={`/${facilityId}/oksigen`} className="text-white hover:text-white/80">
                  Tabung Oksigen
                </Link>
              )}
            </nav>
            <button 
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}