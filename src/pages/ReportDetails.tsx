import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { reports as reportsApi, type Report } from "@/lib/supabase";
import { ReportCharts } from "@/components/ReportCharts";
import { ScrollAnimationWrapper } from "@/components/ScrollAnimationWrapper";
import { CompetitorAnalysisSection } from "@/components/CompetitorAnalysisSection";
import { ContentSuggestionsSection } from "@/components/ContentSuggestionsSection";
import { ExtractedDataSection } from "@/components/ExtractedDataSection";
import { SeoOpportunitiesSection } from "@/components/SeoOpportunitiesSection";
import { CompetitorVideosSection } from "@/components/CompetitorVideosSection";
import { LogoSuggestionsSection } from "@/components/LogoSuggestionsSection";
import {
  ArrowLeft,
  Download,
  FileText,
  Target,
  DollarSign,
  Search,
  FileEdit,
  TrendingUp,
  Users,
  Lightbulb,
  ExternalLink,
  BarChart3,
  Database,
  Play,
  Palette,
} from "lucide-react";

interface ReportWithAnalysis extends Report {
  analysis_data: {
    productTitle?: string;
    productDescription?: string;
    productPrice?: string;
    competitorAnalysis?: string;
    pricingStrategy?: string;
    seoOpportunities?: string;
    contentSuggestions?: string;
    competitorVideos?: Record<string, unknown>[];
    logoSuggestions?: {
      idea: string;
      bio: string;
      marketingImages: string[];
      affiliateSentence: string;
    };
    marketInsights?: string;
    targetAudience?: string;
    recommendations?: string;
    extractedData?: {
      originalTitle?: string;
      originalPrice?: string;
      category?: string;
      seller?: string;
      images?: string[];
      specifications?: string[];
    };
  };
}

