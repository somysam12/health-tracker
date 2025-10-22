import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Apple, Heart, Filter, Leaf } from "lucide-react";
import type { Food } from "@shared/schema";

export default function Foods() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: foods, isLoading } = useQuery<Food[]>({
    queryKey: ["/api/foods"],
  });

  const filteredFoods = foods?.filter(
    (food) => selectedCategory === "all" || food.category === selectedCategory
  );

  const categories = [
    { value: "all", label: "All Foods" },
    { value: "fruits", label: "Fruits" },
    { value: "vegetables", label: "Vegetables" },
    { value: "proteins", label: "Proteins" },
    { value: "grains", label: "Grains" },
    { value: "dairy", label: "Dairy" },
    { value: "nuts", label: "Nuts & Seeds" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2" data-testid="text-foods-title">
          Healthy Foods Guide
        </h1>
        <p className="text-muted-foreground">
          Discover heart-healthy foods and their nutritional benefits
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
                data-testid={`filter-food-${cat.value}`}
                className="capitalize"
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Food Cards Grid */}
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
      ) : filteredFoods && filteredFoods.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFoods.map((food) => (
            <Card key={food.id} className="hover-elevate" data-testid={`card-food-${food.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{food.name}</CardTitle>
                  <Apple className="h-5 w-5 text-chart-2 flex-shrink-0" />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="capitalize text-xs">
                    {food.category}
                  </Badge>
                  {food.heartHealthy && (
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                      <Heart className="h-3 w-3 mr-1" />
                      Heart Healthy
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{food.description}</p>

                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-chart-2" />
                    Nutrition Facts
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Calories:</span>
                      <span className="font-medium">{food.calories} kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Protein:</span>
                      <span className="font-medium">{food.nutrients.protein}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fiber:</span>
                      <span className="font-medium">{food.nutrients.fiber}</span>
                    </div>
                  </div>
                  {food.nutrients.vitamins.length > 0 && (
                    <div className="pt-2 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">Rich in: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {food.nutrients.vitamins.map((vitamin, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {vitamin}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Health Benefits:</h4>
                  <ul className="space-y-1">
                    {food.benefits.map((benefit, idx) => (
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
            <p className="text-muted-foreground">No foods found in this category</p>
          </CardContent>
        </Card>
      )}

      {/* Nutrition Tips */}
      <Card className="bg-gradient-to-br from-chart-2/5 to-chart-1/5 border-chart-2/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Heart-Healthy Eating Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-2 mt-2" />
            <p className="text-sm">
              <strong>Eat colorful:</strong> Include a variety of colorful fruits and vegetables in your diet daily
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-2 mt-2" />
            <p className="text-sm">
              <strong>Choose whole grains:</strong> Replace refined grains with whole grains like brown rice and quinoa
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-2 mt-2" />
            <p className="text-sm">
              <strong>Healthy fats:</strong> Include sources of omega-3 fatty acids like fish, nuts, and avocados
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-2 mt-2" />
            <p className="text-sm">
              <strong>Limit sodium:</strong> Reduce salt intake and choose fresh foods over processed ones
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-chart-2 mt-2" />
            <p className="text-sm">
              <strong>Portion control:</strong> Practice mindful eating and pay attention to serving sizes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
