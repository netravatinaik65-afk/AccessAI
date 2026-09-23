import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import Button from '../components/Button';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Page Not Found');

  return (
    <div className="py-20 px-4 text-center max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-6">
        <AlertTriangle className="w-8 h-8" aria-hidden="true" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
        404 — Page Not Found
      </h1>
      <p className="text-slate-600 text-base mb-8">
        The accessibility page or module you are looking for does not exist or may have been moved.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg">
          <Home className="w-5 h-5 mr-2" aria-hidden="true" />
          Return to Home
        </Button>
      </Link>
    </div>
  );
}
