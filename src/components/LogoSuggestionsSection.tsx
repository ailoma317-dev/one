import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Type, Image, Users, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface LogoSuggestionsSectionProps {
  data: any;
}

export function LogoSuggestionsSection({ data }: LogoSuggestionsSectionProps) {
  // Parse the logo suggestions data
  const parseLogoSuggestions = () => {
    if (!data) return {
      idea: "فكرة شعار افتراضية تعبّر عن جودة المنتج وموثوقيته",
      bio: "منتج مميز يقدّم حلولاً مبتكرة لاحتياجات السوق السعودي",
      marketingImages: [
        "فكرة صورة تسويقية تعبّر عن الجودة",
        "فكرة صورة تسويقية تعبّر عن الابتكار",
        "فكرة صورة تسويقية تعبّر عن الثقة"
      ],
      affiliateSentence: "مثالي لمتاجري العمولة - منتج مطلوب في السوق السعودي مع إمكانيات كبيرة للربح"
    };
    
    const text = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Extract logo idea
    const ideaMatch = text.match(/(?:idea|فكرة|concept|แนวคิด):?\s*([^\n.]+)/i);
    const idea = ideaMatch ? ideaMatch[1].trim() : "فكرة شعار افتراضية تعبّر عن جودة المنتج وموثوقيته";
    
    // Extract bio
    const bioMatch = text.match(/(?:bio|bio|biography|biography|وصف|description):?\s*([^\n.]+)/i);
    const bio = bioMatch ? bioMatch[1].trim() : "منتج مميز يقدّم حلولاً مبتكرة لاحتياجات السوق السعودي";
    
    // Extract marketing images
    const marketingImagesMatches = text.match(/(?:image|صورة|marketing|تسويق|idea|فكرة)[\s\S]*?([^\n]*\n?){1,6}/gi);
    let marketingImages: string[] = [];
    if (marketingImagesMatches) {
      const matches = marketingImagesMatches[0].match(/(?:•|-|\*|\d+\.)\s*([^,\n]+)/g);
      if (matches) {
        marketingImages = matches.map(match => match.replace(/(?:•|-|\*|\d+\.)\s*/, '').trim()).slice(0, 3);
      }
    }
    
    if (marketingImages.length === 0) {
      marketingImages = [
        "فكرة صورة تسويقية تعبّر عن الجودة",
        "فكرة صورة تسويقية تعبّر عن الابتكار",
        "فكرة صورة تسويقية تعبّر عن الثقة"
      ];
    }
    
    // Extract affiliate sentence
    const affiliateMatch = text.match(/(?:affiliate|affiliate|marketer|مسوق|commission|عمولة|revenue):?\s*([^\n.]+)/i);
    const affiliateSentence = affiliateMatch ? affiliateMatch[1].trim() : "مثالي لمتاجري العمولة - منتج مطلوب في السوق السعودي مع إمكانيات كبيرة للربح";
    
    return {
      idea,
      bio,
      marketingImages,
      affiliateSentence
    };
  };

  const { idea, bio, marketingImages, affiliateSentence } = parseLogoSuggestions();

  return (
    <div className="space-y-6">
      {/* Logo Idea */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
            <Palette className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold">فكرة الشعار المقترحة</h3>
        </div>
        <Card className="p-4 glass-card bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <p className="text-muted-foreground">{idea}</p>
        </Card>
      </motion.div>

      {/* Product Bio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
            <Type className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold">جملة التعريف (Bio)</h3>
        </div>
        <Card className="p-4 glass-card bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
          <p className="text-muted-foreground italic">"{bio}"</p>
        </Card>
      </motion.div>

      {/* Marketing Images */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
            <Image className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-xl font-bold">أفكار الصور التسويقية</h3>
        </div>
        <Card className="p-4 glass-card bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketingImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="flex flex-col items-center text-center p-4 rounded-lg bg-card/50"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32 mb-2" />
                <span className="text-sm text-muted-foreground">{image}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Affiliate Sentence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20">
            <Users className="w-5 h-5 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold">جملة لمتاجري العمولة</h3>
        </div>
        <Card className="p-4 glass-card bg-gradient-to-br from-orange-500/10 to-red-500/10">
          <p className="text-muted-foreground">{affiliateSentence}</p>
        </Card>
      </motion.div>

      {/* Affiliate Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500/20 to-rose-500/20">
            <Heart className="w-5 h-5 text-pink-500" />
          </div>
          <h3 className="text-xl font-bold">مزايا المنتج لمتاجري العمولة</h3>
        </div>
        <Card className="p-4 glass-card bg-gradient-to-br from-pink-500/10 to-rose-500/10">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="mt-1 p-1 rounded-full bg-pink-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
              </div>
              <span>طلب كبير في السوق السعودي</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 p-1 rounded-full bg-pink-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
              </div>
              <span>أسعار تنافسية ونسبة ربح جيدة</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 p-1 rounded-full bg-pink-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
              </div>
              <span>دعم فني ممتاز وسمعة طيبة</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 p-1 rounded-full bg-pink-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
              </div>
              <span>نظام تابع موثوق وسهل الاستخدام</span>
            </li>
          </ul>
        </Card>
      </motion.div>
    </div>
  );
}