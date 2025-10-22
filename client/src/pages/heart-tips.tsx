import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, AlertCircle, Info, CheckCircle, Filter } from "lucide-react";
import type { HeartPatientTip } from "@shared/schema";

export default function HeartTips() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: tips, isLoading } = useQuery<HeartPatientTip[]>({
    queryKey: ["/api/heart-tips"],
  });

  const filteredTips = tips?.filter(
    (tip) => selectedCategory === "all" || tip.category === selectedCategory
  );

  const categories = [
    { value: "all", label: "All Tips" },
    { value: "walking", label: "Walking" },
    { value: "exercise", label: "Exercise" },
    { value: "diet", label: "Diet" },
    { value: "monitoring", label: "Monitoring" },
    { value: "lifestyle", label: "Lifestyle" },
  ];

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "important":
        return <Info className="h-5 w-5 text-warning" />;
      case "helpful":
        return <CheckCircle className="h-5 w-5 text-success" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "critical":
        return "border-l-destructive bg-destructive/5";
      case "important":
        return "border-l-warning bg-warning/5";
      case "helpful":
        return "border-l-success bg-success/5";
      default:
        return "border-l-muted";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3" data-testid="text-heart-tips-title">
          <Heart className="h-8 w-8 text-destructive" />
          Heart Disease Patient Tips
        </h1>
        <p className="text-muted-foreground">
          Essential guidance for managing heart health and safe exercise practices
        </p>
      </div>

      {/* Important Notice */}
      <Card className="border-l-4 border-l-destructive bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Important Medical Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground">
            If you have been diagnosed with heart disease or have risk factors, always consult with your healthcare provider before starting any new exercise program. The information provided here is for educational purposes and should not replace professional medical advice.
          </p>
        </CardContent>
      </Card>

      {/* Filter Chips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filter by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
                data-testid={`filter-tip-${cat.value}`}
                className="capitalize"
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-48 animate-pulse bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full animate-pulse bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTips && filteredTips.length > 0 ? (
        <div className="space-y-4">
          {filteredTips.map((tip) => (
            <Card
              key={tip.id}
              className={`border-l-4 ${getImportanceColor(tip.importance)} hover-elevate`}
              data-testid={`card-tip-${tip.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2 mb-2">
                      {getImportanceIcon(tip.importance)}
                      {tip.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="capitalize text-xs">
                        {tip.category}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className="capitalize text-xs"
                      >
                        {tip.importance}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{tip.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No tips found in this category</p>
          </CardContent>
        </Card>
      )}

      {/* General Walking Guidelines for Heart Patients */}
      <Card className="bg-gradient-to-br from-chart-1/5 to-destructive/5 border-chart-1/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Safe Walking Guidelines for Heart Patients
          </CardTitle>
          <CardDescription>
            Follow these guidelines to ensure safe and beneficial walking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-chart-1 mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Start Slow and Progress Gradually</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Begin with 5-10 minutes of slow walking and gradually increase duration by 1-2 minutes each week
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-chart-1 mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Monitor Your Heart Rate</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Stay within your target heart rate zone (usually 50-70% of maximum for heart patients). Consult your doctor for your specific range.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-chart-1 mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Watch for Warning Signs</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Stop immediately if you experience chest pain, severe shortness of breath, dizziness, or irregular heartbeat
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-chart-1 mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Choose Safe Environments</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Walk on flat, even surfaces. Avoid extreme weather conditions (very hot, cold, or humid)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-chart-1 mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Bring a Companion</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Especially in the beginning, walk with someone who can help in case of emergency
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-chart-1 mt-2 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Timing Matters</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Avoid walking immediately after meals. Wait at least 1-2 hours after eating
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact Reminder */}
      <Card className="border-2 border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Emergency Symptoms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3">
            Seek immediate medical attention if you experience any of these symptoms during or after exercise:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-destructive">•</span>
              <span>Chest pain, pressure, or tightness</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive">•</span>
              <span>Pain radiating to arm, jaw, or back</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive">•</span>
              <span>Severe shortness of breath</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive">•</span>
              <span>Irregular or rapid heartbeat</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive">•</span>
              <span>Dizziness or fainting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-destructive">•</span>
              <span>Excessive fatigue that doesn't improve with rest</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
