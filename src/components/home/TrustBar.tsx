import FadeIn from "@/components/animations/FadeIn";

export default function TrustBar() {
  return (
    <FadeIn className="py-12 bg-white border-b border-black/5 group">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 text-[#122c1f]/60 group-hover:text-[#122c1f]/90 transition-all duration-500">
           <div className="flex items-center gap-2 font-serif text-xl md:text-2xl font-bold">TRUSTED BY OVER 50,000+ FARMERS</div>
           <div className="flex items-center gap-2 font-serif text-xl md:text-2xl font-bold italic">ISO 22000 CERTIFIED</div>
           <div className="flex items-center gap-2 font-serif text-xl md:text-2xl font-bold">ORGANIC INDIA PARTNER</div>
           <div className="flex items-center gap-2 font-serif text-xl md:text-2xl font-bold italic text-gold-500 group-hover:text-[#f59e0b] transition-colors">HERITAGE PRESERVATION AWARD 2024</div>
        </div>
      </div>
    </FadeIn>
  );
}
