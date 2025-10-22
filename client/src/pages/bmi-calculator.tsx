import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { UserProfile, BMIResult } from "@shared/schema";

export default function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const { toast } = useToast();

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
    retry: false,
  });

  const { data: bmiResult } = useQuery<BMIResult>({
    queryKey: ["/api/bmi"],
    retry: false,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { height: number; weight: number }) => {
      return apiRequest("POST", "/api/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bmi"] });
      queryClient.invalidateQueries({ queryKey: ["/api/walking-recommendation"] });
      toast({
        title: "Profile updated!",
        description: "Your BMI has been calculated.",
      });
      setHeight("");
      setWeight("");
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    
    if (isNaN(heightNum) || heightNum <= 0 || isNaN(weightNum) || weightNum <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter valid height and weight values.",
        variant: "destructive",
      });
      return;
    }

    updateProfileMutation.mutate({ height: heightNum, weight: weightNum });
  };

  const getBMIColor = (category: string) => {
    switch (category) {
      case "underweight": return "text-info";
      case "normal": return "text-success";
      case "overweight": return "text-warning";
      case "obese": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getBMIPosition = (bmi: number) => {
    if (bmi < 18.5) return (bmi / 18.5) * 25;
    if (bmi < 25) return 25 + ((bmi - 18.5) / (25 - 18.5)) * 25;
    if (bmi < 30) return 50 + ((bmi - 25) / (30 - 25)) * 25;
    return Math.min(75 + ((bmi - 30) / 10) * 25, 100);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-bmi-title">
          BMI Calculator
        </h1>
        <p className="text-muted-foreground">
          Calculate your Body Mass Index and get personalized health recommendations
        </p>
      </div>

      {/* BMI Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Enter Your Measurements
          </CardTitle>
          <CardDescription>
            Please provide your height in centimeters and weight in kilograms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="e.g., 170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  data-testid="input-height"
                  step="0.1"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  data-testid="input-weight"
                  step="0.1"
                  min="0"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              data-testid="button-calculate-bmi"
            >
              {updateProfileMutation.isPending ? "Calculating..." : "Calculate BMI"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* BMI Result Display */}
      {bmiResult && (
        <>
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle>Your BMI Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-6xl font-bold font-mono ${getBMIColor(bmiResult.category)}`} data-testid="text-bmi-result">
                  {bmiResult.bmi.toFixed(1)}
                </div>
                <Badge className="mt-4 text-base px-4 py-1 capitalize" data-testid="badge-bmi-category">
                  {bmiResult.category}
                </Badge>
              </div>

              {/* BMI Scale Visualization */}
              <div className="space-y-2">
                <div className="h-8 rounded-lg overflow-hidden flex">
                  <div className="bg-info flex-1 flex items-center justify-center text-xs font-medium text-white">
                    Underweight
                  </div>
                  <div className="bg-success flex-1 flex items-center justify-center text-xs font-medium text-white">
                    Normal
                  </div>
                  <div className="bg-warning flex-1 flex items-center justify-center text-xs font-medium text-white">
                    Overweight
                  </div>
                  <div className="bg-destructive flex-1 flex items-center justify-center text-xs font-medium text-white">
                    Obese
                  </div>
                </div>
                <div className="relative">
                  <div 
                    className="absolute top-0 h-2 w-2 bg-foreground rounded-full transform -translate-x-1/2"
                    style={{ left: `${getBMIPosition(bmiResult.bmi)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>&lt;18.5</span>
                  <span>18.5-24.9</span>
                  <span>25-29.9</span>
                  <span>≥30</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendation Card */}
          <Card className="bg-gradient-to-br from-chart-2/5 to-chart-1/5 border-chart-2/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Personalized Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground" data-testid="text-bmi-recommendation">
                {bmiResult.recommendation}
              </p>
            </CardContent>
          </Card>
        </>
      )}

      {/* BMI Categories Info */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding BMI Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-info/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-4 w-4 text-info" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Underweight (BMI &lt; 18.5)</h4>
              <p className="text-sm text-muted-foreground">
                You may need to gain weight. Consult with a healthcare provider for a proper nutrition plan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-4 w-4 text-success" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Normal (BMI 18.5-24.9)</h4>
              <p className="text-sm text-muted-foreground">
                You're at a healthy weight. Maintain it through balanced diet and regular exercise.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-4 w-4 text-warning" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Overweight (BMI 25-29.9)</h4>
              <p className="text-sm text-muted-foreground">
                Focus on portion control and increase physical activity. Aim for 150-300 minutes of moderate exercise weekly.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Obese (BMI ≥ 30)</h4>
              <p className="text-sm text-muted-foreground">
                Consult with healthcare professionals for a comprehensive weight management plan including diet, exercise, and possibly medical intervention.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
