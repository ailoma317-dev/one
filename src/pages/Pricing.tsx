import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Stripe price IDs mapping
const PRICE_IDS = {
  starter: "price_1Sg7EYRzlMRvnKyHPQXLuoSJ",
  professional: "price_1Sg7EZRzlMRvnKyHslB5s3Ug",
  enterprise: "price_1Sg7EaRzlMRvnKyHUZkrsd7P",
};

const PAYMENTS_ENABLED = false;

export default function Pricing() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<Record<string, any> | null>({ id: "1" });
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<Record<string, any> | null>({ subscribed: false });
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [managingSubscription, setManagingSubscription] = useState(false);

  useEffect(() => {
    // Supabase auth and subscription check removed.
  }, []);

  const checkSubscription = async () => {
    // Supabase function invocation removed.
  };

  const handleSubscribe = async (planKey: string) => {
    toast.info("Payment simulation: Database connection required for real checkout.");
  };

  const handleManageSubscription = async () => {
    toast.info("Subscription management is currently disabled.");
  };

  const plans = [
    {
      key: "starter",
      name: t.pricing.starter.name,
      price: "45",
      period: t.pricing.month,
      credits: "4",
      description: t.pricing.starter.description,
      features: [
        "4 AI product analyses",
        "Competitor analysis",
        "Pricing intelligence",
        "SEO opportunities",
        "Basic keyword research",
      ],
      popular: false,
    },
    {
      key: "professional",
      name: t.pricing.professional.name,
      price: "75",
      period: t.pricing.month,
      credits: "10",
      description: t.pricing.professional.description,
      features: [
        "10 AI product analyses",
        "Everything in Starter",
        "AI content generation",
        "Video & image collection",
        "Advanced market insights",
        "Target audience analysis",
        "Priority support",
      ],
      popular: true,
    },
    {
      key: "enterprise",
      name: t.pricing.enterprise.name,
      price: "125",
      period: t.pricing.month,
      credits: "20",
      description: t.pricing.enterprise.description,
      features: [
        "20 AI product analyses",
        "Everything in Professional",
        "AI image generation",
        "AI video generation",
        "White-label reports",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 priority support",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-6 pt-32 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">
            {t.pricing.title} <span className="text-gradient">{t.pricing.titleHighlight}</span> {t.pricing.titleEnd}
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            {t.pricing.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const isCurrentPlan = subscriptionStatus?.price_id === PRICE_IDS[plan.key as keyof typeof PRICE_IDS];
            // If user is subscribed to ANY plan, they shouldn't see "Start Trial" on others potentially?
            // Or maybe they can upgrade/downgrade. For simplicity let's stick to "Manage" if subscribed to THIS one,
            // and maybe "Switch" (via portal) for others, but portal handles switching best.
            // Simplest approach: If subscribed to ANY plan, show "Manage Subscription" button everywhere 
            // or specific button for current plan.
            // Let's go with: if subscribed, check if THIS is the plan.

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && !subscriptionStatus?.subscribed && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    {t.pricing.mostPopular}
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4" /> Current Plan
                  </div>
                )}
                <Card
                  className={`p-8 glass-card h-full flex flex-col ${plan.popular && !subscriptionStatus?.subscribed ? "glow border-accent/50" : isCurrentPlan ? "border-green-500/50 glow-green" : ""
                    }`}
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-foreground/70 text-sm mb-4">{plan.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">SAR {plan.price}</span>
                      <span className="text-foreground/70">/{plan.period}</span>
                    </div>
                    <p className="text-accent text-sm mt-2">{plan.credits} {t.pricing.credits}</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {subscriptionStatus?.subscribed ? (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={handleManageSubscription}
                      disabled={managingSubscription}
                    >
                      {managingSubscription ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <ArrowRight className="w-4 h-4 mr-2" />
                      )}
                      Manage Subscription
                    </Button>
                  ) : (
                    <Button
                      className={
                        plan.popular
                          ? "w-full bg-gradient-accent hover:opacity-90"
                          : "w-full"
                      }
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handleSubscribe(plan.key)}
                      disabled={loadingPlan === plan.key || checkingSubscription || !PAYMENTS_ENABLED}
                    >
                      {loadingPlan === plan.key ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      {!PAYMENTS_ENABLED
                        ? (language === "ar" ? "غير متاح حالياً" : "Unavailable")
                        : "Get Free Report"}
                    </Button>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-24 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            {t.pricing.faq.title}
          </h2>
          <div className="space-y-6">
            {[
              { q: t.pricing.faq.q1, a: t.pricing.faq.a1 },
              { q: t.pricing.faq.q2, a: t.pricing.faq.a2 },
              { q: t.pricing.faq.q3, a: t.pricing.faq.a3 },
              { q: t.pricing.faq.q4, a: t.pricing.faq.a4 },
            ].map((faq, index) => (
              <Card key={index} className="p-6 glass-card">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-foreground/70">{faq.a}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
