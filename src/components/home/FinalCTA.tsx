import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";
import { Dictionary } from "@/context/LanguageContext";

export default function FinalCTA({ lang, dict }: { lang: string, dict: Dictionary }) {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -skew-y-6 translate-y-32"></div>
      <FadeIn
        className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-12"
      >
        <h2 className="text-5xl md:text-8xl leading-tight text-primary">Your Heritage <br /> Deserves a <span className="italic text-accent-dark">Signature</span></h2>
        <p className="text-primary/60 font-body text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
          The committee currently has 49,820 active stewards. We only open 180 new membership slots each month to maintain quality of service and heritage preservation standards.
        </p>
        <div className="flex flex-col sm:flex-row gap-8 justify-center pt-8">
           <Link href={`/${lang}/register`} className="btn-premium px-16 py-6 text-xl shadow-2xl shadow-accent/20">
             {dict.hero?.cta_join || 'Apply for Membership'}
           </Link>
           <Link href={`/${lang}/contact`} className="px-16 py-6 rounded-full font-bold text-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
             Speak to a Council Member
           </Link>
        </div>
      </FadeIn>
    </section>
  );
}
