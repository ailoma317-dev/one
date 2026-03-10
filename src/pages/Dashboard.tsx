import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { reports as reportsApi, edgeFunctions, type Report } from "@/lib/supabase";
import {
  Search,
  TrendingUp,
  FileText,
  Zap,
  Link as LinkIcon
} from "lucide-react";

export default function Dashboard() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [productUrl, setProductUrl] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchReports();
    }
  }, [user, authLoading, navigate]);

  const fetchReports = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await reportsApi.getAll(user.id);
      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!productUrl.trim()) {
      toast({
        title: t.common.error,
        description: t.common.enterUrl,
        variant: "destructive",
      });
      return;
    }

    if (!user || !profile) {
      toast({
        title: t.common.error,
        description: "يرجى تسجيل الدخول أولاً",
        variant: "destructive",
      });
      return;
    }

    if (profile.credits < 1) {
      toast({
        title: t.common.error,
        description: "لا يوجد رصيد كافي. يرجى شراء المزيد من الأرصدة.",
        variant: "destructive",
      });
      navigate("/pricing");
      return;
    }

    setAnalyzing(true);
    try {
      // Create a new report first
      const { data: newReport, error: createError } = await reportsApi.create({
        user_id: user.id,
        product_url: productUrl,
        product_title: "جاري التحليل...",
        product_description: null,
        product_price: null,
        analysis_data: {},
        credits_used: 1,
      });

      if (createError) throw createError;
      if (!newReport) throw new Error("Failed to create report");

      // Call Edge Function to analyze with OpenAI
      const { error: analysisError } = await edgeFunctions.analyzeProduct(
        newReport.id,
        productUrl
      );

      if (analysisError) {
        console.error("Analysis error:", analysisError);
        // Don't throw - report is created, analysis can be retried
        toast({
          title: "تنبيه",
          description: "تم إنشاء التقرير لكن التحليل قيد المعالجة. يرجى المحاولة لاحقاً.",
          variant: "default",
        });
      } else {
        toast({
          title: t.common.success,
          description: "تم تحليل المنتج بنجاح",
        });
      }

      // Refresh profile to get updated credits
      await refreshProfile();
      
      // Refresh reports list
      await fetchReports();

      setProductUrl("");
      navigate(`/report/${newReport.id}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء التحليل";
      toast({
        title: t.common.error,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  const stats = [
    { label: t.dashboard.creditsRemaining, value: (profile?.credits ?? 0).toString(), icon: Zap },
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
            {t.dashboard.welcome} <span className="text-gradient">{profile?.full_name || user?.email?.split('@')[0]}</span>
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
                  disabled={analyzing}
                />
              </div>
              <Button
                onClick={handleAnalyze}
                className="bg-gradient-accent hover:opacity-90 px-8"
                disabled={analyzing || (profile?.credits ?? 0) < 1}
              >
                {analyzing ? "جاري التحليل..." : t.dashboard.analyzeNow}
              </Button>
            </div>
            {(profile?.credits ?? 0) < 1 && (
              <p className="text-red-500 text-sm mt-2">
                لا يوجد رصيد كافي. يرجى شراء المزيد من الأرصدة.
              </p>
            )}
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
