import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import saladeImg from './salade.png';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <nav className="bg-white border-b shadow sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={saladeImg} alt="Waste Wise Eats" className="h-10" />
            <span className="ml-2 text-xl font-bold text-orange-500 select-none">
              Waste Wise Eats
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center space-x-6">
            <Link
              to="/search"
              className="text-orange-600 hover:text-orange-800 font-medium"
            >
              Search
            </Link>

            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center text-gray-700 hover:text-orange-600 font-medium"
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-red-600 hover:text-red-800 font-semibold"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-orange-600 hover:text-orange-800 font-medium"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Hamburger button mobile */}
          <button
            onClick={toggleDrawer}
            className="sm:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {drawerOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Drawer menu mobile */}
      {/* Fond overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
      ></div>

      {/* Menu drawer */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col mt-20 space-y-6 px-6">
          <Link
            to="/search"
            className="text-orange-600 font-semibold hover:text-orange-800"
            onClick={closeDrawer}
          >
            Search
          </Link>

          {currentUser ? (
            <>
              <Link
                to="/profile"
                className="text-gray-700 font-semibold hover:text-orange-600 flex items-center"
                onClick={closeDrawer}
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  closeDrawer();
                }}
                className="text-red-600 font-semibold hover:text-red-800 text-left"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-orange-600 font-semibold hover:text-orange-800"
              onClick={closeDrawer}
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
