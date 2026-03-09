import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Tag,
  Store,
  Image,
  List,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

interface ExtractedData {
  originalTitle?: string;
  originalPrice?: string;
  category?: string;
  seller?: string;
  images?: string[];
  specifications?: string[];
}

interface ExtractedDataSectionProps {
  data?: ExtractedData;
  productUrl?: string;
}

export function ExtractedDataSection({ data, productUrl }: ExtractedDataSectionProps) {
  if (!data) {
    return (
      <Card className="p-6 glass-card">
        <p className="text-muted-foreground text-center">لا توجد بيانات مستخرجة</p>
      </Card>
    );
  }

  const infoItems = [
    {
      icon: Package,
      label: "اسم المنتج الأصلي",
      value: data.originalTitle,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Tag,
      label: "السعر الأصلي",
      value: data.originalPrice ? `${data.originalPrice} ريال` : undefined,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: List,
      label: "الفئة",
      value: data.category,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Store,
      label: "البائع/العلامة التجارية",
      value: data.seller,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-4 glass-card hover:shadow-lg transition-all ${item.bgColor} border-none`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-card shadow-sm ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-semibold">
                    {item.value || "غير متوفر"}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Images Section */}
      {data.images && data.images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 glass-card">
            <div className="flex items-center gap-2 mb-3">
              <Image className="w-5 h-5 text-pink-500" />
              <h4 className="font-semibold">صور المنتج المستخرجة</h4>
              <Badge variant="secondary" className="mr-auto">
                {data.images.length} صور
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {data.images.slice(0, 4).map((img, index) => (
                <motion.a
                  key={index}
                  href={img}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={img}
                    alt={`صورة المنتج ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-white" />
                  </div>
                </motion.a>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Specifications Section */}
      {data.specifications && data.specifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-4 glass-card">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-teal-500" />
              <h4 className="font-semibold">المواصفات المستخرجة</h4>
              <Badge variant="secondary" className="mr-auto">
                {data.specifications.length} مواصفة
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.specifications.map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <Badge 
                    variant="outline" 
                    className="py-1.5 px-3 bg-card/50 hover:bg-card transition-colors"
                  >
                    {spec}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Source Link */}
      {productUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            عرض صفحة المنتج الأصلية
          </a>
        </motion.div>
      )}
    </div>
  );
}
