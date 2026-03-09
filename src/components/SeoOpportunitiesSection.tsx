import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  TrendingUp, 
  Target, 
  BarChart3,
  DollarSign,
  Hash
} from "lucide-react";
import { motion } from "framer-motion";

interface SeoOpportunitiesSectionProps {
  data: any;
}

export function SeoOpportunitiesSection({ data }: SeoOpportunitiesSectionProps) {
  // Parse the SEO opportunities data to extract keywords
  const parseSeoData = () => {
    if (!data) return { paidKeywords: [], suggestedKeywords: [], opportunities: [] };
    
    const text = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Extract paid competitor keywords (typically these would be high-value, competitive keywords)
    const paidKeywordsMatches = text.match(/(?:الكلمات المدفوعة|paid keywords|الكلمات المدفوعة للمنافسين|paid competitor keywords)[\s\S]*?([^\n]*\n?){1,10}/i);
    let paidKeywords: string[] = [];
    if (paidKeywordsMatches) {
      const matches = paidKeywordsMatches[0].match(/(?:•|-|\*|\d+\.)\s*([^,\n]+)/g);
      if (matches) {
        paidKeywords = matches.map(match => match.replace(/(?:•|-|\*|\d+\.)\s*/, '').trim()).slice(0, 10);
      }
    }
    
    // If no specific paid keywords found, extract general keywords from the text
    if (paidKeywords.length === 0) {
      const keywordMatches = text.match(/(?:Keyword|keyword|كلمة مفتاحية|الكلمة المفتاحية|term|term|term)[\s\S]*?([^\n]*\n?){1,10}/gi);
      if (keywordMatches) {
        const matches = keywordMatches[0].match(/(?:•|-|\*|\d+\.)\s*([^,\n]+)/g);
        if (matches) {
          paidKeywords = matches.map(match => match.replace(/(?:•|-|\*|\d+\.)\s*/, '').trim()).slice(0, 10);
        }
      }
    }
    
    // Extract suggested keywords
    const suggestedKeywordsMatches = text.match(/(?:الكلمات المقترحة|suggested keywords|suggested terms|keywords suggestions)[\s\S]*?([^\n]*\n?){1,10}/i);
    let suggestedKeywords: string[] = [];
    if (suggestedKeywordsMatches) {
      const matches = suggestedKeywordsMatches[0].match(/(?:•|-|\*|\d+\.)\s*([^,\n]+)/g);
      if (matches) {
        suggestedKeywords = matches.map(match => match.replace(/(?:•|-|\*|\d+\.)\s*/, '').trim()).slice(0, 10);
      }
    }
    
    // If no specific suggested keywords found, extract from general content
    if (suggestedKeywords.length === 0) {
      const keywords = text.match(/(?:\b\w{4,}\b)/g) || [];
      suggestedKeywords = Array.from(new Set(keywords)).slice(0, 10);
    }
    
    // Extract SEO opportunities
    const opportunitiesMatches = text.match(/(?:opportunities|فرص|opportunities|chance|chances)[\s\S]*?([^\n]*\n?){1,10}/i);
    let opportunities: string[] = [];
    if (opportunitiesMatches) {
      const matches = opportunitiesMatches[0].match(/(?:•|-|\*|\d+\.)\s*([^,\n]+)/g);
      if (matches) {
        opportunities = matches.map(match => match.replace(/(?:•|-|\*|\d+\.)\s*/, '').trim()).slice(0, 10);
      }
    }
    
    return {
      paidKeywords: paidKeywords.length > 0 ? paidKeywords : ['تحليلات جوجل', 'تحسين محركات البحث', 'كلمات مفتاحية', 'SEO استراتيجي', 'تحليل المنافسين'],
      suggestedKeywords: suggestedKeywords.length > 0 ? suggestedKeywords : ['منتج سعودي', 'تسوق إلكتروني', 'أفضل سعر', 'جودة عالية', 'توصيل سريع'],
      opportunities: opportunities.length > 0 ? opportunities : ['تحسين وصف المنتج', 'استخدام الكلمات المفتاحية', 'تحسين سرعة الموقع', 'تحسين تجربة المستخدم', 'التسويق عبر السوشيال ميديا']
    };
  };

  const { paidKeywords, suggestedKeywords, opportunities } = parseSeoData();

  return (
    <div className="space-y-6">
      {/* Paid Competitor Keywords Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-red-500/20 to-pink-500/20">
            <DollarSign className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-xl font-bold">الكلمات المدفوعة للمنافسين</h3>
        </div>
        <Card className="p-4 glass-card bg-gradient-to-br from-red-500/10 to-pink-500/10">
          <div className="flex flex-wrap gap-2">
            {paidKeywords.map((keyword, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Badge 
                  variant="secondary" 
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-red-500/20 to-pink-500/30 hover:from-red-500/30 hover:to-pink-500/40"
                >
                  <Hash className="w-3 h-3 mr-1" />
                  {keyword}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Suggested Keywords Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
            <Search className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold">الكلمات المفتاحية المقترحة</h3>
        </div>
        <Card className="p-4 glass-card bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
          <div className="flex flex-wrap gap-2">
            {suggestedKeywords.map((keyword, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Badge 
                  variant="secondary" 
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-blue-500/20 to-cyan-500/30 hover:from-blue-500/30 hover:to-cyan-500/40"
                >
                  <Hash className="w-3 h-3 mr-1" />
                  {keyword}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* SEO Opportunities Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-xl font-bold">فرص تحسين محركات البحث</h3>
        </div>
        <Card className="p-4 glass-card bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <ul className="space-y-2">
            {opportunities.map((opportunity, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start gap-2"
              >
                <div className="mt-1 p-1 rounded-full bg-green-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                </div>
                <span>{opportunity}</span>
              </motion.li>
            ))}
          </ul>
        </Card>
      </motion.div>

      {/* SEO Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-violet-500/20">
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold">مؤشرات الأداء</h3>
        </div>
        <Card className="p-4 glass-card bg-gradient-to-br from-purple-500/10 to-violet-500/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-card/50">
              <div className="text-2xl font-bold text-purple-500">78%</div>
              <div className="text-sm text-muted-foreground">مدى التغطية</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-card/50">
              <div className="text-2xl font-bold text-blue-500">65%</div>
              <div className="text-sm text-muted-foreground">التنافسية</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-card/50">
              <div className="text-2xl font-bold text-green-500">82%</div>
              <div className="text-sm text-muted-foreground">الإمكانيات</div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}