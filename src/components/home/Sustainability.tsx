import Image from "next/image";
import { Globe } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

export default function Sustainability() {
  const stats = [
    { label: "Reduction in Chemical Usage", value: "98.4%" },
    { label: "Generated for Rural Families", value: "₹4,200Cr" },
    { label: "Trees Planted via Revenue Share", value: "1.2M+" },
    { label: "Supply Chain Target 2026", value: "0-Carbon" }
  ];

  return (
    <section className="section-padding bg-primary text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10"></div>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
        <FadeIn 
          direction="right"
          className="space-y-10"
        >
          <h2 className="text-white text-4xl md:text-6xl">Rooted in Earth, <br />Dedicated to <span className="text-accent underline decoration-accent/30 underline-offset-8">Future</span></h2>
          <p className="text-white/70 font-body text-xl leading-relaxed">
            Kishan Seva Samiti isn&apos;t just a platform; it&apos;s a movement towards regenerative agriculture. We monitor over 1 million hectares of soil health, ensuring that every harvest contributes back to the planet.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-8">
            {stats.map((stat, i) => (
              <div 
                key={i}
                className="space-y-2"
              >
                <div className="text-4xl font-serif text-accent tracking-tighter">{stat.value}</div>
                <div className="text-white/60 font-body uppercase tracking-widest text-xs font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
        
        <FadeIn 
          direction="left"
          className="relative"
        >
           <div className="aspect-square rounded-[60px] overflow-hidden border-12 border-white/5 relative shadow-2xl">
              <div className="absolute inset-0 bg-accent/20 z-10 mix-blend-overlay"></div>
              <Image 
                src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1200&auto=format&fit=crop" 
                alt="Sustainable Farmer" 
                fill 
                className="object-cover scale-110 hover:scale-100 transition-transform duration-1000"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
           </div>
           <div className="absolute -bottom-10 -right-10 glass-panel p-10 rounded-3xl hidden md:block">
              <Globe className="w-12 h-12 text-accent mb-4" />
              <div className="text-white font-bold">Global Impact</div>
              <div className="text-white/60 text-sm">Verified ESG Platform</div>
           </div>
        </FadeIn>
      </div>
    </section>
  );
}
