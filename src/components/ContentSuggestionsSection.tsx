import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Instagram, Music2, Camera, Lightbulb, Hash, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";

interface ContentSuggestionsSectionProps {
  contentSuggestions: any; // Can be string or object
}

interface PlatformContent {
  ideas: string[];
  hashtags: string[];
  bestTimes: string[];
  tips: string[];
}

const parsePlatformContent = (contentSuggestions: any, platform: string): PlatformContent => {
  // Try to parse if it's a JSON object
  let platformData: any = null;

  if (typeof contentSuggestions === 'object' && contentSuggestions !== null) {
    // Direct object access
    const platformKey = platform.toLowerCase();
    platformData = contentSuggestions[platformKey] || contentSuggestions[platform];
  } else if (typeof contentSuggestions === 'string') {
    // Try to parse JSON string
    try {
      const parsed = JSON.parse(contentSuggestions);
      if (typeof parsed === 'object') {
        const platformKey = platform.toLowerCase();
        platformData = parsed[platformKey] || parsed[platform];
      }
    } catch {
      // Not JSON, treat as plain text
    }
  }

  // If we found structured platform data, use it
  if (platformData && typeof platformData === 'object') {
    return {
      ideas: Array.isArray(platformData.ideas) ? platformData.ideas : [],
      hashtags: Array.isArray(platformData.hashtags) ? platformData.hashtags : [],
      bestTimes: [],
      tips: [],
    };
  }

  // Fallback to text parsing
  const content = typeof contentSuggestions === 'string' ? contentSuggestions : JSON.stringify(contentSuggestions);
  const lines = content.split('\n').filter(line => line.trim());
  const ideas: string[] = [];
  const hashtags: string[] = [];
  const bestTimes: string[] = [];
  const tips: string[] = [];

  let currentSection = 'ideas';

  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes('hashtag') || lowerLine.includes('هاشتاق') || lowerLine.includes('#')) {
      currentSection = 'hashtags';
    } else if (lowerLine.includes('time') || lowerLine.includes('وقت') || lowerLine.includes('توقيت')) {
      // Skip time-related content
      return;
    } else if (lowerLine.includes('tip') || lowerLine.includes('نصيح') || lowerLine.includes('اقتراح')) {
      // Skip tip-related content
      return;
    }

    const cleanLine = line.replace(/^[-*•]\s*/, '').trim();
    if (cleanLine.length > 5) {
      if (currentSection === 'hashtags' || cleanLine.startsWith('#')) {
        hashtags.push(cleanLine);
      } else {
        ideas.push(cleanLine);
      }
    }
  });

  // إذا لم يتم العثور على محتوى، أضف محتوى افتراضي
  if (ideas.length === 0) {
    ideas.push(
      `فيديو عرض المنتج بطريقة إبداعية`,
      `محتوى تعليمي عن استخدامات المنتج`,
      `تحدي أو مسابقة تفاعلية مع المتابعين`,
      `قصص نجاح العملاء مع المنتج`,
      `محتوى مقارنة مع منتجات مشابهة`,
      `محتوى قبل وبعد باستخدام المنتج`,
      `محتوى إجابات على الأسئلة الشائعة`,
      `محتوى مراجعة من العملاء`,
      `محتوى استخدامات غير تقليدية للمنتج`,
      `محتوى مقارنة بين الأحجام أو الألوان`
    );
  }

  if (hashtags.length === 0) {
    hashtags.push('#منتج_سعودي', '#تسوق_اونلاين', '#عروض_خاصة', '#جودة_عالية', '#توصيل_سريع');
  }

  return { ideas, hashtags, bestTimes, tips };
};

const platformConfig = {
  all: {
    name: 'جميع المنصات',
    icon: Lightbulb,
    color: 'from-blue-500 to-purple-600',
    bgColor: 'bg-gradient-to-br from-blue-500/10 to-purple-600/10',
    borderColor: 'border-blue-500/30',
  },
};

export function ContentSuggestionsSection({ contentSuggestions }: ContentSuggestionsSectionProps) {
  const allContent = parsePlatformContent(contentSuggestions, 'all');

  const renderContent = (content: PlatformContent) => {
    const config = platformConfig.all;

    return (
      <div className="space-y-6">
        {/* أفكار المحتوى */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`${config.bgColor} ${config.borderColor} border`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                اقتراحات المحتوى ({content.ideas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {content.ideas.slice(0, 10).map((idea, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className={`mt-1.5 h-2 w-2 rounded-full bg-gradient-to-r ${config.color} flex-shrink-0`} />
                    <span className="text-muted-foreground">{idea}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* الهاشتاقات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`${config.bgColor} ${config.borderColor} border`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Hash className="h-5 w-5 text-blue-500" />
                الهاشتاقات المقترحة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {content.hashtags.slice(0, 15).map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * index }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r ${config.color} text-white`}
                  >
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </motion.span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          اقتراحات المحتوى
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {renderContent(allContent)}
      </CardContent>
    </Card>
  );
}
