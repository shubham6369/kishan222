import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Leaf, Trophy } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import { Dictionary } from "@/context/LanguageContext";

export default function Hero({ lang, dict }: { lang: string, dict: Dictionary }) {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-primary">
      <div className="absolute inset-0">
        <Image 
          src="/hero-sustainable.png" 
          alt="Sustainable Agriculture Hero" 
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent z-1"></div>
        <div className="absolute inset-0 bg-linear-to-b from-primary/20 to-transparent z-1"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <FadeIn 
          direction="right"
          distance={50}
          className="space-y-10"
        >
          <div 
            className="inline-flex items-center gap-2 glass-panel px-6 py-2 rounded-full text-accent font-body text-xs font-bold tracking-[0.2em] uppercase"
          >
            <Star className="w-4 h-4 fill-accent" />
            The Gold Standard of Rural Heritage
          </div>
          
          <h1 className="text-5xl md:text-8xl font-serif leading-none text-white! drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            {dict.hero?.title || 'Cultivating the Legacy of Tomorrow'}
          </h1>
          
          <p className="text-lg md:text-xl text-white/90! font-body leading-relaxed max-w-xl drop-shadow-md">
            {dict.hero?.subtitle || "Join India's most prestigious agricultural collective. We bridge the gap between ancient wisdom and modern innovation, empowering farmers through sustainable membership and premium organic commerce."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <Link href={`/${lang}/register`} className="btn-premium group shadow-2xl shadow-accent/10">
              {dict.hero?.cta_join || 'Join the Samiti'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href={`/${lang}/marketplace`} className="px-8 py-4 rounded-full font-bold border border-white/20 text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              {dict.hero?.cta_marketplace || 'Explore the Harvest'}
            </Link>
          </div>
        </FadeIn>
        
        <FadeIn 
          direction="left"
          delay={0.5}
          className="hidden lg:block relative"
        >
          <div className="glass-panel p-8 rounded-3xl space-y-8 max-w-md ml-auto">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center">
                <Leaf className="text-primary w-8 h-8" />
              </div>
              <div>
                <h3 className="text-white text-xl">100% Regenerative</h3>
                <p className="text-white/60 text-sm">Beyond Organic Standards</p>
              </div>
            </div>
            <div className="h-px bg-white/10"></div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                <Trophy className="text-accent w-8 h-8" />
              </div>
              <div>
                <h3 className="text-white text-xl">Heritage Certified</h3>
                <p className="text-white/60 text-sm">Empowering Local Lineage</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
