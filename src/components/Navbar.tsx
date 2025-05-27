import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { RootState } from '../store/store';
import SearchBar from './SearchBar';
import { FiShoppingCart } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartTotal = cartItems.reduce((total, item) => total + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/orders', label: 'Orders' },
  ];

  return (
    <nav className="bg-white dark:bg-dark-secondary shadow-navbar sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            E-Shop
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-gray-700 dark:text-dark-primary hover:text-primary-600 dark:hover:text-primary-400`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Cart and Mobile Menu Button */}
          <div className="flex items-center space-x-6">
            <Link
              to="/cart"
              className="relative text-gray-700 dark:text-dark-primary hover:text-primary-600 dark:hover:text-primary-400 p-2"
            >
              <FiShoppingCart className="w-6 h-6" />
              {cartTotal > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartTotal}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-3 py-2">
                <SearchBar />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 