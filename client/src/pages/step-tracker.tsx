import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Footprints, TrendingUp, MapPin, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { HealthMetrics } from "@shared/schema";

export default function StepTracker() {
  const [steps, setSteps] = useState("");
  const { toast } = useToast();

  const { data: healthMetrics, isLoading } = useQuery<HealthMetrics>({
    queryKey: ["/api/health-metrics/today"],
  });

  const updateStepsMutation = useMutation({
    mutationFn: async (newSteps: number) => {
      return apiRequest("POST", "/api/health-metrics/steps", { steps: newSteps });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health-metrics/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/walking-recommendation"] });
      toast({
        title: "Steps updated!",
        description: "Your step count has been recorded.",
      });
      setSteps("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stepsNum = parseInt(steps);
    if (isNaN(stepsNum) || stepsNum < 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number of steps.",
        variant: "destructive",
      });
      return;
    }
    updateStepsMutation.mutate(stepsNum);
  };

  const currentSteps = healthMetrics?.steps || 0;
  const dailyGoal = 10000;
  const progress = (currentSteps / dailyGoal) * 100;

  // Distance calculations
  const distanceKm = ((currentSteps * 0.76) / 1000).toFixed(2);
  const distanceM = (currentSteps * 0.76).toFixed(0);
  const caloriesBurned = (currentSteps * 0.04).toFixed(0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-step-tracker-title">
          Step Tracker
        </h1>
        <p className="text-muted-foreground">
          Track your daily steps and monitor your walking distance
        </p>
      </div>

      {/* Current Steps Display */}
      <Card className="border-l-4 border-l-chart-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Footprints className="h-5 w-5 text-chart-1" />
            Today's Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-20 w-48 animate-pulse bg-muted rounded" />
              <div className="h-4 w-full animate-pulse bg-muted rounded" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-5xl font-bold font-mono" data-testid="text-current-steps">
                {currentSteps.toLocaleString()}
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Daily Goal: {dailyGoal.toLocaleString()}</span>
                  <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} className="h-3" data-testid="progress-steps" />
              </div>
              {progress >= 100 && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                  <p className="text-success font-medium">
                    🎉 Congratulations! You've reached your daily goal!
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Distance & Calories Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distance (km)</CardTitle>
            <MapPin className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono" data-testid="text-distance-km-display">
              {distanceKm}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Kilometers</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distance (m)</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono" data-testid="text-distance-m-display">
              {distanceM}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Meters</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
            <Target className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono" data-testid="text-calories">
              {caloriesBurned}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Burned</p>
          </CardContent>
        </Card>
      </div>

      {/* Update Steps Form */}
      <Card>
        <CardHeader>
          <CardTitle>Update Step Count</CardTitle>
          <CardDescription>
            Enter your current step count to track your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="steps">Number of Steps</Label>
              <Input
                id="steps"
                type="number"
                placeholder="Enter steps (e.g., 5000)"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                data-testid="input-steps"
                min="0"
              />
            </div>
            <Button
              type="submit"
              disabled={updateStepsMutation.isPending}
              data-testid="button-update-steps"
            >
              {updateStepsMutation.isPending ? "Updating..." : "Update Steps"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Walking Benefits Info */}
      <Card className="bg-gradient-to-br from-chart-1/5 to-chart-2/5 border-chart-1/20">
        <CardHeader>
          <CardTitle>Walking Benefits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-2 mt-2" />
            <p className="text-sm">
              <strong>10,000 steps/day</strong> can reduce heart disease risk by up to 35%
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-2 mt-2" />
            <p className="text-sm">
              <strong>Walking regularly</strong> helps lower blood pressure and cholesterol
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-2 mt-2" />
            <p className="text-sm">
              <strong>Average stride</strong> is approximately 0.76 meters per step
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
