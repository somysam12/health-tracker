import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Droplet, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { HealthMetrics } from "@shared/schema";

export default function BloodPressure() {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const { toast } = useToast();

  const { data: healthMetrics, isLoading } = useQuery<HealthMetrics>({
    queryKey: ["/api/health-metrics/today"],
  });

  const updateBPMutation = useMutation({
    mutationFn: async (data: { systolic: number; diastolic: number }) => {
      return apiRequest("POST", "/api/health-metrics/blood-pressure", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health-metrics/today"] });
      toast({
        title: "Blood pressure recorded!",
        description: "Your reading has been saved.",
      });
      setSystolic("");
      setDiastolic("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    
    if (isNaN(sys) || isNaN(dia) || sys < 70 || sys > 200 || dia < 40 || dia > 130) {
      toast({
        title: "Invalid input",
        description: "Please enter valid blood pressure values.",
        variant: "destructive",
      });
      return;
    }

    if (dia >= sys) {
      toast({
        title: "Invalid reading",
        description: "Systolic pressure must be higher than diastolic.",
        variant: "destructive",
      });
      return;
    }

    updateBPMutation.mutate({ systolic: sys, diastolic: dia });
  };

  const getBPCategory = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80) {
      return { label: "Normal", color: "success", description: "Healthy blood pressure" };
    }
    if (sys >= 120 && sys <= 129 && dia < 80) {
      return { label: "Elevated", color: "info", description: "Watch your numbers" };
    }
    if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
      return { label: "High Stage 1", color: "warning", description: "Lifestyle changes needed" };
    }
    if (sys >= 140 || dia >= 90) {
      return { label: "High Stage 2", color: "destructive", description: "Consult a doctor" };
    }
    return { label: "Unknown", color: "secondary", description: "Invalid reading" };
  };

  const currentSys = healthMetrics?.systolicBP;
  const currentDia = healthMetrics?.diastolicBP;
  const category = currentSys && currentDia ? getBPCategory(currentSys, currentDia) : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-blood-pressure-title">
          Blood Pressure Monitor
        </h1>
        <p className="text-muted-foreground">
          Track and understand your blood pressure readings for heart health
        </p>
      </div>

      {/* Current Reading Display */}
      <Card className="border-l-4 border-l-chart-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-chart-1" />
            Latest Reading
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-24 w-40 animate-pulse bg-muted rounded" />
          ) : currentSys && currentDia ? (
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold font-mono" data-testid="text-systolic">
                  {currentSys}
                </span>
                <span className="text-3xl font-bold text-muted-foreground">/</span>
                <span className="text-5xl font-bold font-mono" data-testid="text-diastolic">
                  {currentDia}
                </span>
                <span className="text-xl text-muted-foreground ml-2">mmHg</span>
              </div>
              {category && (
                <div className="space-y-2">
                  <Badge 
                    variant={category.color === "success" ? "default" : "secondary"}
                    className="text-sm"
                    data-testid="badge-bp-category"
                  >
                    {category.label}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-muted-foreground">No blood pressure data recorded yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Record Blood Pressure Form */}
      <Card>
        <CardHeader>
          <CardTitle>Record Blood Pressure</CardTitle>
          <CardDescription>
            Enter your systolic and diastolic readings in mmHg
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="systolic">Systolic (top number)</Label>
                <Input
                  id="systolic"
                  type="number"
                  placeholder="e.g., 120"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  data-testid="input-systolic"
                  min="70"
                  max="200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diastolic">Diastolic (bottom number)</Label>
                <Input
                  id="diastolic"
                  type="number"
                  placeholder="e.g., 80"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  data-testid="input-diastolic"
                  min="40"
                  max="130"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={updateBPMutation.isPending}
              data-testid="button-record-bp"
            >
              {updateBPMutation.isPending ? "Recording..." : "Record Reading"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Blood Pressure Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Understanding Blood Pressure Ranges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">Category</th>
                  <th className="text-left py-3 px-2 font-medium">Systolic (mmHg)</th>
                  <th className="text-left py-3 px-2 font-medium">Diastolic (mmHg)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover-elevate">
                  <td className="py-3 px-2">
                    <Badge variant="default">Normal</Badge>
                  </td>
                  <td className="py-3 px-2 font-mono">&lt; 120</td>
                  <td className="py-3 px-2 font-mono">&lt; 80</td>
                </tr>
                <tr className="border-b hover-elevate">
                  <td className="py-3 px-2">
                    <Badge variant="secondary">Elevated</Badge>
                  </td>
                  <td className="py-3 px-2 font-mono">120-129</td>
                  <td className="py-3 px-2 font-mono">&lt; 80</td>
                </tr>
                <tr className="border-b hover-elevate">
                  <td className="py-3 px-2">
                    <Badge variant="secondary">High Stage 1</Badge>
                  </td>
                  <td className="py-3 px-2 font-mono">130-139</td>
                  <td className="py-3 px-2 font-mono">80-89</td>
                </tr>
                <tr className="border-b hover-elevate">
                  <td className="py-3 px-2">
                    <Badge variant="secondary">High Stage 2</Badge>
                  </td>
                  <td className="py-3 px-2 font-mono">≥ 140</td>
                  <td className="py-3 px-2 font-mono">≥ 90</td>
                </tr>
                <tr className="hover-elevate">
                  <td className="py-3 px-2">
                    <Badge variant="destructive">Crisis</Badge>
                  </td>
                  <td className="py-3 px-2 font-mono">&gt; 180</td>
                  <td className="py-3 px-2 font-mono">&gt; 120</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tips for Managing Blood Pressure */}
      <Card className="bg-gradient-to-br from-chart-1/5 to-chart-2/5 border-chart-1/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Tips for Healthy Blood Pressure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-1 mt-2" />
            <p className="text-sm">
              <strong>Reduce sodium:</strong> Limit salt intake to less than 2,300mg per day (about 1 teaspoon)
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-1 mt-2" />
            <p className="text-sm">
              <strong>Stay active:</strong> Regular physical activity can lower blood pressure by 5-8 mmHg
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-1 mt-2" />
            <p className="text-sm">
              <strong>Maintain healthy weight:</strong> Losing even 5-10 pounds can help lower blood pressure
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-1 mt-2" />
            <p className="text-sm">
              <strong>Limit alcohol:</strong> Drink in moderation - no more than 1-2 drinks per day
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-1 mt-2" />
            <p className="text-sm">
              <strong>Monitor regularly:</strong> Check your blood pressure at the same time each day for consistency
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
