import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Heart, Clock, Zap, Filter } from "lucide-react";
import type { Exercise } from "@shared/schema";

export default function Exercises() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: exercises, isLoading } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  const filteredExercises = exercises?.filter(
    (ex) => selectedCategory === "all" || ex.category === selectedCategory
  );

  const categories = [
    { value: "all", label: "All Exercises" },
    { value: "cardio", label: "Cardio" },
    { value: "strength", label: "Strength" },
    { value: "flexibility", label: "Flexibility" },
    { value: "balance", label: "Balance" },
  ];

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "low": return "bg-success text-success-foreground";
      case "moderate": return "bg-warning text-warning-foreground";
      case "high": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const renderHeartRating = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Heart
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-destructive text-destructive" : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-exercises-title">
          Exercise Recommendations
        </h1>
        <p className="text-muted-foreground">
          Discover exercises that promote heart health and overall wellness
        </p>
      </div>

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
                data-testid={`filter-${cat.value}`}
                className="capitalize"
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exercise Cards Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-32 animate-pulse bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 w-full animate-pulse bg-muted rounded" />
                  <div className="h-4 w-3/4 animate-pulse bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredExercises && filteredExercises.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="hover-elevate" data-testid={`card-exercise-${exercise.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{exercise.name}</CardTitle>
                  <Dumbbell className="h-5 w-5 text-chart-3 flex-shrink-0" />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="capitalize text-xs">
                    {exercise.category}
                  </Badge>
                  <Badge className={`${getIntensityColor(exercise.intensity)} text-xs capitalize`}>
                    {exercise.intensity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{exercise.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{exercise.duration}</span>
                  </div>
                  {exercise.caloriesBurned && (
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-chart-3" />
                      <span>{exercise.caloriesBurned} calories</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Heart Health:</span>
                    {renderHeartRating(exercise.heartHealthRating)}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Benefits:</h4>
                  <ul className="space-y-1">
                    {exercise.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-chart-2 mt-1">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No exercises found in this category</p>
          </CardContent>
        </Card>
      )}

      {/* Exercise Safety Tips */}
      <Card className="bg-gradient-to-br from-chart-3/5 to-chart-1/5 border-chart-3/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Exercise Safety for Heart Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-3 mt-2" />
            <p className="text-sm">
              <strong>Start slow:</strong> Begin with low-intensity exercises and gradually increase intensity
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-3 mt-2" />
            <p className="text-sm">
              <strong>Warm up & cool down:</strong> Always spend 5-10 minutes warming up and cooling down
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-3 mt-2" />
            <p className="text-sm">
              <strong>Listen to your body:</strong> Stop if you feel chest pain, dizziness, or excessive shortness of breath
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-3 mt-2" />
            <p className="text-sm">
              <strong>Stay hydrated:</strong> Drink water before, during, and after exercise
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-3 mt-2" />
            <p className="text-sm">
              <strong>Consult your doctor:</strong> Especially important if you have existing heart conditions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
