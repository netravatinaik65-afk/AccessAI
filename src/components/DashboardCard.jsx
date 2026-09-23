import React from 'react';
import { Camera, FileText, MessageSquareQuote, Headphones, Globe } from 'lucide-react';
import Button from './Button';

const DASHBOARD_ICONS = {
  camera: Camera,
  'file-text': FileText,
  'message-square-quote': MessageSquareQuote,
  headphones: Headphones,
  globe: Globe,
};

export default function DashboardCard({
  title,
  description,
  icon,
  status,
  category,
  onSelect,
}) {
  const IconComponent = DASHBOARD_ICONS[icon] || FileText;

  return (
    <section 
      aria-labelledby={`card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
      className="flex flex-col justify-between bg-white rounded-2xl p-6 sm:p-7 border-2 border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all duration-200"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-13 h-13 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center p-3">
            <IconComponent className="w-7 h-7" aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
            {category}
          </span>
        </div>

        <h3
          id={`card-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-xl font-bold text-slate-900 mb-2"
        >
          {title}
        </h3>

        <p className="text-base text-slate-600 leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
          {status}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={onSelect}
          ariaLabel={`Select ${title} module`}
        >
          Open Module
        </Button>
      </div>
    </section>
  );
}
