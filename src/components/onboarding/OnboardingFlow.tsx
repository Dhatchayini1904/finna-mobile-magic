import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Loader2, Wallet, Briefcase, Shield, Target, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

const occupations = [
  { value: "student", label: "Student", icon: "📚" },
  { value: "employee", label: "Salaried Employee", icon: "💼" },
  { value: "business", label: "Business Owner", icon: "🏪" },
  { value: "freelancer", label: "Freelancer", icon: "💻" },
  { value: "retired", label: "Retired", icon: "🏖️" },
  { value: "homemaker", label: "Homemaker", icon: "🏠" },
];

const riskProfiles = [
  { 
    value: "conservative", 
    label: "Conservative", 
    description: "I prefer safe investments with stable returns",
    icon: "🛡️",
    color: "border-green-500/50 bg-green-500/10"
  },
  { 
    value: "moderate", 
    label: "Moderate", 
    description: "I'm okay with some risk for better returns",
    icon: "⚖️",
    color: "border-yellow-500/50 bg-yellow-500/10"
  },
  { 
    value: "aggressive", 
    label: "Aggressive", 
    description: "I can handle high risk for maximum returns",
    icon: "🚀",
    color: "border-red-500/50 bg-red-500/10"
  },
];

const financialGoals = [
  { value: "emergency_fund", label: "Build Emergency Fund", icon: "🏥" },
  { value: "save_tax", label: "Save Tax", icon: "📋" },
  { value: "buy_home", label: "Buy a Home", icon: "🏠" },
  { value: "buy_vehicle", label: "Buy a Vehicle", icon: "🚗" },
  { value: "education", label: "Education", icon: "🎓" },
  { value: "marriage", label: "Marriage", icon: "💍" },
  { value: "travel", label: "Travel", icon: "✈️" },
  { value: "retirement", label: "Retirement", icon: "🌴" },
  { value: "start_business", label: "Start a Business", icon: "🚀" },
  { value: "wealth_creation", label: "Wealth Creation", icon: "💰" },
];

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { completeOnboarding } = useUserProfile();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    monthly_income: "",
    occupation: "",
    risk_profile: "" as 'conservative' | 'moderate' | 'aggressive' | '',
    financial_goals: [] as string[],
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await completeOnboarding({
        monthly_income: parseFloat(formData.monthly_income) || 0,
        occupation: formData.occupation,
        risk_profile: formData.risk_profile as 'conservative' | 'moderate' | 'aggressive',
        financial_goals: formData.financial_goals,
      });

      if (!error) {
        onComplete();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      financial_goals: prev.financial_goals.includes(goal)
        ? prev.financial_goals.filter(g => g !== goal)
        : [...prev.financial_goals, goal],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.monthly_income !== "";
      case 2: return formData.occupation !== "";
      case 3: return formData.risk_profile !== "";
      case 4: return formData.financial_goals.length > 0;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Welcome to FINNAVA</span>
          </div>
          <h1 className="text-2xl font-bold font-display">Let's personalize your experience</h1>
          <p className="text-muted-foreground mt-2">Help us understand you better</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Step {step} of {totalSteps}</span>
            <span className="text-primary font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          {/* Step 1: Income */}
          {step === 1 && (
            <>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>What's your monthly income?</CardTitle>
                <CardDescription>This helps us give you personalized advice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="income">Monthly Income (₹)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="e.g., 50000"
                    value={formData.monthly_income}
                    onChange={(e) => setFormData({ ...formData, monthly_income: e.target.value })}
                    className="text-lg h-12"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Your data is secure and never shared with third parties
                </p>
              </CardContent>
            </>
          )}

          {/* Step 2: Occupation */}
          {step === 2 && (
            <>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>What do you do?</CardTitle>
                <CardDescription>Your occupation helps us tailor financial advice</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.occupation}
                  onValueChange={(value) => setFormData({ ...formData, occupation: value })}
                  className="grid grid-cols-2 gap-3"
                >
                  {occupations.map((occ) => (
                    <Label
                      key={occ.value}
                      htmlFor={occ.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.occupation === occ.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value={occ.value} id={occ.value} className="sr-only" />
                      <span className="text-2xl">{occ.icon}</span>
                      <span className="font-medium text-sm">{occ.label}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </>
          )}

          {/* Step 3: Risk Profile */}
          {step === 3 && (
            <>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Your risk appetite</CardTitle>
                <CardDescription>How comfortable are you with investment risk?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.risk_profile}
                  onValueChange={(value) => setFormData({ ...formData, risk_profile: value as any })}
                  className="space-y-3"
                >
                  {riskProfiles.map((risk) => (
                    <Label
                      key={risk.value}
                      htmlFor={risk.value}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.risk_profile === risk.value
                          ? `border-primary ${risk.color}`
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value={risk.value} id={risk.value} className="sr-only" />
                      <span className="text-3xl">{risk.icon}</span>
                      <div>
                        <span className="font-semibold">{risk.label}</span>
                        <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </>
          )}

          {/* Step 4: Financial Goals */}
          {step === 4 && (
            <>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>What are your financial goals?</CardTitle>
                <CardDescription>Select all that apply</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {financialGoals.map((goal) => (
                    <Label
                      key={goal.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.financial_goals.includes(goal.value)
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Checkbox
                        checked={formData.financial_goals.includes(goal.value)}
                        onCheckedChange={() => toggleGoal(goal.value)}
                        className="sr-only"
                      />
                      <span className="text-xl">{goal.icon}</span>
                      <span className="text-sm font-medium">{goal.label}</span>
                    </Label>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation */}
          <div className="p-6 pt-0 flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            {step < totalSteps ? (
              <Button onClick={handleNext} disabled={!canProceed()} className="flex-1">
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Get Started
                    <Sparkles className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        {/* Skip option */}
        <div className="text-center mt-4">
          <Button variant="ghost" onClick={onComplete} className="text-muted-foreground">
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  );
}
