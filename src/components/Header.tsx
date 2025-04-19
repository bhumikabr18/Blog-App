import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, PenSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <PenSquare className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-800">BlogSpace</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {session?.user ? (
              <>
                <Link
                  to="/create"
                  className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Create Blog
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            {session?.user ? (
              <>
                <Link
                  to="/create"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-500 hover:bg-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Blog
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-500 hover:bg-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;