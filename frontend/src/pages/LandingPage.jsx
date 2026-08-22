import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame,
  ArrowRight,
  Shield,
  CreditCard,
  Clock,
  ChefHat,
  Smartphone,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Search,
  Star,
  ShoppingBag,
  Utensils
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-reference-outer text-white selection:bg-[#FF3B30] selection:text-white overflow-hidden font-sans">
      
      {/* Top Stylish Navbar */}
      <nav className="relative z-20 max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF3B30] to-[#FF6B60] text-white flex items-center justify-center shadow-lg shadow-[#FF3B30]/40">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-white block">
              Smart <span className="text-[#FF3B30]">Mess</span>
            </span>
            <span className="text-[10px] text-[#8E8E93] font-bold block uppercase tracking-widest">
              Digital Ordering & Credits
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2.5 text-xs font-extrabold text-[#8E8E93] hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="btn-red-pill px-6 py-3 text-xs font-black uppercase tracking-wider text-white flex items-center gap-2"
          >
            <span>Register Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20 text-center">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#272727] border border-[#333333] text-[#FF3B30] text-xs font-black tracking-widest uppercase mb-8 shadow-xl"
        >
          <Sparkles className="w-4 h-4 text-[#FF3B30]" /> OFFICIAL MESS SYSTEM & CREDIT PORTAL
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-tight text-white"
        >
          Official Digital Mess. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B30] via-[#FF6B60] to-[#E50914]">
            Zero Token Queue.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-[#8E8E93] max-w-2xl mx-auto font-medium leading-relaxed"
        >
          Official campus mess dining platform. Real-time menu stock tracking, automatic 9,000 monthly student credits, and live kitchen order progression.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/register"
            className="btn-red-pill px-8 py-4 text-xs font-black uppercase tracking-widest text-white flex items-center gap-3 shadow-2xl"
          >
            <span>REGISTER OFFICIAL ACCOUNT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 text-xs font-black uppercase tracking-widest bg-[#222222] hover:bg-[#2A2A2A] text-white rounded-full border border-[#333333] transition"
          >
            Sign In To Portal
          </Link>
        </motion.div>


        {/* Interactive Dashboard Shell Preview (Matches Reference UI Design) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 max-w-5xl mx-auto bg-[#1A1A1A] border border-[#2B2B2B] rounded-[36px] p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left"
        >
          {/* Top Bar Mock */}
          <div className="flex items-center justify-between pb-6 border-b border-[#2D2D2D]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF3B30]" />
              <div className="w-3 h-3 rounded-full bg-[#FFCC00]" />
              <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
            </div>
            <div className="text-xs font-extrabold text-[#8E8E93] font-mono">
              smart-mess-dashboard.app
            </div>
          </div>

          {/* Grid Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            
            {/* Pop-Out Food Card Mock 1 */}
            <div className="bg-[#222222] border border-[#2D2D2D] rounded-[24px] p-4 text-center relative mt-6 pt-10">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden shadow-xl border-2 border-[#333333]">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80"
                  alt="Hamburger"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-sm font-black text-white">Hamburger</h4>
              <p className="text-[10px] text-[#8E8E93] font-bold">Starting From</p>
              <div className="text-sm font-black text-white font-mono">$10.00</div>
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#2D2D2D] text-[10px] font-bold text-[#8E8E93]">
                <div className="flex items-center gap-1 text-white">
                  <Star className="w-3 h-3 text-[#FFCC00] fill-[#FFCC00]" />
                  <span>4.8</span>
                </div>
                <span>1250 Sales</span>
              </div>
            </div>

            {/* Pop-Out Food Card Mock 2 */}
            <div className="bg-[#222222] border border-[#2D2D2D] rounded-[24px] p-4 text-center relative mt-6 pt-10">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden shadow-xl border-2 border-[#333333]">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80"
                  alt="Pepperoni Pizza"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-sm font-black text-white">Pepperoni Pizza</h4>
              <p className="text-[10px] text-[#8E8E93] font-bold">Starting From</p>
              <div className="text-sm font-black text-white font-mono">$15.50</div>
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#2D2D2D] text-[10px] font-bold text-[#8E8E93]">
                <div className="flex items-center gap-1 text-white">
                  <Star className="w-3 h-3 text-[#FFCC00] fill-[#FFCC00]" />
                  <span>4.9</span>
                </div>
                <span>2100 Sales</span>
              </div>
            </div>

            {/* Right Cart Mock */}
            <div className="bg-[#222222] border border-[#2D2D2D] rounded-[24px] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-white flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5" /> Cart Preview
                </span>
                <span className="text-[#8E8E93]">ID: #1099</span>
              </div>
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#1A1A1A] rounded-full border border-[#2D2D2D] text-[10px] text-center">
                <div className="btn-red-pill py-1 text-white font-extrabold">Delivery</div>
                <div className="py-1 text-[#8E8E93] font-bold">Dine in</div>
                <div className="py-1 text-[#8E8E93] font-bold">Takeaway</div>
              </div>
              <div className="py-3 px-4 bg-[#1C1C1C] text-white text-[11px] font-black rounded-full text-center uppercase tracking-widest">
                Confirm Order
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-20 bg-[#171717] border-y border-[#262626]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#FF3B30]">POWERFUL FEATURES</h2>
            <p className="text-3xl sm:text-4xl font-black text-white">Built Specifically for Mess Management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={CreditCard}
              title="9,000 Monthly Credits"
              description="Automatic balance reset every month. Students place orders without cash or physical tokens."
            />
            <FeatureCard
              icon={Clock}
              title="Real-Time Menu Stock"
              description="Item counts automatically decrease as orders arrive. Out-of-stock items flag as Sold Out instantly."
            />
            <FeatureCard
              icon={ChefHat}
              title="Chef Kitchen Display"
              description="Kitchen staff accepts, prepares, and marks dishes ready with atomic status progression."
            />
            <FeatureCard
              icon={CheckCircle2}
              title="5-Stage Order Progress"
              description="Students watch live order progress steps: Pending → Accepted → Preparing → Ready → Picked Up."
            />
            <FeatureCard
              icon={Shield}
              title="Role-Based Security"
              description="JWT tokens, bcrypt passwords, and strict role guards protecting Student, Chef, and Admin routes."
            />
            <FeatureCard
              icon={BarChart3}
              title="Admin Analytics & Reports"
              description="Full CRUD controls for users and menu items plus system revenue and order activity reporting."
            />
          </div>
        </div>
      </section>

      {/* Interactive Role Portals Section */}
      <section id="demo-roles" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-[#FF3B30]">LIVE ACCESS PORTALS</h2>
          <p className="text-3xl sm:text-4xl font-black text-white">Try Any Role Portal Instant Launch</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <RoleCard
            title="Student Portal"
            badge="STUDENT"
            description="Browse today's menu, filter by category disk, add pop-out dishes to cart, and use monthly credit balance."
            email="student@vit.edu"
            onLaunch={() => navigate('/login')}
          />
          <RoleCard
            title="Chef Kitchen Portal"
            badge="CHEF"
            description="Live kitchen order Kanban columns. Accept orders, mark items preparing, and toggle dish availability."
            email="chef@vit.edu"
            onLaunch={() => navigate('/login')}
          />
          <RoleCard
            title="Admin Management"
            badge="ADMIN"
            description="Full mess administrative control. Manage students, chefs, menu prices, monthly credit top-ups, and sales."
            email="admin@vit.edu"
            onLaunch={() => navigate('/login')}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#262626] py-10 bg-[#121011] text-[#8E8E93] text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#FF3B30] text-white flex items-center justify-center">
              <Flame className="w-4 h-4 fill-white" />
            </div>
            <span className="font-extrabold text-white text-sm">Smart Mess Digital System</span>
          </div>
          <p className="text-center md:text-right text-[#8E8E93]">
            VIT College Capstone Project | Production Ready SaaS Architecture
          </p>
        </div>
      </footer>

    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-6 bg-[#222222] border border-[#2D2D2D] hover:border-[#FF3B30] rounded-[24px] transition duration-300 space-y-3 shadow-xl">
    <div className="w-10 h-10 rounded-2xl bg-[#1A1A1A] border border-[#333333] text-[#FF3B30] flex items-center justify-center">
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="text-base font-black text-white">{title}</h3>
    <p className="text-xs text-[#8E8E93] leading-relaxed">{description}</p>
  </div>
);

const RoleCard = ({ title, badge, description, email, onLaunch }) => (
  <div className="p-7 bg-[#222222] border border-[#2D2D2D] hover:border-[#FF3B30] rounded-[28px] text-left space-y-4 transition duration-300 shadow-2xl flex flex-col justify-between">
    <div className="space-y-3">
      <span className="px-3.5 py-1 text-[10px] font-black bg-[#1A1A1A] text-[#FF3B30] border border-[#333333] rounded-full uppercase tracking-wider inline-block">
        {badge}
      </span>
      <h3 className="text-xl font-black text-white">{title}</h3>
      <p className="text-xs text-[#8E8E93] leading-relaxed">{description}</p>
    </div>

    <div className="pt-4 border-t border-[#2D2D2D] space-y-3">
      <div className="text-[11px] text-[#8E8E93] font-medium">
        Demo Login: <code className="text-white font-mono font-bold">{email}</code> / <code className="text-[#FF3B30] font-mono">Password123</code>
      </div>
      <button
        type="button"
        onClick={onLaunch}
        className="w-full py-3 bg-[#1C1C1C] hover:bg-[#FF3B30] text-white text-xs font-black uppercase tracking-wider rounded-full border border-[#333333] hover:border-[#FF3B30] transition duration-300 flex items-center justify-center gap-2"
      >
        <span>Open Sign In</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

