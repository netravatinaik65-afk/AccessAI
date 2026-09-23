import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';
import Button from '../components/Button';
import FeatureCard from '../components/FeatureCard';
import { APP_CONFIG, LANDING_FEATURES } from '../utils/constants';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function LandingPage() {
  useDocumentTitle('Accessible AI Copilot');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        aria-labelledby="hero-heading"
        className="relative bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 py-16 sm:py-24 border-b border-slate-200"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Accessibility & Inclusion Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-indigo-700" aria-hidden="true" />
            <span>Hackathon Project: AI for Accessibility & Inclusion</span>
          </div>

          {/* Project Name and Tagline */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6"
          >
            Access<span className="text-indigo-700">AI</span>
            <span className="block text-2xl sm:text-4xl font-extrabold text-slate-700 mt-2">
              {APP_CONFIG.tagline}
            </span>
          </h1>

          {/* Project Explanation */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            {APP_CONFIG.description} Breaking down digital and visual barriers through intuitive AI assistance tailored to your individual needs.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto text-lg shadow-md hover:shadow-lg"
                ariaLabel="Get Started with AccessAI"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-1" aria-hidden="true" />
              </Button>
            </Link>

            <a href="#features" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-lg"
                ariaLabel="Learn more about features"
              >
                Learn More
              </Button>
            </a>
          </div>

          {/* Accessibility Guarantees Pill List */}
          <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
            <div className="flex items-center gap-2.5 text-slate-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
              <span className="text-sm font-semibold">High Contrast Readability</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" aria-hidden="true" />
              <span className="text-sm font-semibold">Keyboard-First Navigation</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700">
              <HeartHandshake className="w-5 h-5 text-purple-600 shrink-0" aria-hidden="true" />
              <span className="text-sm font-semibold">Screen-Reader Optimized</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Preview Cards Section */}
      <section
        id="features"
        aria-labelledby="features-heading"
        className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4"
          >
            Empowering Accessibility Tools
          </h2>
          <p className="text-lg text-slate-600">
            AccessAI is engineered with assistive intelligence to adapt to diverse visual, cognitive, and linguistic needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {LANDING_FEATURES.map((feature) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              badge={feature.badge}
            />
          ))}
        </div>
      </section>

      {/* Call to action banner */}
      <section
        aria-labelledby="cta-heading"
        className="bg-indigo-900 text-white py-14 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to experience an accessible web?
          </h2>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
            Join AccessAI today and navigate digital information with greater clarity, independence, and confidence.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-indigo-950 hover:bg-slate-100 font-bold px-8 py-3.5"
                ariaLabel="Create free AccessAI account"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
