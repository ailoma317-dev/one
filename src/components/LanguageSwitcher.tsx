import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "ar" : "en")}
      className="gap-2"
    >
      <Languages className="w-4 h-4" />
      {language === "en" ? "العربية" : "English"}
    </Button>
  );
};
