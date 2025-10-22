import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Heart, Activity, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { HealthMetrics, HeartRateReference } from "@shared/schema";

export default function HeartRate() {
  const [heartRate, setHeartRate] = useState("");
  const { toast } = useToast();

  const { data: healthMetrics, isLoading } = useQuery<HealthMetrics>({
    queryKey: ["/api/health-metrics/today"],
  });

  const { data: references } = useQuery<HeartRateReference[]>({
    queryKey: ["/api/heart-rate-references"],
  });

  const updateHeartRateMutation = useMutation({
    mutationFn: async (hr: number) => {
      return apiRequest("POST", "/api/health-metrics/heart-rate", { heartRate: hr });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health-metrics/today"] });
      toast({
        title: "Heart rate recorded!",
        description: "Your heart rate has been updated.",
      });
      setHeartRate("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hr = parseInt(heartRate);
    if (isNaN(hr) || hr < 30 || hr > 250) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid heart rate (30-250 bpm).",
        variant: "destructive",
      });
      return;
    }
    updateHeartRateMutation.mutate(hr);
  };

  const getHeartRateStatus = (hr: number) => {
    if (hr < 60) return { label: "Low", color: "info", description: "Below normal resting range" };
    if (hr >= 60 && hr <= 100) return { label: "Normal", color: "success", description: "Healthy resting range" };
    if (hr > 100 && hr <= 120) return { label: "Elevated", color: "warning", description: "Above normal resting range" };
    return { label: "High", color: "destructive", description: "Significantly elevated" };
  };

  const currentHR = healthMetrics?.heartRate;
  const status = currentHR ? getHeartRateStatus(currentHR) : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-heart-rate-title">
          Heart Rate Monitor
        </h1>
        <p className="text-muted-foreground">
          Track and monitor your heart rate for better cardiovascular health
        </p>
      </div>

      {/* Current Heart Rate Display */}
      <Card className="border-l-4 border-l-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-destructive animate-pulse" />
            Current Heart Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-24 w-32 animate-pulse bg-muted rounded" />
          ) : currentHR ? (
            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-bold font-mono text-destructive" data-testid="text-current-heart-rate">
                  {currentHR}
                </span>
                <span className="text-2xl text-muted-foreground">bpm</span>
              </div>
              {status && (
                <div className="space-y-2">
                  <Badge 
                    variant={status.color === "success" ? "default" : "secondary"}
                    className="text-sm"
                    data-testid="badge-heart-rate-status"
                  >
                    {status.label}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{status.description}</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-muted-foreground">No heart rate data recorded yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Record Heart Rate Form */}
      <Card>
        <CardHeader>
          <CardTitle>Record Heart Rate</CardTitle>
          <CardDescription>
            Measure your pulse and enter your beats per minute (bpm)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
              <Input
                id="heartRate"
                type="number"
                placeholder="Enter bpm (e.g., 72)"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                data-testid="input-heart-rate"
                min="30"
                max="250"
              />
              <p className="text-xs text-muted-foreground">
                Tip: Count your pulse for 15 seconds and multiply by 4
              </p>
            </div>
            <Button
              type="submit"
              disabled={updateHeartRateMutation.isPending}
              data-testid="button-record-heart-rate"
            >
              {updateHeartRateMutation.isPending ? "Recording..." : "Record Heart Rate"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Heart Rate Reference Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Normal Heart Rate by Age
          </CardTitle>
          <CardDescription>
            Reference ranges for resting and maximum heart rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {references ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">Age Group</th>
                    <th className="text-left py-3 px-2 font-medium">Resting (bpm)</th>
                    <th className="text-left py-3 px-2 font-medium">Max Rate (bpm)</th>
                    <th className="text-left py-3 px-2 font-medium">Moderate Exercise</th>
                  </tr>
                </thead>
                <tbody>
                  {references.map((ref, index) => (
                    <tr key={index} className="border-b hover-elevate" data-testid={`row-heart-rate-${index}`}>
                      <td className="py-3 px-2 font-medium">{ref.ageGroup}</td>
                      <td className="py-3 px-2 font-mono">{ref.restingMin}-{ref.restingMax}</td>
                      <td className="py-3 px-2 font-mono">{ref.maxHeartRate}</td>
                      <td className="py-3 px-2 font-mono">{ref.moderateMin}-{ref.moderateMax}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
                <p className="text-sm text-muted-foreground">Loading reference data...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Heart Health Tips */}
      <Card className="bg-gradient-to-br from-destructive/5 to-chart-1/5 border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Heart Health Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-destructive mt-2" />
            <p className="text-sm">
              <strong>Check regularly:</strong> Monitor your resting heart rate in the morning before getting out of bed
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-destructive mt-2" />
            <p className="text-sm">
              <strong>Stay active:</strong> Regular exercise strengthens your heart and can lower resting heart rate
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-destructive mt-2" />
            <p className="text-sm">
              <strong>Manage stress:</strong> High stress levels can elevate heart rate. Practice relaxation techniques
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-destructive mt-2" />
            <p className="text-sm">
              <strong>Consult a doctor:</strong> If your resting heart rate is consistently above 100 or below 60 bpm
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
