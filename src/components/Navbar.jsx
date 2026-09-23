import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sparkles, Menu, X, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Login', path: '/login', icon: LogIn },
    { name: 'Register', path: '/register', icon: UserPlus, isButton: true },
  ];

  return (
    <>
      {/* Skip to Main Content Link for screen readers and keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center gap-2.5 rounded-lg p-1.5 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
                aria-label="AccessAI Home"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-700 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                    Access<span className="text-indigo-700">AI</span>
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                    Accessibility Copilot
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2" aria-label="Main Navigation">
              {navLinks.map((link) => {
                if (link.isButton) {
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="ml-2 inline-flex items-center justify-center px-4 py-2.5 text-base font-semibold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
                    >
                      {link.name}
                    </Link>
                  );
                }

                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-lg text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2 ${
                        isActive
                          ? 'text-indigo-800 bg-indigo-50 border-b-2 border-indigo-700'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                );
              })}
            </nav>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600 focus-visible:outline-offset-2"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
            <nav aria-label="Mobile Navigation" className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-base font-semibold transition-colors flex items-center justify-between ${
                      isActive
                        ? 'text-indigo-800 bg-indigo-50 font-bold border-l-4 border-indigo-700'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
