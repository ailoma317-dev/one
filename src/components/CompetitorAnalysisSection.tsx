import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Target
} from "lucide-react";

interface Competitor {
  name: string;
  pricing?: string;
  marketShare?: string;
  strengths?: string;
  weaknesses?: string;
}

interface CompetitorAnalysisData {
  competitors?: Competitor[];
  summary?: string;
}

interface CompetitorAnalysisSectionProps {
  data: unknown;
}

// Colors for competitor cards
const competitorColors = [
  { bg: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30", icon: "text-blue-500" },
  { bg: "from-purple-500/20 to-violet-500/20", border: "border-purple-500/30", icon: "text-purple-500" },
  { bg: "from-green-500/20 to-emerald-500/20", border: "border-green-500/30", icon: "text-green-500" },
  { bg: "from-orange-500/20 to-amber-500/20", border: "border-orange-500/30", icon: "text-orange-500" },
  { bg: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/30", icon: "text-pink-500" },
  { bg: "from-cyan-500/20 to-teal-500/20", border: "border-cyan-500/30", icon: "text-cyan-500" },
];

export function CompetitorAnalysisSection({ data }: CompetitorAnalysisSectionProps) {
  // Try to parse the data as structured competitor analysis
  const parseCompetitorData = (value: unknown): CompetitorAnalysisData | null => {
    if (!value) return null;

    // If it's already an object with competitors array
    if (typeof value === 'object' && value !== null) {
      const obj = value as Record<string, unknown>;
      if (Array.isArray(obj.competitors)) {
        return obj as CompetitorAnalysisData;
      }
    }

    // If it's a string, try to extract competitor information
    if (typeof value === 'string') {
      try {
        // Try to parse as JSON if it looks like JSON
        if (value.trim().startsWith('{') || value.trim().startsWith('[')) {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return { competitors: parsed };
          } else if (parsed.competitors) {
            return parsed as CompetitorAnalysisData;
          }
        }

        // If not JSON, try to extract competitor data from text
        // Look for competitor patterns in the text
        const competitors: Competitor[] = [];
        
        // Split the text by double newlines to separate sections
        const sections = value.split(/\n\s*\n/);
        
        for (const section of sections) {
          if (section.trim().length < 10) continue; // Skip short sections
          
          // Look for competitor names (common Saudi e-commerce platforms)
          if (section.toLowerCase().includes('noon') || 
              section.toLowerCase().includes('jarir') || 
              section.toLowerCase().includes('amazon') ||
              section.toLowerCase().includes('nons') ||
              section.toLowerCase().includes('extra') ||
              section.toLowerCase().includes('careem') ||
              section.toLowerCase().includes('talabat') ||
              section.toLowerCase().includes('herf') ||
              section.toLowerCase().includes('souq') ||
              section.toLowerCase().includes('shop') ||
              section.toLowerCase().includes('market') ||
              section.toLowerCase().includes('mall')) {
            
            // Extract competitor name
            const nameMatch = section.match(/([A-Za-z\s]+)/);
            const name = nameMatch ? nameMatch[1].trim() : 'Unknown Competitor';
            
            // Extract pricing info
            const pricingMatch = section.match(/(price|pricing|cost|rate|fee|charge|costs|selling at|priced at|\d+ riyal|riyal|sar|\d+ sar)/i);
            const pricing = pricingMatch ? pricingMatch[0] : undefined;
            
            // Extract market share info
            const marketShareMatch = section.match(/(market share|\d+%)|(\d+\s*%)/i);
            const marketShare = marketShareMatch ? marketShareMatch[0] : undefined;
            
            // Extract strengths
            const strengthsMatch = section.match(/(strength|strengths|advantage|advantages|strong|good at|excellent|leading|dominant|best|top|stronger|superior)/i);
            const strengths = strengthsMatch ? section.substring(strengthsMatch.index!).substring(0, 100) : undefined;
            
            // Extract weaknesses
            const weaknessesMatch = section.match(/(weakness|weaknesses|disadvantage|disadvantages|weak|poor|lacking|lack|below|inferior|issue|problem|struggle)/i);
            const weaknesses = weaknessesMatch ? section.substring(weaknessesMatch.index!).substring(0, 100) : undefined;
            
            competitors.push({
              name,
              pricing,
              marketShare,
              strengths,
              weaknesses
            });
          }
        }
        
        if (competitors.length > 0) {
          return { competitors };
        }
      } catch (e) {
        console.error('Error parsing competitor data:', e);
      }
    }

    return null;
  };

  const competitorData = parseCompetitorData(data);

  // If we have structured competitor data, show the beautiful cards
  if (competitorData && competitorData.competitors && competitorData.competitors.length > 0) {
    return (
      <div className="space-y-6">
        {/* Summary */}
        {competitorData.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20"
          >
            <p className="text-foreground/80 leading-relaxed">{competitorData.summary}</p>
          </motion.div>
        )}

        {/* Competitor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitorData.competitors.map((competitor, index) => {
            const colorScheme = competitorColors[index % competitorColors.length];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className={`p-5 h-full bg-gradient-to-br ${colorScheme.bg} ${colorScheme.border} border-2 hover:shadow-xl transition-all duration-300`}>
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl bg-card shadow-md ${colorScheme.icon}`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{competitor.name}</h3>
                      {competitor.marketShare && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          <Percent className="w-3 h-3 ml-1" />
                          {competitor.marketShare}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  {competitor.pricing && (
                    <div className="mb-4 p-3 rounded-lg bg-card/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span>التسعير</span>
                      </div>
                      <p className="text-sm font-medium">{competitor.pricing}</p>
                    </div>
                  )}

                  {/* Strengths */}
                  {competitor.strengths && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-sm text-green-600 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-medium">نقاط القوة</span>
                      </div>
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        {competitor.strengths}
                      </p>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {competitor.weaknesses && (
                    <div>
                      <div className="flex items-center gap-2 text-sm text-red-500 mb-2">
                        <TrendingDown className="w-4 h-4" />
                        <span className="font-medium">نقاط الضعف</span>
                      </div>
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        {competitor.weaknesses}
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Card className="overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-b">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">جدول المقارنة</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-semibold">المنافس</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">الحصة السوقية</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">التسعير</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {competitorData.competitors.map((competitor, index) => {
                    const colorScheme = competitorColors[index % competitorColors.length];
                    return (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colorScheme.bg}`} />
                            <span className="font-medium">{competitor.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {competitor.marketShare || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {competitor.pricing || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Fallback to formatted text display if data is not structured
  const formatFallbackData = (value: unknown): string => {
    if (value === null || value === undefined) return "غير متوفر";
    if (typeof value === 'string') return value;

    if (typeof value === 'object') {
      try {
        // Try to extract summary if it exists
        const obj = value as Record<string, unknown>;
        if (obj.summary && typeof obj.summary === 'string') {
          return obj.summary;
        }

        // Format object nicely
        return Object.entries(obj)
          .map(([key, val]) => {
            const translatedKey = key === 'summary' ? 'الملخص' : key;
            if (typeof val === 'string') {
              return `• ${translatedKey}: ${val}`;
            }
            return `• ${translatedKey}: ${JSON.stringify(val)}`;
          })
          .join('\n');
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  return (
    <div className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
      {formatFallbackData(data)}
    </div>
  );
}
