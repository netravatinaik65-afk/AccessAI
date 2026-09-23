import React from 'react';
import { Eye, BookOpen, Mic, Languages } from 'lucide-react';

const ICON_MAP = {
  eye: Eye,
  'book-open': BookOpen,
  mic: Mic,
  languages: Languages,
};

export default function FeatureCard({ title, description, icon, badge }) {
  const IconComponent = ICON_MAP[icon] || Eye;

  return (
    <div className="flex flex-col bg-white rounded-2xl p-7 border-2 border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-5">
        <div className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
          <IconComponent className="w-7 h-7" aria-hidden="true" />
        </div>
        {badge && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-slate-100 text-slate-800 border border-slate-300">
            {badge}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2.5">
        {title}
      </h3>

      <p className="text-base text-slate-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
