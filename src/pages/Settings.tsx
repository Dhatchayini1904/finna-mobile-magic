import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Globe, 
  Volume2, 
  User, 
  Bell, 
  Shield, 
  Wallet,
  Loader2,
  Check,
  RefreshCw
} from "lucide-react";

export default function Settings() {
  const { profile, updateProfile, loading: profileLoading } = useUserProfile();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [formData, setFormData] = useState({
    full_name: "",
    monthly_income: "",
    occupation: "",
    risk_profile: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        monthly_income: profile.monthly_income?.toString() || "",
        occupation: profile.occupation || "",
        risk_profile: profile.risk_profile || "",
      });
      setVoiceEnabled(profile.voice_enabled ?? true);
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await updateProfile({
        full_name: formData.full_name,
        monthly_income: parseFloat(formData.monthly_income) || null,
        occupation: formData.occupation,
        risk_profile: formData.risk_profile as any,
        preferred_language: language,
        voice_enabled: voiceEnabled,
      });

      if (!error) {
        toast({
          title: language === 'ta' ? "சேமிக்கப்பட்டது!" : "Settings saved!",
          description: language === 'ta' ? "உங்கள் விருப்பங்கள் புதுப்பிக்கப்பட்டன" : "Your preferences have been updated",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleLanguageChange = (newLanguage: 'en' | 'ta') => {
    setLanguage(newLanguage);
    toast({
      title: newLanguage === 'ta' ? "மொழி மாற்றப்பட்டது" : "Language changed",
      description: newLanguage === 'ta' ? "தமிழ் தேர்ந்தெடுக்கப்பட்டது" : "English selected",
    });
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold font-display">
          {language === 'ta' ? 'அமைப்புகள்' : 'Settings'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'ta' ? 'உங்கள் விருப்பங்களை நிர்வகிக்கவும்' : 'Manage your preferences and profile'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Language Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {language === 'ta' ? 'மொழி' : 'Language'}
                </CardTitle>
                <CardDescription>
                  {language === 'ta' ? 'உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்' : 'Choose your preferred language'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={language}
              onValueChange={(value) => handleLanguageChange(value as 'en' | 'ta')}
              className="space-y-3"
            >
              <Label
                htmlFor="en"
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  language === 'en' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="en" id="en" />
                  <span className="text-2xl">🇬🇧</span>
                  <span className="font-medium">English</span>
                </div>
                {language === 'en' && <Check className="h-5 w-5 text-primary" />}
              </Label>
              <Label
                htmlFor="ta"
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  language === 'ta' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="ta" id="ta" />
                  <span className="text-2xl">🇮🇳</span>
                  <span className="font-medium">தமிழ் (Tamil)</span>
                </div>
                {language === 'ta' && <Check className="h-5 w-5 text-primary" />}
              </Label>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Voice Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Volume2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {language === 'ta' ? 'குரல் அமைப்புகள்' : 'Voice Settings'}
                </CardTitle>
                <CardDescription>
                  {language === 'ta' ? 'AI குரல் உதவியாளரை கட்டுப்படுத்தவும்' : 'Control the AI voice assistant'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div className="space-y-1">
                <p className="font-medium">
                  {language === 'ta' ? 'குரல் உதவியாளர்' : 'Voice Assistant'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ta' ? 'AI பதில்களுக்கு குரலை இயக்கவும்' : 'Enable voice for AI responses'}
                </p>
              </div>
              <Switch
                checked={voiceEnabled}
                onCheckedChange={setVoiceEnabled}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div className="space-y-1">
                <p className="font-medium">
                  {language === 'ta' ? 'குரல் உள்ளீடு' : 'Voice Input'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ta' ? 'குரலால் பேசுங்கள்' : 'Speak to interact with AI'}
                </p>
              </div>
              <Badge variant="secondary">
                {language === 'ta' ? 'இயக்கப்பட்டது' : 'Enabled'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {language === 'ta' ? 'சுயவிவரம்' : 'Profile'}
                </CardTitle>
                <CardDescription>
                  {language === 'ta' ? 'உங்கள் நிதி சுயவிவரத்தை புதுப்பிக்கவும்' : 'Update your financial profile'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {language === 'ta' ? 'முழு பெயர்' : 'Full Name'}
                </Label>
                <Input
                  id="name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder={language === 'ta' ? 'உங்கள் பெயர்' : 'Your name'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="income">
                  {language === 'ta' ? 'மாத வருமானம் (₹)' : 'Monthly Income (₹)'}
                </Label>
                <Input
                  id="income"
                  type="number"
                  value={formData.monthly_income}
                  onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupation">
                  {language === 'ta' ? 'தொழில்' : 'Occupation'}
                </Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder={language === 'ta' ? 'உங்கள் தொழில்' : 'Your occupation'}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  {language === 'ta' ? 'ரிஸ்க் சுயவிவரம்' : 'Risk Profile'}
                </Label>
                <RadioGroup
                  value={formData.risk_profile}
                  onValueChange={(value) => setFormData({ ...formData, risk_profile: value })}
                  className="flex gap-4"
                >
                  <Label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${formData.risk_profile === 'conservative' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                    <RadioGroupItem value="conservative" />
                    🛡️ {language === 'ta' ? 'பாதுகாப்பான' : 'Conservative'}
                  </Label>
                  <Label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${formData.risk_profile === 'moderate' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                    <RadioGroupItem value="moderate" />
                    ⚖️ {language === 'ta' ? 'மிதமான' : 'Moderate'}
                  </Label>
                  <Label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${formData.risk_profile === 'aggressive' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                    <RadioGroupItem value="aggressive" />
                    🚀 {language === 'ta' ? 'தீவிரமான' : 'Aggressive'}
                  </Label>
                </RadioGroup>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                {language === 'ta' ? 'சேமி' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {language === 'ta' ? 'அறிவிப்புகள்' : 'Notifications'}
                </CardTitle>
                <CardDescription>
                  {language === 'ta' ? 'அறிவிப்பு விருப்பங்களை நிர்வகிக்கவும்' : 'Manage notification preferences'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div className="space-y-1">
                <p className="font-medium">
                  {language === 'ta' ? 'பட்ஜெட் விழிப்பூட்டல்கள்' : 'Budget Alerts'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ta' ? 'வரம்பை நெருங்கும்போது எச்சரிக்கை' : 'Alert when approaching limits'}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div className="space-y-1">
                <p className="font-medium">
                  {language === 'ta' ? 'பில் நினைவூட்டல்கள்' : 'Bill Reminders'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ta' ? 'உடனடி பில்களுக்கு நினைவூட்டல்' : 'Reminders for upcoming bills'}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div className="space-y-1">
                <p className="font-medium">
                  {language === 'ta' ? 'AI நுண்ணறிவுகள்' : 'AI Insights'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ta' ? 'தினசரி நிதி நுண்ணறிவுகள்' : 'Daily financial insights'}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {language === 'ta' ? 'தரவு & தனியுரிமை' : 'Data & Privacy'}
                </CardTitle>
                <CardDescription>
                  {language === 'ta' ? 'உங்கள் தரவைக் கட்டுப்படுத்தவும்' : 'Control your data'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl border border-border">
              <p className="font-medium mb-2">
                {language === 'ta' ? 'தரவு ஏற்றுமதி' : 'Export Data'}
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                {language === 'ta' ? 'உங்கள் எல்லா தரவையும் பதிவிறக்கவும்' : 'Download all your data'}
              </p>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                {language === 'ta' ? 'ஏற்றுமதி' : 'Export'}
              </Button>
            </div>
            <div className="p-4 rounded-xl border border-destructive/50 bg-destructive/5">
              <p className="font-medium mb-2 text-destructive">
                {language === 'ta' ? 'தரவை அழி' : 'Delete Data'}
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                {language === 'ta' ? 'எல்லா பரிவர்த்தனைகளையும் நீக்கவும்' : 'Remove all your transactions'}
              </p>
              <Button variant="destructive" size="sm">
                {language === 'ta' ? 'அழி' : 'Delete'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