export default function ReportDetails() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [report, setReport] = useState<ReportWithAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -30]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    const fetchReport = async () => {
      if (!user || !id) return;
      
      try {
        const { data, error } = await reportsApi.getById(id, user.id);
        if (error) throw error;
        
        if (!data) {
          toast({
            title: t.common.error,
            description: "التقرير غير موجود",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }
        
        setReport(data as ReportWithAnalysis);
      } catch (error) {
        console.error("Error fetching report:", error);
        toast({
          title: t.common.error,
          description: "حدث خطأ أثناء تحميل التقرير",
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReport();
    }
  }, [id, user, authLoading, navigate, toast, t]);

  const handleExportJSON = () => {
    if (!report) return;

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report-${report.id}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: t.common.success,
      description: "تم تصدير التقرير بنجاح",
    });
  };

  // Helper function to safely convert value to string for display
  const toDisplayString = (value: unknown): string => {
    if (value === null || value === undefined) return "غير متوفر";
    if (typeof value === 'string') return value;

    if (typeof value === 'object') {
      try {
        // Handle arrays
        if (Array.isArray(value)) {
          if (value.length === 0) return "لا توجد بيانات";
          return value.map((item) => {
            if (typeof item === 'object') {
              return formatObject(item, 0);
            }
            return `• ${item}`;
          }).join('\n');
        }

        // Handle objects
        return formatObject(value, 0);
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  // Helper to format objects nicely
  const formatObject = (obj: unknown, depth: number = 0): string => {
    if (!obj || typeof obj !== 'object') return String(obj);

    const typedObj = obj as Record<string, unknown>;
    const indent = '  '.repeat(depth);
    const entries = Object.entries(typedObj);

    if (entries.length === 0) return "لا توجد بيانات";

    return entries.map(([key, value]) => {
      // Translate common keys to Arabic
      const translatedKey = translateKey(key);

      if (value === null || value === undefined) {
        return `${indent}• ${translatedKey}: غير متوفر`;
      }

      if (Array.isArray(value)) {
        if (value.length === 0) return `${indent}• ${translatedKey}: لا توجد بيانات`;

        const items = value.map((item: unknown, idx: number) => {
          if (typeof item === 'object' && item !== null) {
            return `${indent}  ${idx + 1}. ${formatObject(item as Record<string, unknown>, depth + 2).trim()}`;
          }
          return `${indent}  • ${item}`;
        }).join('\n');

        return `${indent}• ${translatedKey}:\n${items}`;
      }

      if (typeof value === 'object') {
        return `${indent}• ${translatedKey}:\n${formatObject(value, depth + 1)}`;
      }

      return `${indent}• ${translatedKey}: ${value}`;
    }).join('\n');
  };

  // Translate common JSON keys to Arabic
  const translateKey = (key: string): string => {
    const translations: Record<string, string> = {
      'summary': 'الملخص',
      'competitors': 'المنافسون',
      'name': 'الاسم',
      'pricing': 'التسعير',
      'strengths': 'نقاط القوة',
      'weaknesses': 'نقاط الضعف',
      'marketShare': 'حصة السوق',
      'tips': 'نصائح',
      'ideas': 'أفكار',
      'hashtags': 'الوسوم',
      'bestTimes': 'أفضل الأوقات',
      'instagram': 'إنستغرام',
      'tiktok': 'تيك توك',
      'snapchat': 'سناب شات',
      'steps': 'الخطوات',
      'budget': 'الميزانية',
      'timeline': 'الجدول الزمني',
      'platforms': 'المنصات',
      'size': 'الحجم',
      'growth': 'النمو',
      'seasons': 'المواسم',
      'consumerBehavior': 'سلوك المستهلك',
      'age': 'العمر',
      'gender': 'الجنس',
      'income': 'الدخل',
      'location': 'الموقع',
      'interests': 'الاهتمامات',
    };

    return translations[key] || key;
  };

  const handleExportText = () => {
    if (!report) return;

    const analysis = report.analysis_data;
    const text = `
تقرير تحليل المنتج
==================

المنتج: ${report.product_title || "غير متوفر"}
الرابط: ${report.product_url}
السعر: ${report.product_price || "غير متوفر"}
التاريخ: ${new Date(report.created_at).toLocaleDateString("ar-SA")}

الوصف:
${report.product_description || "غير متوفر"}

تحليل المنافسين:
${toDisplayString(analysis.competitorAnalysis)}

استراتيجية التسعير:
${toDisplayString(analysis.pricingStrategy)}

فرص السيو:
${toDisplayString(analysis.seoOpportunities)}

اقتراحات المحتوى:
${toDisplayString(analysis.contentSuggestions)}

رؤى السوق:
${toDisplayString(analysis.marketInsights)}

الجمهور المستهدف:
${toDisplayString(analysis.targetAudience)}

التوصيات:
${toDisplayString(analysis.recommendations)}
    `.trim();

    const dataBlob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report-${report.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: t.common.success,
      description: "تم تصدير التقرير بنجاح",
    });
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-mesh-bg">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent"
        />
      </div>
    );
  }

  if (!report) {
    return null;
  }

  const analysis = report.analysis_data;

  const sections = [
    {
      icon: Target,
      title: "تحليل المنافسين",
      content: analysis.competitorAnalysis,
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-500",
    },
    {
      icon: DollarSign,
      title: "استراتيجية التسعير",
      content: analysis.pricingStrategy,
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-500",
    },
    {
      icon: Search,
      title: "فرص تحسين محركات البحث",
      content: analysis.seoOpportunities,
      gradient: "from-purple-500/20 to-violet-500/20",
      iconColor: "text-purple-500",
    },
    {
      icon: Play,
      title: "فيديوهات المنافسين",
      content: analysis.competitorVideos,
      gradient: "from-red-500/20 to-pink-500/20",
      iconColor: "text-red-500",
    },
    {
      icon: Palette,
      title: "اقتراحات الشعار والتسويق",
      content: analysis.logoSuggestions,
      gradient: "from-indigo-500/20 to-purple-500/20",
      iconColor: "text-indigo-500",
    },
    {
      icon: FileEdit,
      title: "اقتراحات المحتوى",
      content: analysis.contentSuggestions,
      gradient: "from-orange-500/20 to-amber-500/20",
      iconColor: "text-orange-500",
    },
    {
      icon: TrendingUp,
      title: "رؤى السوق",
      content: analysis.marketInsights,
      gradient: "from-pink-500/20 to-rose-500/20",
      iconColor: "text-pink-500",
    },
    {
      icon: Users,
      title: "الجمهور المستهدف",
      content: analysis.targetAudience,
      gradient: "from-cyan-500/20 to-teal-500/20",
      iconColor: "text-cyan-500",
    },
    {
      icon: Lightbulb,
      title: "التوصيات",
      content: analysis.recommendations,
      gradient: "from-yellow-500/20 to-amber-500/20",
      iconColor: "text-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen gradient-mesh-bg">
      <Navbar />

      <div className="container mx-auto px-6 pt-24 pb-12">
        {/* Header with Parallax */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4 hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للوحة التحكم
          </Button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold mb-2"
              >
                <span className="text-gradient">{report.product_title || "تقرير تحليل المنتج"}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground mb-2"
              >
                {report.product_description || "تحليل شامل للمنتج والسوق"}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
              >
                <span className="flex items-center gap-1 glass-card px-3 py-1.5 rounded-full">
                  <FileText className="w-4 h-4" />
                  {new Date(report.created_at).toLocaleDateString("en-US")}
                </span>
                {report.product_price && (
                  <span className="flex items-center gap-1 glass-card px-3 py-1.5 rounded-full">
                    <DollarSign className="w-4 h-4" />
                    {report.product_price}
                  </span>
                )}
                <a
                  href={report.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors glass-card px-3 py-1.5 rounded-full"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-2"
            >
              <Button
                onClick={handleExportText}
                variant="outline"
                className="gap-2 hover:scale-105 transition-transform"
              >
                <Download className="w-4 h-4" />
                نص
              </Button>
              <Button
                onClick={handleExportJSON}
                className="bg-gradient-accent hover:scale-105 transition-transform gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                JSON
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Extracted Real Data Section */}
        {analysis.extractedData && (
          <ScrollAnimationWrapper animation="fade-in" delay={50}>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Database className="w-6 h-6 text-teal-500" />
                </motion.div>
                <h2 className="text-2xl font-bold">البيانات الحقيقية المستخرجة</h2>
                <span className="text-xs bg-teal-500/20 text-teal-600 px-2 py-1 rounded-full">
                  من صفحة المنتج
                </span>
              </div>
              <Card className="p-6 glass-card bg-gradient-to-br from-teal-500/10 to-cyan-500/10">
                <ExtractedDataSection
                  data={analysis.extractedData}
                  productUrl={report.product_url}
                />
              </Card>
            </div>
          </ScrollAnimationWrapper>
        )}

        {/* Interactive Charts */}
        <ScrollAnimationWrapper animation="scale-in" delay={100}>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BarChart3 className="w-6 h-6 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-bold">الرسوم البيانية التفاعلية</h2>
            </div>
            <ReportCharts analysisData={analysis} />
          </div>
        </ScrollAnimationWrapper>

        {/* Analysis Sections */}
        <div className="grid gap-6">
          {sections.map((section, index) => (
            <ScrollAnimationWrapper
              key={index}
              animation={index % 2 === 0 ? "slide-left" : "slide-right"}
              delay={index * 100}
            >
              <Card className={`p-6 glass-card hover:shadow-xl transition-all duration-500 bg-gradient-to-r ${section.gradient}`}>
                <div className="flex items-start gap-4">
                  <motion.div
                    className={`p-3 rounded-xl bg-card shadow-md ${section.iconColor}`}
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 2, -2, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  >
                    <section.icon className="w-6 h-6" />
                  </motion.div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-3">{section.title}</h2>
                    {section.title === "تحليل المنافسين" ? (
                      <CompetitorAnalysisSection data={section.content} />
                    ) : section.title === "اقتراحات المحتوى" ? (
                      <ContentSuggestionsSection contentSuggestions={section.content} />
                    ) : section.title === "فرص تحسين محركات البحث" || section.title.includes("SEO") ? (
                      <SeoOpportunitiesSection data={section.content} />
                    ) : section.title === "فيديوهات المنافسين" || section.title.includes("videos") ? (
                      <CompetitorVideosSection data={section.content} />
                    ) : section.title === "اقتراحات الشعار والتسويق" || section.title.includes("logo") ? (
                      <LogoSuggestionsSection data={section.content} />
                    ) : (
                      <div className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
                        {toDisplayString(section.content)}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </div>
  );
}
