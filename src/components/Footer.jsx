import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';
import { APP_CONFIG } from '../utils/constants';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Access<span className="text-indigo-400">AI</span>
              </span>
            </div>
            <p className="text-slate-300 text-base max-w-md leading-relaxed">
              {APP_CONFIG.tagline}
            </p>
            <p className="text-slate-400 text-sm max-w-md">
              Designed with strict adherence to WCAG 2.1 accessibility standards, prioritizing high contrast, keyboard navigability, and clear visual hierarchy.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h2 className="text-white text-base font-bold tracking-wide uppercase mb-4">
              Quick Links
            </h2>
            <ul className="space-y-2.5 text-base">
              <li>
                <Link
                  to="/"
                  className="text-slate-300 hover:text-white underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-400 rounded"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-slate-300 hover:text-white underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-400 rounded"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-400 rounded"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-slate-300 hover:text-white underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-indigo-400 rounded"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Accessibility Standards Note */}
          <div>
            <h2 className="text-white text-base font-bold tracking-wide uppercase mb-4">
              Inclusion First
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Built for the Hackathon: AI for Accessibility & Inclusion.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 text-xs text-indigo-300 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              WCAG 2.1 AA Target
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} AccessAI Copilot. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Engineered with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" aria-hidden="true" /> for universal digital access
          </p>
        </div>
      </div>
    </footer>
  );
}
