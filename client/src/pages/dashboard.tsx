import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Footprints,
  Heart,
  Activity,
  TrendingUp,
  Target,
  Calendar,
} from "lucide-react";
import { Link } from "wouter";
import type { HealthMetrics, UserProfile } from "@shared/schema";

export default function Dashboard() {
  const { data: healthMetrics, isLoading: metricsLoading } = useQuery<HealthMetrics>({
    queryKey: ["/api/health-metrics/today"],
  });

  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
    retry: false,
  });

  const { data: bmi } = useQuery<{ bmi: number; category: string }>({
    queryKey: ["/api/bmi"],
    retry: false,
  });

  const isLoading = metricsLoading || profileLoading;

  const dailyGoal = 10000;
  const stepsProgress = healthMetrics
    ? (healthMetrics.steps / dailyGoal) * 100
    : 0;

  const distanceKm = healthMetrics
    ? ((healthMetrics.steps * 0.76) / 1000).toFixed(2)
    : "0.00";
  const distanceM = healthMetrics
    ? (healthMetrics.steps * 0.76).toFixed(0)
    : "0";

  const getHeartRateStatus = (hr: number | undefined) => {
    if (!hr) return { label: "No data", color: "secondary" };
    if (hr < 60) return { label: "Low", color: "info" };
    if (hr >= 60 && hr <= 100) return { label: "Normal", color: "success" };
    return { label: "High", color: "warning" };
  };

  const hrStatus = getHeartRateStatus(healthMetrics?.heartRate);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-dashboard-title">
          Welcome to Your Health Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track your daily activity and monitor your health metrics
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Steps Card */}
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Steps Today</CardTitle>
            <Footprints className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-12 w-24 animate-pulse bg-muted rounded" />
            ) : (
              <>
                <div className="text-3xl font-bold font-mono" data-testid="text-steps-count">
                  {healthMetrics?.steps.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Goal: {dailyGoal.toLocaleString()}
                </p>
                <Progress value={stepsProgress} className="mt-3 h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {stepsProgress.toFixed(0)}% of daily goal
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Distance Card */}
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distance</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-12 w-24 animate-pulse bg-muted rounded" />
            ) : (
              <>
                <div className="text-3xl font-bold font-mono" data-testid="text-distance-km">
                  {distanceKm} <span className="text-lg">km</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {distanceM} meters
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Heart Rate Card */}
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-12 w-24 animate-pulse bg-muted rounded" />
            ) : (
              <>
                <div className="text-3xl font-bold font-mono" data-testid="text-heart-rate">
                  {healthMetrics?.heartRate || "--"}{" "}
                  <span className="text-lg">bpm</span>
                </div>
                <Badge
                  variant={hrStatus.color === "success" ? "default" : "secondary"}
                  className="mt-2"
                >
                  {hrStatus.label}
                </Badge>
              </>
            )}
          </CardContent>
        </Card>

        {/* BMI Card */}
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BMI</CardTitle>
            <Activity className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            {profileLoading ? (
              <div className="h-12 w-24 animate-pulse bg-muted rounded" />
            ) : bmi ? (
              <>
                <div className="text-3xl font-bold font-mono" data-testid="text-bmi-value">
                  {bmi.bmi.toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground mt-1 capitalize">
                  {bmi.category}
                </p>
              </>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground">Not calculated</p>
                <Link href="/bmi">
                  <Button variant="link" size="sm" className="px-0 mt-1">
                    Calculate BMI
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/steps">
              <Button className="w-full" variant="outline" data-testid="button-log-steps">
                <Footprints className="mr-2 h-4 w-4" />
                Log Steps
              </Button>
            </Link>
            <Link href="/heart-rate">
              <Button className="w-full" variant="outline" data-testid="button-check-heart-rate">
                <Heart className="mr-2 h-4 w-4" />
                Check Heart Rate
              </Button>
            </Link>
            <Link href="/bmi">
              <Button className="w-full" variant="outline" data-testid="button-calculate-bmi">
                <Activity className="mr-2 h-4 w-4" />
                Calculate BMI
              </Button>
            </Link>
            <Link href="/exercises">
              <Button className="w-full" variant="outline" data-testid="button-view-exercises">
                <Calendar className="mr-2 h-4 w-4" />
                View Exercises
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Health Tips Preview */}
      <Card className="border-l-4 border-l-chart-2">
        <CardHeader>
          <CardTitle className="text-lg">Today's Health Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Walking 10,000 steps a day can help reduce the risk of heart disease by up to 35%. Start with small goals and gradually increase your daily steps for better cardiovascular health.
          </p>
          <Link href="/heart-tips">
            <Button variant="link" className="px-0 mt-2" data-testid="link-more-tips">
              View more tips →
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
