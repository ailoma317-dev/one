import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Supabase integration removed. 
    // You can set a mock user here for testing UI states:
    // setUser({ email: "test@example.com" });
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            <span className="text-2xl font-bold text-gradient">Insitems</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
              {t.nav.home}
            </Link>
            <Link to="/pricing" className="text-foreground/80 hover:text-foreground transition-colors">
              {t.nav.pricing}
            </Link>
            {user && (
              <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
                {t.nav.dashboard}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/profile")}
                  className="text-foreground/80 hover:text-foreground"
                >
                  <User className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/auth")}
                  className="text-foreground/80 hover:text-foreground"
                >
                  {t.nav.login}
                </Button>
                <Button
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-accent hover:opacity-90 transition-opacity"
                >
                  {t.nav.getStarted}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
