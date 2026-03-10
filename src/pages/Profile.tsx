import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { invoices as invoicesApi, subscriptions as subscriptionsApi, type Invoice, type Subscription } from "@/lib/supabase";
import { User, Mail, LogOut, Lock } from "lucide-react";

export default function Profile() {
  const { user, profile, loading: authLoading, signOut, updateProfile, updatePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (profile) {
      setFullName(profile.full_name || "");
    }

    if (user) {
      fetchInvoices();
      fetchSubscription();
    }
  }, [user, profile, authLoading, navigate]);

  const fetchSubscription = async () => {
    if (!user) return;
    
    try {
      const { data } = await subscriptionsApi.get(user.id);
      setSubscription(data);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  const fetchInvoices = async () => {
    if (!user) return;
    
    setInvoicesLoading(true);
    try {
      const { data, error } = await invoicesApi.getAll(user.id);
      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setInvoicesLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ title: t.common.success, description: "تم تسجيل الخروج بنجاح" });
    navigate("/");
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await updateProfile({ full_name: fullName });
      if (error) throw error;
      
      toast({
        title: t.common.success,
        description: "تم تحديث الملف الشخصي بنجاح",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء التحديث";
      toast({
        title: t.common.error,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast({
        title: t.common.error,
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: t.common.error,
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await updatePassword(newPassword);
      if (error) throw error;
      
      toast({
        title: t.common.success,
        description: "تم تغيير كلمة المرور بنجاح",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء تغيير كلمة المرور";
      toast({
        title: t.common.error,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-6 pt-32 pb-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">{t.profile.titleHighlight}</span> {t.profile.title}
          </h1>
          <p className="text-foreground/70">{t.profile.subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 glass-card glow">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t.profile.fullName}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t.profile.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="pl-10 opacity-60"
                  />
                </div>
                <p className="text-sm text-foreground/60">{t.profile.emailNote}</p>
              </div>

              {/* Password Change Section */}
              <div className="pt-4 border-t border-border/30">
                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                      <Input
                        id="confirmNewPassword"
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleChangePassword}
                    className="bg-gradient-accent hover:opacity-90"
                    disabled={!currentPassword || !newPassword || !confirmNewPassword || loading}
                  >
                    Update Password
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleUpdateProfile}
                  className="bg-gradient-accent hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? "جاري الحفظ..." : t.profile.saveChanges}
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t.profile.signOut}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Invoices Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="p-8 glass-card">
            <h2 className="text-xl font-bold mb-4">Payment Invoices</h2>
            {invoicesLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
              </div>
            ) : invoices.length === 0 ? (
              <p className="text-foreground/70 text-center py-4">No invoices found</p>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <div>
                      <p className="font-medium">Invoice #{invoice.id.slice(0, 8)}</p>
                      <p className="text-sm text-foreground/70">{new Date(invoice.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{invoice.amount} {invoice.currency || 'SAR'}</p>
                      <p className={`text-sm ${invoice.status === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {invoice.status?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Account Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="p-8 glass-card">
            <h2 className="text-xl font-bold mb-4">{t.profile.accountStats}</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-foreground/70 text-sm mb-1">{t.profile.memberSince}</p>
                <p className="text-lg font-semibold">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
                </p>
              </div>
              <div>
                <p className="text-foreground/70 text-sm mb-1">{t.profile.currentPlan}</p>
                <p className="text-lg font-semibold">
                  {subscription?.status === 'active' || subscription?.status === 'trialing' 
                    ? "Premium Plan" 
                    : t.profile.freeTrial}
                </p>
              </div>
              <div>
                <p className="text-foreground/70 text-sm mb-1">الرصيد المتبقي</p>
                <p className="text-lg font-semibold">
                  {profile?.credits ?? 0} رصيد
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
