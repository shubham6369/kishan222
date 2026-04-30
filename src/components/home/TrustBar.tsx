import FadeIn from "@/components/animations/FadeIn";

export default function TrustBar() {
  return (
    <FadeIn className="py-12 bg-white border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
           <div className="flex items-center gap-2 font-serif text-2xl font-bold">TRUSTED BY OVER 50,000+ FARMERS</div>
           <div className="flex items-center gap-2 font-serif text-2xl font-bold italic">ISO 22000 CERTIFIED</div>
           <div className="flex items-center gap-2 font-serif text-2xl font-bold">ORGANIC INDIA PARTNER</div>
           <div className="flex items-center gap-2 font-serif text-2xl font-bold italic text-gold-500">HERITAGE PRESERVATION AWARD 2024</div>
        </div>
      </div>
    </FadeIn>
  );
}
