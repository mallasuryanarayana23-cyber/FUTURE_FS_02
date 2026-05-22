import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
  TrendingUp, 
  Sparkles, 
  Layers, 
  Shield, 
  Zap, 
  MessageSquare, 
  Send, 
  Phone, 
  Mail, 
  MapPin, 
  Building,
  CheckCircle,
  Users,
  Award,
  ChevronRight
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  
  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    source: 'Website Contact Form'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Input Validation
  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full Name is required';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email Address is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      tempErrors.email = 'Please add a valid email address';
    }
    
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone Number is required';
    } else if (!/^\+?[\d\s\-()]{7,15}$/.test(formData.phone)) {
      tempErrors.phone = 'Please add a valid phone number';
    }
    
    if (!formData.company.trim()) tempErrors.company = 'Company Name is required';
    if (!formData.message.trim()) tempErrors.message = 'Please enter a message';
    if (formData.message.trim().length < 10) tempErrors.message = 'Message must be at least 10 characters';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    setLoading(true);
    try {
      // Post to lead creation endpoint
      await axios.post('http://localhost:5000/api/leads', formData);
      
      toast.success(
        <div className="text-sm">
          <p className="font-bold text-secondary-900">Inquiry Submitted Successfully!</p>
          <p className="text-secondary-500 mt-1">Our sales team will connect with you within 24 hours.</p>
        </div>,
        { duration: 5000 }
      );

      // Reset Form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        source: 'Website Contact Form'
      });
      setErrors({});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      icon: Zap,
      title: 'SaaS Platform Development',
      description: 'We construct premium, production-ready SaaS architectures utilizing cutting-edge full-stack technologies and clean database patterns.',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    },
    {
      icon: Layers,
      title: 'Custom Enterprise Software',
      description: 'Streamline operations with highly customizable, scalable, and optimized application software suited to match your workflow requirements.',
      color: 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
    },
    {
      icon: Shield,
      title: 'Database & Backend Design',
      description: 'High-availability, fast-rendering REST APIs and data warehouses structured to deliver maximum security and zero downtime.',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
    },
    {
      icon: Sparkles,
      title: 'Premium Brand UI/UX Design',
      description: 'Visual excellence designed to wow your users. We structure elegant client workflows, gorgeous dark modes, and dynamic micro-animations.',
      color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-secondary-950 transition-colors duration-300">
      {/* 1. Header/Navbar */}
      <header className="fixed top-0 inset-x-0 h-20 bg-white/75 dark:bg-secondary-950/75 backdrop-blur-md border-b border-slate-200 dark:border-secondary-900 z-50 transition-colors">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
              <TrendingUp size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-secondary-950 dark:text-white">NexusAgency</span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-secondary-600 dark:text-secondary-300">
            <a href="#hero" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</a>
            <a href="#services" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Services</a>
            <a href="#about" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About Us</a>
            <a href="#contact" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</a>
          </nav>

          <button 
            onClick={() => navigate('/login')}
            className="btn-primary flex items-center gap-2 shadow-md shadow-primary-100 hover:shadow-lg dark:shadow-none"
          >
            Admin CRM Portal <ChevronRight size={16} />
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="hero" className="pt-32 pb-24 md:pt-40 md:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 font-semibold text-xs uppercase tracking-wider">
              <Sparkles size={14} className="animate-pulse" /> Custom Software & Growth Architecture
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-secondary-950 dark:text-white leading-[1.1] tracking-tight">
              We design and build <br />
              <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">
                Stunning Digital Products
              </span>
            </h1>
            <p className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed max-w-xl">
              Empowering agency workflows, premium brands, and startups with high-performance web applications, beautiful UI systems, and optimized database architectures that turn visitors into converted clients.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#contact" 
                className="px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-200/50 transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5 dark:shadow-none"
              >
                Start Your Project <MessageSquare size={18} />
              </a>
              <a 
                href="#services" 
                className="px-6 py-3.5 bg-white dark:bg-secondary-900 border border-slate-200 dark:border-secondary-800 text-secondary-700 dark:text-secondary-200 hover:bg-slate-50 dark:hover:bg-secondary-800/80 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5"
              >
                Our Services
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-400/20 to-purple-400/20 blur-3xl rounded-full z-0"></div>
            <div className="relative card p-8 border-slate-200 dark:border-secondary-800 bg-white/70 dark:bg-secondary-900/70 backdrop-blur-md shadow-2xl rounded-3xl z-10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-secondary-800">
                <div>
                  <span className="text-xs font-semibold text-primary-600 uppercase tracking-widest block">Core CRM Live Data</span>
                  <h3 className="text-xl font-bold text-secondary-950 dark:text-white mt-1">Platform Activity</h3>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3.5 bg-slate-50 dark:bg-secondary-950/40 rounded-2xl border border-slate-100 dark:border-secondary-800">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-950/40 rounded-xl flex items-center justify-center text-green-600">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-secondary-900 dark:text-white">Form Lead Captured</h4>
                    <p className="text-xs text-secondary-500 mt-0.5">Michael Brown from Innovate AI · 2m ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3.5 bg-slate-50 dark:bg-secondary-950/40 rounded-2xl border border-slate-100 dark:border-secondary-800">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/40 rounded-xl flex items-center justify-center text-blue-600">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-secondary-900 dark:text-white">Admin Status Changed</h4>
                    <p className="text-xs text-secondary-500 mt-0.5">Jane Smith updated to Contacted · 15m ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3.5 bg-slate-50 dark:bg-secondary-950/40 rounded-2xl border border-slate-100 dark:border-secondary-800">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950/40 rounded-xl flex items-center justify-center text-purple-600">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-secondary-900 dark:text-white">Conversion Triggered</h4>
                    <p className="text-xs text-secondary-500 mt-0.5">Robert Davis upgraded to client · 1h ago</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Services Section */}
      <section id="services" className="py-24 px-6 bg-slate-100/50 dark:bg-secondary-900/30 border-y border-slate-200 dark:border-secondary-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest">Our Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-secondary-950 dark:text-white tracking-tight">Full-Stack Digital Solutions</h2>
            <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
              We leverage premium design aesthetics, fast response speeds, and absolute technical excellence to support business growth and customer management workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-8 border-slate-200 dark:border-secondary-800 bg-white dark:bg-secondary-900 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300 flex items-start gap-6"
              >
                <div className={`p-4 rounded-2xl shrink-0 ${service.color}`}>
                  <service.icon size={26} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-secondary-950 dark:text-white">{service.title}</h3>
                  <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed text-sm">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. About Us & Stats Section */}
      <section id="about" className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative border border-slate-200 dark:border-secondary-800 rounded-3xl p-10 bg-white dark:bg-secondary-900 space-y-6">
              <h3 className="text-2xl font-bold text-secondary-950 dark:text-white">Our Business Philosophy</h3>
              <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed text-sm">
                We believe software should feel extremely satisfying to use, robust in production, and simple to manage. Our custom-engineered applications provide seamless client tracking pipelines, rich Recharts interfaces, and bulletproof JWT authentication.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-secondary-800">
                <div>
                  <h4 className="text-2xl font-black text-primary-600">99.8%</h4>
                  <p className="text-[11px] font-semibold text-secondary-500 uppercase mt-1">Uptime</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-indigo-500">12k+</h4>
                  <p className="text-[11px] font-semibold text-secondary-500 uppercase mt-1">Leads Filed</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-pink-500">200+</h4>
                  <p className="text-[11px] font-semibold text-secondary-500 uppercase mt-1">Projects</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-secondary-950 dark:text-white tracking-tight">
              Premium CRM Integration for Scalable Operations
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
              When a visitor submits an inquiry on our forms, the lead details are instantly persisted to a robust MongoDB data tier. A real-time activity log records the ingestion process and broadcasts notifications to all active admin staff dashboards. This ensures zero latency between customer interest and agency response, optimizing conversion rates.
            </p>
            <ul className="space-y-3 pt-2">
              <li className="flex items-center gap-3 text-secondary-800 dark:text-secondary-200 font-medium">
                <CheckCircle size={18} className="text-green-500 shrink-0" /> Fast-loading MongoDB-integrated landing structures
              </li>
              <li className="flex items-center gap-3 text-secondary-800 dark:text-secondary-200 font-medium">
                <CheckCircle size={18} className="text-green-500 shrink-0" /> Immediate real-time synchronizations to the control panel
              </li>
              <li className="flex items-center gap-3 text-secondary-800 dark:text-secondary-200 font-medium">
                <CheckCircle size={18} className="text-green-500 shrink-0" /> Premium dark/light themes and beautiful analytics graphs
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* 5. Contact Section & LEAD GENERATION FORM */}
      <section id="contact" className="py-24 px-6 bg-slate-100/50 dark:bg-secondary-900/30 border-t border-slate-200 dark:border-secondary-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-start">
            
            {/* Contact Details Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest">Get In Touch</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-secondary-950 dark:text-white tracking-tight">Let's build something exceptional</h2>
                <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed text-sm max-w-md">
                  Interested in scaling your product operations? Submit the lead generation form and a senior technical lead will analyze your proposal and return a draft architecture estimate.
                </p>
              </div>

              <div className="space-y-4 font-medium text-secondary-700 dark:text-secondary-300">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-white dark:bg-secondary-900 border border-slate-200 dark:border-secondary-800 rounded-xl flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-400">Phone Support</p>
                    <p className="text-sm font-bold text-secondary-900 dark:text-white">+1 (800) 555-0199</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-white dark:bg-secondary-900 border border-slate-200 dark:border-secondary-800 rounded-xl flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-400">Email Address</p>
                    <p className="text-sm font-bold text-secondary-900 dark:text-white">hello@nexusagency.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-white dark:bg-secondary-900 border border-slate-200 dark:border-secondary-800 rounded-xl flex items-center justify-center text-primary-600 shadow-sm shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-400">Headquarters</p>
                    <p className="text-sm font-bold text-secondary-900 dark:text-white">100 Silicon Valley, CA, USA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Generation Form Column */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <div className="card p-8 sm:p-10 border-slate-200 dark:border-secondary-800 bg-white dark:bg-secondary-900 shadow-xl rounded-3xl space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-secondary-950 dark:text-white">Submit Design Request</h3>
                  <p className="text-xs text-secondary-500 mt-1">Please provide project guidelines and our system will ingest your lead.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                      {errors.name && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {errors.email && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider mb-2">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        className={`input-field ${errors.phone ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                        placeholder="123-456-7890"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                      {errors.phone && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider mb-2">Company Name</label>
                      <div className="relative">
                        <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400" />
                        <input
                          type="text"
                          name="company"
                          className={`input-field pl-10 ${errors.company ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                          placeholder="Innovate Tech Inc"
                          value={formData.company}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.company && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.company}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider mb-2">Lead Source</label>
                      <select
                        name="source"
                        className="input-field"
                        value={formData.source}
                        onChange={handleInputChange}
                      >
                        <option value="Website Contact Form">Website Inbound</option>
                        <option value="Google">Google Search</option>
                        <option value="Social Media">LinkedIn / Twitter</option>
                        <option value="Referral">Client Referral</option>
                        <option value="Cold Outreach">Cold Outreach</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary-700 dark:text-secondary-300 uppercase tracking-wider mb-2">Message</label>
                    <textarea
                      name="message"
                      rows="4"
                      className={`input-field resize-none py-3 ${errors.message ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                      placeholder="Outline your application needs, timeframe, and specific technical parameters..."
                      value={formData.message}
                      onChange={handleInputChange}
                    ></textarea>
                    {errors.message && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 text-md font-bold shadow-lg shadow-primary-200 dark:shadow-none transition-all duration-200 disabled:opacity-75"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Submit Inquiry <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="py-12 bg-white dark:bg-secondary-950 border-t border-slate-200 dark:border-secondary-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
              <TrendingUp size={18} />
            </div>
            <span className="font-bold text-lg text-secondary-950 dark:text-white">NexusAgency</span>
          </div>
          <p className="text-xs text-secondary-500">
            &copy; {new Date().getFullYear()} NexusCRM Platform. Built for Enterprise Full-Stack Operations. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 text-xs text-secondary-400">
            <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
            <a href="/login" className="hover:text-primary-600 font-semibold transition-colors">Admin Login</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
