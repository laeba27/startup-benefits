'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp, 
  CheckCircle2,
  Sparkles,
  Lock,
  Globe,
  BarChart3,
  Megaphone,
  Database,
  Cloud,
  Star,
  Award,
  Rocket,
  Code2,
  Cpu,
  Activity,
  ChevronDown,
  Lightbulb,
  Target,
  Flame,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useRef, useState } from 'react';

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.48, 0.15, 0.25, 0.96]
      }
    }
  };

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"></div>
          
          {/* Animated Gradient Orbs */}
          <motion.div
            className="absolute top-10 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-blue-100 rounded-full blur-3xl opacity-40"
            animate={{
              x: [0, 80, 0],
              y: [0, -40, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -top-20 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200 to-pink-100 rounded-full blur-3xl opacity-40"
            animate={{
              x: [0, -80, 0],
              y: [0, 40, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-tr from-indigo-200 to-transparent rounded-full blur-3xl opacity-30"
            animate={{
              x: [0, 40, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div 
          className="max-w-6xl mx-auto text-center relative z-10"
          style={{ opacity, scale }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.48, 0.15, 0.25, 0.96] }}
          >
            {/* Animated Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white border border-slate-200 rounded-full text-slate-700 text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Join 5,000+ startups saving big</span>
            </motion.div>

            {/* Main Heading */}
            <div className="mb-8">
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-slate-900 via-blue-700 to-slate-900 bg-clip-text text-transparent">
                  Save up to 90%
                </span>
              </motion.h1>
              
              <motion.h2
                className="text-4xl md:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  on SaaS essentials
                </span>
              </motion.h2>
            </div>
            
            <motion.p
              className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Access exclusive deals on cloud services, marketing tools, analytics platforms, and productivity software 
              <span className="block text-slate-700 font-medium mt-2">designed specifically for early-stage startups</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Link href="/deals">
                <Button size="lg" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all">
                  Browse All Deals
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/register">
                <Button variant="outline" size="lg" className="group border-2 border-slate-300 hover:border-blue-600 hover:bg-slate-50">
                  Get Started Free
                  <Rocket className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            {/* Trust Signals */}
            <motion.div
              className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>No credit card</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>150+ verified deals</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Instant access</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-slate-400" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { value: "$2.4M+", label: "Saved by startups", icon: TrendingUp },
              { value: "150+", label: "Partner deals", icon: Award },
              { value: "5,000+", label: "Active users", icon: Users },
              { value: "95%", label: "Satisfaction rate", icon: Star }
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="text-center p-6 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <motion.div
                  className="inline-block mb-3"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className="w-6 h-6 text-blue-600 mx-auto" />
                </motion.div>
                <motion.div
                  className="text-4xl font-bold text-slate-900 mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-slate-600 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
              Everything your startup needs
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
              From cloud infrastructure to marketing automation
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: Cloud,
                title: "Cloud Services",
                description: "AWS, Azure, GCP credits & hosting",
                color: "from-blue-500 to-cyan-500",
                count: "35+ deals"
              },
              {
                icon: Megaphone,
                title: "Marketing Tools",
                description: "SEO, email, social media management",
                color: "from-purple-500 to-pink-500",
                count: "28+ deals"
              },
              {
                icon: BarChart3,
                title: "Analytics & BI",
                description: "Data analytics & business intelligence",
                color: "from-orange-500 to-red-500",
                count: "22+ deals"
              },
              {
                icon: Shield,
                title: "Security",
                description: "Cybersecurity & compliance services",
                color: "from-green-500 to-emerald-500",
                count: "18+ deals"
              },
              {
                icon: Database,
                title: "Databases",
                description: "SQL, NoSQL & managed databases",
                color: "from-indigo-500 to-purple-500",
                count: "15+ deals"
              },
              {
                icon: Zap,
                title: "Productivity",
                description: "Project management & automation",
                color: "from-yellow-500 to-orange-500",
                count: "42+ deals"
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                className="group relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <motion.div
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${category.color} text-white mb-4`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <category.icon className="w-6 h-6" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 font-light">
                  {category.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-sm font-semibold text-blue-600">{category.count}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
              Start saving in minutes
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
              Three simple steps to access exclusive SaaS deals
            </p>
          </motion.div>

          <div className="relative">
            <motion.div
              className="grid md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {[
                {
                  step: "1",
                  icon: Users,
                  title: "Create Account",
                  description: "Sign up in seconds with passwordless authentication. No credit card required."
                },
                {
                  step: "2",
                  icon: Lock,
                  title: "Get Verified",
                  description: "Quick verification unlocks exclusive deals reserved for verified startups."
                },
                {
                  step: "3",
                  icon: Rocket,
                  title: "Claim Deals",
                  description: "Browse and claim deals to start saving on tools your startup needs to grow."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="relative text-center"
                  variants={itemVariants}
                >
                  <motion.div
                    className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg mb-6 relative"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <item.icon className="w-10 h-10" />
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg">
                      {item.step}
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-light">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
              Built for startup success
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
              Every feature designed with founders in mind
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { icon: Lightbulb, title: "Instant Access", description: "Get access codes immediately" },
              { icon: Shield, title: "Verified Partners", description: "Every deal is fully verified" },
              { icon: Star, title: "Exclusive Offers", description: "Deals not available elsewhere" },
              { icon: TrendingUp, title: "Scale Ready", description: "Grow from MVP to Series A" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all"
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                <motion.div
                  className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="h-6 w-6" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm font-light">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="flex justify-center mb-6 gap-1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                </motion.div>
              ))}
            </motion.div>

            <motion.h3
              className="text-3xl font-bold text-slate-900 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              Trusted by thousands of founders
            </motion.h3>

            <motion.p
              className="text-lg text-slate-600 italic mb-8 leading-relaxed font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
            >
              "This platform saved us over $50,000 in our first year. As a bootstrapped startup, these exclusive deals were absolutely critical to our early growth and allowed us to invest more in product development."
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-slate-900 font-semibold text-lg">Sarah Chen</div>
              <div className="text-slate-600 text-sm">Founder & CEO, TechStartup Inc.</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Integrations Hint */}
      <section className="py-24 px-4 bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Popular SaaS tools included
            </h2>
            <p className="text-lg text-slate-600 font-light">
              Access deals from the world's leading platforms
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { name: "AWS", icon: Cloud },
              { name: "Azure", icon: Globe },
              { name: "Stripe", icon: Activity },
              { name: "HubSpot", icon: Megaphone },
              { name: "Figma", icon: Code2 },
              { name: "DataDog", icon: BarChart3 }
            ].map((tool, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 border border-slate-200 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all"
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                <tool.icon className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-slate-900">{tool.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
          
          {/* Floating elements */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-block mb-8"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-16 h-16 text-white" />
            </motion.div>
            
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Ready to start saving?
            </h2>

            <p className="text-lg md:text-xl text-white/90 mb-12 leading-relaxed font-light">
              Join thousands of startups accessing exclusive SaaS deals.
              <span className="block text-white font-medium mt-3">No credit card. No strings. Just savings.</span>
            </p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link href="/register">
                <Button size="lg" variant="secondary" className="group bg-white text-blue-600 hover:bg-slate-100 text-base px-8 py-6 font-semibold shadow-xl">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/deals">
                <Button size="lg" variant="outline" className="group border-2 border-white text-white hover:bg-white/10 text-base px-8 py-6">
                  Browse Deals
                </Button>
              </Link>
            </motion.div>

            <motion.p
              className="mt-10 text-sm text-white/75 font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.75 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              Join in less than 30 seconds • Instant access to 150+ deals
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Footer Light */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <motion.p
            className="text-slate-600 text-sm font-light"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © 2024 Startup Benefits Platform. All rights reserved.
          </motion.p>
        </div>
      </footer>
    </div>
  );
}

