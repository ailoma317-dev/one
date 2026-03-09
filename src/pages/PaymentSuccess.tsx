import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [subscription, setSubscription] = useState<Record<string, any> | null>({ subscribed: true, subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase subscription check removed.
  }, []);

  const isRTL = language === "ar";

  return (
    <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      <div className="container mx-auto px-6 pt-32 pb-12 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full"
        >
          <Card className="p-8 glass-card text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10 pointer-events-none" />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative z-10"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-accent flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-accent" />
                  {isRTL ? "تم الاشتراك بنجاح!" : "Subscription Successful!"}
                  <Sparkles className="w-6 h-6 text-accent" />
                </h1>

                <p className="text-foreground/70 mb-6">
                  {isRTL
                    ? "شكراً لاشتراكك في Insitems! يمكنك الآن الاستمتاع بجميع مميزات خطتك."
                    : "Thank you for subscribing to Insitems! You can now enjoy all the features of your plan."
                  }
                </p>

                {subscription?.subscribed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-accent/10 rounded-lg p-4 mb-6"
                  >
                    <p className="text-sm text-foreground/60 mb-1">
                      {isRTL ? "ينتهي الاشتراك في:" : "Subscription ends:"}
                    </p>
                    <p className="font-semibold text-accent">
                      {subscription.subscription_end
                        ? new Date(subscription.subscription_end).toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                        : "-"
                      }
                    </p>
                  </motion.div>
                )}

                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-accent hover:opacity-90"
                    onClick={() => navigate("/dashboard")}
                  >
                    {isRTL ? "الذهاب للوحة التحكم" : "Go to Dashboard"}
                    <ArrowRight className={`w-4 h-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/")}
                  >
                    {isRTL ? "العودة للرئيسية" : "Back to Home"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>

            {/* Confetti-like decorations */}
            <motion.div
              className="absolute top-4 left-4 w-3 h-3 rounded-full bg-accent"
              animate={{ y: [0, -10, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-8 right-8 w-2 h-2 rounded-full bg-primary"
              animate={{ y: [0, -8, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
            <motion.div
              className="absolute bottom-12 left-8 w-2 h-2 rounded-full bg-accent"
              animate={{ y: [0, -6, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
            />
            <motion.div
              className="absolute bottom-8 right-4 w-3 h-3 rounded-full bg-primary"
              animate={{ y: [0, -12, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0.9 }}
            />
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
