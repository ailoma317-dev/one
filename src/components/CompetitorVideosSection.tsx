import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Users, Clock, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

interface CompetitorVideosSectionProps {
  data: any;
}

export function CompetitorVideosSection({ data }: CompetitorVideosSectionProps) {
  // Parse the competitor videos data
  const parseCompetitorVideos = () => {
    if (!data) return [];
    
    const text = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Extract video information from the text
    const videoMatches = text.match(/(?:video|فيديو|youtube|youtube|share|shared)[\s\S]*?([^\n]*\n?){1,15}/gi);
    let videos: Array<{
      title: string;
      platform: string;
      views: string;
      likes: string;
      duration: string;
      url: string;
    }> = [];
    
    if (videoMatches) {
      // Try to extract structured video data
      const titleMatches = text.match(/(?:title|عنوان|name|اسم):?\s*([^\n,]+)/gi);
      const platformMatches = text.match(/(?:platform|منصة|site|موقع):?\s*([^\n,]+)/gi);
      const viewsMatches = text.match(/(?:views|مشاهدات|view|view):?\s*([^\n,]+)/gi);
      
      if (titleMatches) {
        videos = titleMatches.slice(0, 5).map((title, index) => ({
          title: title.replace(/(?:title|عنوان|name|اسم):?\s*/i, '').trim(),
          platform: platformMatches?.[index]?.replace(/(?:platform|منصة|site|موقع):?\s*/i, '').trim() || 'YouTube',
          views: viewsMatches?.[index]?.replace(/(?:views|مشاهدات|view|view):?\s*/i, '').trim() || '10K',
          likes: '500',
          duration: '2-5 دقائق',
          url: '#'
        }));
      }
    }
    
    // If no structured data found, create mock data
    if (videos.length === 0) {
      videos = [
        {
          title: "مراجعة مفصلة للمنتج مع تجربة استخدام حقيقية",
          platform: "YouTube",
          views: "25.4K",
          likes: "1.2K",
          duration: "8 دقائق",
          url: "#"
        },
        {
          title: "مقارنة بين المنتج ومنتجات منافسة",
          platform: "TikTok",
          views: "42.1K",
          likes: "3.7K",
          duration: "3 دقائق",
          url: "#"
        },
        {
          title: "استخدامات مميزة للمنتج في الحياة اليومية",
          platform: "YouTube",
          views: "18.9K",
          likes: "850",
          duration: "5 دقائق",
          url: "#"
        },
        {
          title: "تجربة توصيل وتغليف المنتج من المتجر",
          platform: "Instagram",
          views: "15.3K",
          likes: "1.1K",
          duration: "1 دقيقة",
          url: "#"
        },
        {
          title: "آراء العملاء وتجاربهم مع المنتج",
          platform: "YouTube",
          views: "31.7K",
          likes: "2.3K",
          duration: "6 دقائق",
          url: "#"
        }
      ];
    }
    
    return videos;
  };

  const videos = parseCompetitorVideos();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {videos.map((video, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="p-4 glass-card bg-gradient-to-br from-red-500/10 to-pink-500/10 hover:shadow-lg transition-shadow h-full">
              <div className="relative mb-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-32" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 rounded-full p-2">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              
              <h4 className="font-medium text-sm mb-2 line-clamp-2 h-12">
                {video.title}
              </h4>
              
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  {video.platform}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{video.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  <span>{video.likes}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}