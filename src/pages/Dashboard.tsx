import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Search,
  TrendingUp,
  FileText,
  Zap,
  Link as LinkIcon
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState<Record<string, any> | null>({ email: "user@example.com" });
  const [loading, setLoading] = useState(false);
  const [productUrl, setProductUrl] = useState("");
  const [reports, setReports] = useState<Record<string, any>[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [credits, setCredits] = useState<number>(50);

  useEffect(() => {
    // Supabase auth and data fetching removed.
    // Replace with your new database logic here.
    setReports([
      { id: "1", product_title: "Sample Product", product_description: "Analysis of sample product", created_at: new Date().toISOString(), credits_used: 5 }
    ]);
  }, []);

  const handleAnalyze = async () => {
    if (!productUrl.trim()) {
      toast({
        title: t.common.error,
        description: t.common.enterUrl,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Analysis Simulation",
      description: "Database connection removed. Connect your new database to enable analysis.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  const stats = [
    { label: t.dashboard.creditsRemaining, value: credits.toString(), icon: Zap },
    { label: t.dashboard.analysesDone, value: reports.length.toString(), icon: TrendingUp },
    { label: t.dashboard.reportsSaved, value: reports.length.toString(), icon: FileText },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">
            {t.dashboard.welcome} <span className="text-gradient">{user?.email?.split('@')[0]}</span>
          </h1>
          <p className="text-foreground/70">{t.dashboard.subtitle}</p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 glass-card hover:glow transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/70 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="w-10 h-10 text-accent" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Analyze Product Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8 glass-card glow">
            <div className="flex items-center gap-3 mb-6">
              <Search className="w-8 h-8 text-accent" />
              <h2 className="text-2xl font-bold">{t.dashboard.analyzeProduct}</h2>
            </div>
            <p className="text-foreground/70 mb-6">
              {t.dashboard.analyzeSubtitle}
            </p>
            <div className="flex gap-4 mb-4">
              <Button
                variant="outline"
                className="flex-1 justify-center gap-2"
                onClick={() => navigate('/pricing')}
              >
                <Zap className="w-4 h-4" />
                Buy Credit
              </Button>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <LinkIcon className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                <Input
                  type="url"
                  placeholder="https://example.com/product"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={handleAnalyze}
                className="bg-gradient-accent hover:opacity-90 px-8"
              >
                {t.dashboard.analyzeNow}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-6">{t.dashboard.recentReports}</h2>

          {reports.length === 0 ? (
            <Card className="p-12 glass-card text-center">
              <FileText className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
              <p className="text-foreground/70">{t.dashboard.noReports}</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {reports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="p-6 glass-card hover:glow transition-all cursor-pointer"
                    onClick={() => navigate(`/report/${report.id}`)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          {report.product_title || "تقرير تحليل المنتج"}
                        </h3>
                        <p className="text-foreground/60 text-sm mb-2 line-clamp-2">
                          {report.product_description || report.product_url}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/50">
                          <span>{new Date(report.created_at).toLocaleDateString("en-US")}</span>
                          {report.product_price && <span>•</span>}
                          {report.product_price && <span>{report.product_price}</span>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/report/${report.id}`);
                        }}
                      >
                        عرض التفاصيل
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
