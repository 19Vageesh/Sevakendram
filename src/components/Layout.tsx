import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu as MenuIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/mess-menu', label: 'Mess Menu' },
    { path: '/complaints', label: 'Complaints' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {user && (
        <nav className="bg-black border-b border-red-900/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold text-red-500">
                  Sevakendram
                </Link>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex ml-10 items-center space-x-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(link.path)
                          ? 'bg-red-900/20 text-red-400 border border-red-800/30'
                          : 'text-gray-400 hover:bg-red-900/10 hover:text-red-400'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-400 hover:text-red-400 p-2"
                >
                  <MenuIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="hidden md:flex items-center gap-4">
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive('/profile')
                      ? 'bg-red-900/20 text-red-400 border border-red-800/30'
                      : 'text-gray-400 hover:bg-red-900/10 hover:text-red-400'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-gray-400 hover:text-red-400 px-4 py-2 rounded-lg transition-colors hover:bg-red-900/10"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-black border-t border-red-900/20">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-3 py-2 rounded-lg text-base font-medium ${
                      isActive(link.path)
                        ? 'bg-red-900/20 text-red-400 border border-red-800/30'
                        : 'text-gray-400 hover:bg-red-900/10 hover:text-red-400'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/profile"
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isActive('/profile')
                      ? 'bg-red-900/20 text-red-400 border border-red-800/30'
                      : 'text-gray-400 hover:bg-red-900/10 hover:text-red-400'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-gray-400 hover:text-red-400 hover:bg-red-900/10 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </nav>
      )}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}