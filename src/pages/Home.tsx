import { Navbar } from "@/components/Navbar";
import { Hero3D } from "@/components/Hero3D";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Target, 
  TrendingUp, 
  Globe, 
  Sparkles, 
  Video, 
  Image as ImageIcon,
  BarChart3,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      icon: Target,
      title: t.features.competitor.title,
      description: t.features.competitor.description,
    },
    {
      icon: TrendingUp,
      title: t.features.pricing.title,
      description: t.features.pricing.description,
    },
    {
      icon: Globe,
      title: t.features.seo.title,
      description: t.features.seo.description,
    },
    {
      icon: Sparkles,
      title: t.features.content.title,
      description: t.features.content.description,
    },
    {
      icon: Video,
      title: t.features.video.title,
      description: t.features.video.description,
    },
    {
      icon: ImageIcon,
      title: t.features.image.title,
      description: t.features.image.description,
    },
    {
      icon: BarChart3,
      title: t.features.market.title,
      description: t.features.market.description,
    },
    {
      icon: Users,
      title: t.features.audience.title,
      description: t.features.audience.description,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero3D />

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.features.title} <span className="text-gradient">{t.features.titleHighlight}</span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              {t.features.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 glass-card hover:glow transition-all duration-300 h-full group cursor-pointer">
                  <feature.icon className="w-12 h-12 text-accent mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 rounded-2xl text-center glow"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.cta.title} <span className="text-gradient">{t.cta.titleHighlight}</span> {t.cta.subtitle}
            </h2>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              {t.cta.description}
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-accent hover:opacity-90 transition-opacity text-lg px-8 py-6"
            >
              {t.cta.button}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-foreground/60">
            {t.footer.rights}
          </p>
        </div>
      </footer>
    </div>
  );
}
