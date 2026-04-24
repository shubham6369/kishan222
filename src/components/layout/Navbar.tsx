"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, LayoutDashboard, Search, Globe } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { lang, dict } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [hasScrolled, setHasScrolled] = useState(false);

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPath || `/${newLang}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to logout", err);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        hasScrolled 
          ? "bg-white/80 backdrop-blur-md py-4 shadow-lg border-b border-black/5" 
          : "bg-transparent py-8"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Brand/Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 bg-primary rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500 overflow-hidden shadow-xl">
             <Image 
              src="/logo.png" 
              alt="Kishan Seva Samiti Logo" 
              fill 
              className="object-cover p-2"
             />
          </div>
          <div className="flex flex-col">
            <span className={`font-serif text-2xl font-bold tracking-tight leading-tight transition-colors ${hasScrolled ? "text-primary" : "text-white"}`}>
              Kishan Seva <span className="text-accent italic">Samiti</span>
            </span>
            <span className={`text-[8px] uppercase tracking-[0.4em] font-bold ${hasScrolled ? "text-primary/60" : "text-white/80"}`}>
              {dict.nav?.tagline || "Rural Empowerment Collective"}
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 font-body">
          <button
            onClick={toggleLanguage}
            className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-accent-dark transition-colors ${hasScrolled ? "text-primary" : "text-white"}`}
          >
            <Globe className="w-4 h-4" />
            {lang === 'en' ? 'हिंदी' : 'English'}
          </button>
          
          <Link 
            href={`/${lang}/marketplace`} 
            className={`text-sm font-bold uppercase tracking-widest hover:text-accent-dark transition-colors ${hasScrolled ? "text-primary" : "text-white"}`}
          >
            {dict.nav?.marketplace || "Marketplace"}
          </Link>
          <Link 
            href={`/${lang}/about`} 
            className={`text-sm font-bold uppercase tracking-widest hover:text-accent-dark transition-colors ${hasScrolled ? "text-primary" : "text-white"}`}
          >
            {dict.nav?.about || "About"}
          </Link>
          <Link 
            href={`/${lang}/contact`} 
            className={`text-sm font-bold uppercase tracking-widest hover:text-accent-dark transition-colors ${hasScrolled ? "text-primary" : "text-white"}`}
          >
            {dict.nav?.contact || "Contact"}
          </Link>
          
          <div className="flex items-center gap-6 ml-6 pl-6 border-l border-white/10">
            {user ? (
              <>
                <Link 
                  href={`/${lang}/dashboard`} 
                  className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-accent-dark transition-all ${hasScrolled ? "text-primary" : "text-white"}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link 
                  href={`/${lang}/login`} 
                  className={`text-sm font-bold uppercase tracking-widest hover:text-accent transition-all ${hasScrolled ? "text-primary" : "text-white"}`}
                >
                  {dict.nav?.login || 'Login'}
                </Link>
                <Link 
                  href={`/${lang}/register`} 
                  className="bg-accent hover:bg-gold-500 text-primary px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-accent/20 active:scale-95"
                >
                  {dict.nav?.join || 'Join Us'}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className={`${hasScrolled ? "text-primary" : "text-white"} md:hidden hover:text-accent transition-colors`} 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-primary shadow-2xl overflow-hidden md:hidden"
          >
            <div className="p-8 space-y-8">
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsOpen(false);
                }}
                className="flex items-center gap-4 text-2xl font-serif text-white hover:text-accent transition-colors"
              >
                <Globe className="w-6 h-6" />
                {lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}
              </button>

              <Link 
                href={`/${lang}/marketplace`} 
                className="block text-2xl font-serif text-white hover:text-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {dict.nav?.marketplace || "Marketplace"}
              </Link>
              <Link 
                href={`/${lang}/schemes`} 
                className="block text-2xl font-serif text-white hover:text-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Govt Schemes
              </Link>
              
              <div className="pt-8 border-t border-white/10 space-y-6">
                {user ? (
                  <>
                    <Link 
                      href="/dashboard" 
                      className="flex items-center gap-4 text-xl text-white font-body"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard className="w-6 h-6 text-accent" />
                      Farmer Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-4 text-xl text-red-400 font-body"
                    >
                      <LogOut className="w-6 h-6" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link 
                      href={`/${lang}/login`} 
                      className="text-center py-4 border border-white/20 rounded-full text-white font-bold uppercase tracking-widest"
                      onClick={() => setIsOpen(false)}
                    >
                      {dict.nav?.login || 'Login'}
                    </Link>
                    <Link 
                      href={`/${lang}/register`} 
                      className="text-center py-4 bg-accent text-primary rounded-full font-bold uppercase tracking-widest shadow-xl"
                      onClick={() => setIsOpen(false)}
                    >
                      {dict.nav?.join || 'Become a Member'}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

