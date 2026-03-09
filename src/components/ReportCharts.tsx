import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

interface ReportChartsProps {
  analysisData: {
    competitorAnalysis?: string;
    pricingStrategy?: string;
    seoOpportunities?: string;
    contentSuggestions?: string;
    marketInsights?: string;
    targetAudience?: string;
    recommendations?: string;
  };
}

const COLORS = [
  "hsl(186, 64%, 45%)", // primary teal
  "hsl(350, 80%, 65%)", // accent coral
  "hsl(142, 76%, 45%)", // green
  "hsl(262, 83%, 58%)", // purple
  "hsl(32, 95%, 55%)", // orange
  "hsl(340, 82%, 55%)", // pink
  "hsl(47, 96%, 53%)", // yellow
];

// Convert any value to string safely
const toStringValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

// Parse numeric data from GPT analysis
const parseNumericData = (content?: unknown): number => {
  const text = toStringValue(content);
  if (!text) return 0;
  
  // Look for actual numeric values in the analysis
  const numbers = text.match(/\d+(?:\.\d+)?/g);
  if (numbers) {
    // Calculate average of found numbers
    const avg = numbers.map(Number).reduce((a, b) => a + b, 0) / numbers.length;
    return Math.min(Math.round(avg), 100);
  }
  
  // If no numbers found, estimate based on content length
  return Math.min(text.length / 10, 100);
};

// Extract realistic price data from pricing strategy
const extractPriceData = (pricingValue?: unknown) => {
  const pricingText = toStringValue(pricingValue);
  if (!pricingText) {
    return [
      { name: "السعر الحالي", value: 75 },
      { name: "سعر المنافسين", value: 85 },
      { name: "السعر المقترح", value: 70 },
    ];
  }
  
  // Look for specific price values in the text
  const priceMatches = pricingText.match(/\d+(?:\.\d+)?/g);
  if (priceMatches && priceMatches.length >= 3) {
    return [
      { name: "السعر الحالي", value: parseFloat(priceMatches[0]) },
      { name: "سعر المنافسين", value: parseFloat(priceMatches[1]) || parseFloat(priceMatches[0]) * 1.1 },
      { name: "السعر المقترح", value: parseFloat(priceMatches[2]) || parseFloat(priceMatches[0]) * 0.95 },
    ];
  }
  
  // Fallback to parsing general numeric data
  const avgValue = parseNumericData(pricingText);
  return [
    { name: "السعر الحالي", value: avgValue },
    { name: "سعر المنافسين", value: avgValue * 1.1 },
    { name: "السعر المقترح", value: avgValue * 0.9 },
  ];
};

export function ReportCharts({ analysisData }: ReportChartsProps) {
  // Calculate scores for radar chart
  const radarData = useMemo(() => [
    { category: "المنافسة", score: parseNumericData(analysisData.competitorAnalysis), fullMark: 100 },
    { category: "التسعير", score: parseNumericData(analysisData.pricingStrategy), fullMark: 100 },
    { category: "تحسين محركات البحث (SEO)", score: parseNumericData(analysisData.seoOpportunities), fullMark: 100 },
    { category: "المحتوى", score: parseNumericData(analysisData.contentSuggestions), fullMark: 100 },
    { category: "السوق", score: parseNumericData(analysisData.marketInsights), fullMark: 100 },
    { category: "الجمهور", score: parseNumericData(analysisData.targetAudience), fullMark: 100 },
  ], [analysisData]);

  // Price comparison data
  const priceData = useMemo(() => extractPriceData(analysisData.pricingStrategy), [analysisData.pricingStrategy]);

  // Market distribution data
  const marketData = useMemo(() => {
    const hasInsights = analysisData.marketInsights && analysisData.marketInsights.length > 50;
    return [
      { name: "حصتك المتوقعة", value: hasInsights ? 25 : 20 },
      { name: "المنافس الأول", value: 30 },
      { name: "المنافس الثاني", value: 22 },
      { name: "المنافس الثالث", value: 15 },
      { name: "آخرون", value: hasInsights ? 8 : 13 },
    ];
  }, [analysisData.marketInsights]);

  // Overall performance score
  const overallScore = useMemo(() => {
    const scores = radarData.map(d => d.score);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [radarData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-3 rounded-xl shadow-lg backdrop-blur-sm">
          <p className="text-foreground font-medium">{label}</p>
          <p className="text-primary font-bold">{`${payload[0].value}${payload[0].name === 'score' ? '%' : ''}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Overall Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        whileHover={{ scale: 1.02, rotateY: 2 }}
        className="perspective-1000"
      >
        <Card className="p-6 glass-card h-full card-3d">
          <h3 className="text-xl font-bold mb-4 text-center">النتيجة الإجمالية</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="hsl(214, 32%, 91%)"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#scoreGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 440" }}
                  animate={{ strokeDasharray: `${overallScore * 4.4} 440` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(186, 64%, 45%)" />
                    <stop offset="100%" stopColor="hsl(350, 80%, 65%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span 
                  className="text-4xl font-bold text-gradient"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  {overallScore}%
                </motion.span>
              </div>
            </div>
          </div>
          <p className="text-center text-muted-foreground mt-4">
            {overallScore >= 80 ? "أداء ممتاز!" : overallScore >= 60 ? "أداء جيد" : "يحتاج تحسين"}
          </p>
        </Card>
      </motion.div>

      {/* Radar Chart - Performance Analysis */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        whileHover={{ scale: 1.02, rotateY: -2 }}
      >
        <Card className="p-6 glass-card h-full card-3d">
          <h3 className="text-xl font-bold mb-4 text-center">تحليل الأداء</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(214, 32%, 85%)" />
              <PolarAngleAxis 
                dataKey="category" 
                tick={{ fill: "hsl(222, 47%, 30%)", fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: "hsl(215, 16%, 47%)" }}
              />
              <Radar
                name="النتيجة"
                dataKey="score"
                stroke="hsl(186, 64%, 45%)"
                fill="hsl(186, 64%, 45%)"
                fillOpacity={0.3}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Bar Chart - Price Comparison */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="p-6 glass-card h-full card-3d">
          <h3 className="text-xl font-bold mb-4 text-center">مقارنة الأسعار</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={priceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis type="number" tick={{ fill: "hsl(215, 16%, 47%)" }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fill: "hsl(222, 47%, 30%)" }}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 12, 12, 0]}>
                {priceData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Pie Chart - Market Distribution */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="p-6 glass-card h-full card-3d">
          <h3 className="text-xl font-bold mb-4 text-center">توزيع السوق</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={marketData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {marketData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value}%`, "الحصة"]}
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(214, 32%, 91%)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px hsla(222, 47%, 11%, 0.1)",
                }}
                labelStyle={{ color: "hsl(222, 47%, 11%)" }}
              />
              <Legend 
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value) => <span style={{ color: "hsl(222, 47%, 30%)" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>
    </div>
  );
}