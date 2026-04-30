import Link from "next/link";
import { ArrowRight, CreditCard, Users, ShoppingBag } from "lucide-react";
import FadeIn, { StaggerContainer } from "@/components/animations/FadeIn";
import { Dictionary } from "@/context/LanguageContext";

export default function Services({ lang, dict }: { lang: string, dict: Dictionary }) {
  const services = [
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: dict.features?.cards?.card?.title || "Premium Membership",
      desc: dict.features?.cards?.card?.desc || "Carry your heritage digitally. Our exclusive cards unlock a world of government subsidies, technical workshops, and global export access.",
      link: `/${lang}/dashboard`,
      color: "bg-primary"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: dict.features?.cards?.referral?.title || "Collective Prosperity",
      desc: dict.features?.cards?.referral?.desc || "Drive community wealth through our unique referral ecosystem. Share your success with neighboring farms and earn collective incentives.",
      link: `/${lang}/dashboard/referrals`,
      color: "bg-accent"
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: dict.features?.cards?.market?.title || "Direct-to-Global",
      desc: dict.features?.cards?.market?.desc || "List your premium organic harvest on our world-class marketplace. Skip the intermediaries and command the true value of your labor.",
      link: `/${lang}/marketplace`,
      color: "bg-emerald-700"
    }
  ];

  return (
    <section className="section-padding bg-[#f8faf9] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
      
      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-6xl">Elevating the Farming Experience</h2>
          <p className="text-primary/60 font-body text-xl leading-relaxed">
            Our suite of services is designed for the modern steward who values both tradition and technological excellence.
          </p>
        </FadeIn>

        <StaggerContainer 
          className="grid md:grid-cols-3 gap-8"
        >
          {services.map((service, i) => (
            <FadeIn 
              key={i} 
              className="glass-card p-12 rounded-[40px] group hover:-translate-y-4 transition-all duration-500 flex flex-col justify-between h-full"
            >
              <div>
                <div className={`w-20 h-20 ${service.color} rounded-3xl flex items-center justify-center mb-10 text-white shadow-xl group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-3xl mb-6">{service.title}</h3>
                <p className="text-primary/70 font-body text-lg leading-relaxed mb-10">
                  {service.desc}
                </p>
              </div>
              <Link href={service.link} className="inline-flex items-center gap-3 font-bold text-primary group-hover:text-accent-dark transition-colors text-lg">
                Explore Service <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </FadeIn>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
