import Link from "next/link";
import { ArrowRight, ShoppingBag, Sprout, Wheat, Droplets, Settings } from "lucide-react";
import FadeIn, { StaggerContainer } from "@/components/animations/FadeIn";
import { Dictionary } from "@/context/LanguageContext";

export default function Services({ lang, dict }: { lang: string, dict: Dictionary }) {
  const products = [
    {
      icon: <Sprout className="w-8 h-8" />,
      title: dict.marketplace?.categories?.seeds || "Organic Seeds",
      desc: "High-yield, organic seeds for a variety of crops including wheat, rice, and vegetables.",
      link: `/${lang}/marketplace?category=seeds`,
      color: "bg-emerald-600"
    },
    {
      icon: <Wheat className="w-8 h-8" />,
      title: dict.marketplace?.categories?.grains || "Natural Grains",
      desc: "Premium quality grains processed naturally to preserve nutrition and taste.",
      link: `/${lang}/marketplace?category=grains`,
      color: "bg-amber-600"
    },
    {
      icon: <Droplets className="w-8 h-8" />,
      title: dict.marketplace?.categories?.fertilizers || "Organic Fertilizers",
      desc: "Chemical-free fertilizers to enrich your soil and boost crop productivity naturally.",
      link: `/${lang}/marketplace?category=fertilizers`,
      color: "bg-blue-600"
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: dict.marketplace?.categories?.pesticides || "Bio Pesticides",
      desc: "Natural and safe solutions to protect your crops from pests without harmful chemicals.",
      link: `/${lang}/marketplace?category=pesticides`,
      color: "bg-rose-600"
    }
  ];

  return (
    <section className="section-padding bg-[#f8faf9] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
      
      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-6xl">Essential Farming Products</h2>
          <p className="text-primary/60 font-body text-xl leading-relaxed">
            Access high-quality agricultural inputs directly through our marketplace.
          </p>
        </FadeIn>

        <StaggerContainer 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product, i) => (
            <FadeIn 
              key={i} 
              className="glass-card p-8 rounded-[32px] group hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between h-full border border-black/5"
            >
              <div>
                <div className={`w-16 h-16 ${product.color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {product.icon}
                </div>
                <h3 className="text-2xl mb-4 font-serif">{product.title}</h3>
                <p className="text-primary/70 font-body text-sm leading-relaxed mb-6">
                  {product.desc}
                </p>
              </div>
              <Link href={product.link} className="inline-flex items-center gap-2 font-bold text-primary group-hover:text-emerald-700 transition-colors text-sm">
                View Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </FadeIn>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
