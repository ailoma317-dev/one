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
import { User, Mail, LogOut, Lock } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState<Record<string, any> | null>({ email: "user@example.com", created_at: new Date().toISOString() });
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("Test User");
  const [subscriptionStatus, setSubscriptionStatus] = useState<Record<string, any> | null>({ subscribed: true });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [invoices, setInvoices] = useState<Record<string, any>[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Supabase auth and session fetching removed.
    fetchInvoices();
  }, []);

  const checkSubscription = async () => {
    // Supabase function invocation removed.
  };

  const fetchInvoices = async () => {
    setInvoicesLoading(true);
    try {
      const mockInvoices = [
        {
          id: 'INV-001',
          amount: '45.00',
          currency: 'SAR',
          status: 'paid',
          created_at: new Date().toISOString(),
        }
      ];
      setInvoices(mockInvoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setInvoicesLoading(false);
    }
  };

  const handleSignOut = async () => {
    toast({ title: "Sign Out", description: "Session cleared (Simulation)." });
    navigate("/");
  };

  const handleUpdateProfile = async () => {
    toast({
      title: t.common.success,
      description: "Profile update simulation successful.",
    });
  };

  const handleChangePassword = async () => {
    toast({
      title: "Password Change Simulation",
      description: "Password update is currently disabled while transitioning databases.",
    });
  };

  if (loading) {
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
                    value={user?.email}
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
                    disabled={!currentPassword || !newPassword || !confirmNewPassword}
                  >
                    Update Password
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleUpdateProfile}
                  className="bg-gradient-accent hover:opacity-90"
                >
                  {t.profile.saveChanges}
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
                {invoices.map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                    <div>
                      <p className="font-medium">Invoice #{invoice.id}</p>
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
                  {new Date(user?.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-foreground/70 text-sm mb-1">{t.profile.currentPlan}</p>
                <p className="text-lg font-semibold">
                  {loading ? "..." : (subscriptionStatus && subscriptionStatus.subscribed ? "Premium Plan" : t.profile.freeTrial)}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
