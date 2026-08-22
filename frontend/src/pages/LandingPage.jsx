import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UtensilsCrossed,
  ArrowRight,
  Shield,
  CreditCard,
  Clock,
  ChefHat,
  Smartphone,
  BarChart,
  CheckCircle2,
  Github
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#E50914] selection:text-white overflow-hidden">
      {/* Background Red Mesh Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-[#E50914]/15 via-[#B91C1C]/10 to-transparent blur-3xl rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E50914] text-white flex items-center justify-center shadow-lg shadow-[#E50914]/30">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            Smart <span className="text-[#E50914]">Mess</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2.5 text-xs font-semibold text-[#A3A3A3] hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            to="/login"
            className="px-5 py-2.5 text-xs font-bold bg-[#E50914] hover:bg-[#FF2D2D] text-white rounded-lg transition shadow-lg shadow-[#E50914]/25 flex items-center gap-2"
          >
            GET STARTED <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#450A0A] border border-[#7F1D1D] text-[#FF2D2D] text-xs font-bold uppercase tracking-wider mb-6"
        >
          <Sparkles className="w-4 h-4" /> Next-Gen College Mess SaaS Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-tight text-white"
        >
          Smart Ordering. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2D2D] via-[#E50914] to-[#B91C1C]">
            Less Waiting.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-[#A3A3A3] max-w-2xl mx-auto font-medium leading-relaxed"
        >
          Digitize your college mess ordering experience with real-time menu availability, monthly credit management, and instant kitchen order tracking.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/login"
            className="px-8 py-3.5 text-sm font-extrabold bg-[#E50914] hover:bg-[#FF2D2D] text-white rounded-lg transition shadow-xl shadow-[#E50914]/25 flex items-center gap-3"
          >
            GET STARTED <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="px-8 py-3.5 text-sm font-bold bg-[#111111] border border-[#242424] hover:border-[#7F1D1D] text-white rounded-lg transition"
          >
            LOGIN
          </Link>
        </motion.div>

        {/* Hero Features Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 max-w-5xl mx-auto bg-[#111111] border border-[#242424] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#E50914]/10 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition duration-700" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#450A0A] border border-[#7F1D1D] text-[#FF2D2D] flex items-center justify-center font-bold">
                💳
              </div>
              <h3 className="font-bold text-white text-base">9,000 Monthly Credits</h3>
              <p className="text-xs text-[#A3A3A3]">Automated credit reset each month. Seamless digital token-free wallet.</p>
            </div>
            <div className="p-6 bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#450A0A] border border-[#7F1D1D] text-[#FF2D2D] flex items-center justify-center font-bold">
                ⚡
              </div>
              <h3 className="font-bold text-white text-base">Atomic Orders</h3>
              <p className="text-xs text-[#A3A3A3]">Single database transaction safety. Instant credit deduction & refunding.</p>
            </div>
            <div className="p-6 bg-[#0A0A0A] border border-[#1C1C1C] rounded-xl space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#450A0A] border border-[#7F1D1D] text-[#FF2D2D] flex items-center justify-center font-bold">
                👨‍🍳
              </div>
              <h3 className="font-bold text-white text-base">Kitchen Display</h3>
              <p className="text-xs text-[#A3A3A3]">Real-time status updates: Pending → Accepted → Preparing → Ready.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#0A0A0A] border-y border-[#1F1F1F] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#E50914]">System Features</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Built for Modern Campus Life</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Smartphone}
              title="Digital Food Ordering"
              description="Browse categorization, check availability, search menu items, and place instant orders directly from your phone."
            />
            <FeatureCard
              icon={CreditCard}
              title="Monthly Credit Management"
              description="Automatic allocation of 9,000 monthly credits per student with complete transaction ledger logs."
            />
            <FeatureCard
              icon={Clock}
              title="Real Time Menu"
              description="Live stock tracking. When an item runs out, it automatically updates to Sold Out for all students."
            />
            <FeatureCard
              icon={CheckCircle2}
              title="Order Tracking"
              description="Interactive 5-stage progress indicator keeping students notified from kitchen acceptance to pickup."
            />
            <FeatureCard
              icon={ChefHat}
              title="Chef Dashboard"
              description="Dedicated kitchen display view allowing chefs to manage incoming orders and toggle item availability."
            />
            <FeatureCard
              icon={BarChart}
              title="Admin Management"
              description="Full CRUD controls for Students, Chefs, and Menu items along with analytical reports and credit top-ups."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#E50914]">Workflow</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white mt-2">How The System Works</p>
        </div>

        <div className="relative border-l-2 border-[#242424] md:border-l-0 md:flex justify-between items-start max-w-4xl mx-auto">
          <TimelineStep step="1" title="Student Login" description="Sign in securely with student credentials." />
          <TimelineStep step="2" title="View Menu" description="Explore breakfast, lunch, dinner & snacks." />
          <TimelineStep step="3" title="Place Order" description="Select items & confirm shopping cart." />
          <TimelineStep step="4" title="Credits Deducted" description="Atomic transaction deducts wallet balance." />
          <TimelineStep step="5" title="Chef Receives" description="Kitchen accepts & begins preparation." />
          <TimelineStep step="6" title="Food Ready" description="Pick up meal token-free at counter." />
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-24 bg-[#0A0A0A] border-t border-[#1F1F1F]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#E50914]">Access Portals</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Tailored Role Experiences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RoleCard
              role="Student"
              badge="STUDENT"
              description="Order food token-free, monitor monthly credits, track order progress, and view transaction invoices."
              email="student@vit.edu"
            />
            <RoleCard
              role="Chef"
              badge="CHEF"
              description="Manage live kitchen order queues, mark orders as accepted/preparing/ready, and update menu stock."
              email="chef@vit.edu"
            />
            <RoleCard
              role="Admin"
              badge="ADMIN"
              description="Oversee campus mess metrics, manage student & chef accounts, execute credit resets, and view analytics."
              email="admin@vit.edu"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1F1F1F] py-12 bg-[#050505] text-[#A3A3A3] text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-2 font-bold text-white text-base">
              <UtensilsCrossed className="w-5 h-5 text-[#E50914]" /> Smart Mess System
            </div>
            <p className="mt-1">Production-ready College SaaS Project | Digital Mess & Credit Management</p>
          </div>
          <div className="flex items-center gap-6 text-[#A3A3A3]">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
              <Github className="w-4 h-4" /> GitHub Repository
            </a>
            <span>VIT College Capstone Project</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-6 bg-[#111111] border border-[#242424] hover:border-[#7F1D1D] rounded-2xl transition">
    <div className="w-12 h-12 rounded-xl bg-[#450A0A] border border-[#7F1D1D] text-[#FF2D2D] flex items-center justify-center mb-4">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-base font-bold text-white mb-2">{title}</h3>
    <p className="text-xs text-[#A3A3A3] leading-relaxed">{description}</p>
  </div>
);

const TimelineStep = ({ step, title, description }) => (
  <div className="relative pl-8 md:pl-0 md:text-center mb-8 md:mb-0 flex-1 px-2">
    <div className="w-8 h-8 rounded-full bg-[#E50914] text-white font-extrabold flex items-center justify-center text-xs mx-auto mb-3">
      {step}
    </div>
    <h4 className="font-bold text-sm text-white">{title}</h4>
    <p className="text-[11px] text-[#A3A3A3] mt-1">{description}</p>
  </div>
);

const RoleCard = ({ role, badge, description, email }) => (
  <div className="p-8 bg-[#111111] border border-[#242424] hover:border-[#7F1D1D] rounded-2xl text-left space-y-4 transition">
    <span className="px-3 py-1 text-[10px] font-extrabold bg-[#450A0A] text-[#FF2D2D] border border-[#7F1D1D] rounded-full tracking-wider">
      {badge}
    </span>
    <h3 className="text-xl font-bold text-white">{role} Portal</h3>
    <p className="text-xs text-[#A3A3A3] leading-relaxed">{description}</p>
    <div className="pt-4 border-t border-[#242424] text-xs">
      <span className="text-[#737373] block">Demo Credentials:</span>
      <code className="text-[#FF2D2D] font-mono">{email} / Password123</code>
    </div>
  </div>
);

const Sparkles = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2 2m-7 7l-2 2m0-11l2 2m7 7l2 2" />
  </svg>
);
