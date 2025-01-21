"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ChefHat, Utensils } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  description: string;
  instructions: string;
  cooking_time: number;
  servings: number;
  difficulty: string;
  image_url: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
}

export default function RecipePage({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchRecipe() {
      const { data: recipeData } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", params.id)
        .single();
      console.log(recipeData);

      if (recipeData) {
        setRecipe(recipeData);
      }

      const { data: ingredientsData } = await supabase
        .from("ingredients")
        .select("*")
        .eq("recipe_id", params.id);

      if (ingredientsData) {
        setIngredients(ingredientsData);
      }
    }

    fetchRecipe();
  }, [params.id]);

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading recipe...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mb-6 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{recipe.title}</h1>
            <p className="text-lg text-muted-foreground">
              {recipe.description}
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-6 md:col-span-1">
              {/* Recipe Image */}
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={
                    recipe.image_url ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                  }
                  alt={recipe.title}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Recipe Info */}
              <div className="flex justify-between text-center">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{recipe.cooking_time} mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-primary" />
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-primary" />
                  <span className="capitalize">{recipe.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-2 space-y-8">
              {/* Ingredients */}
              <div className="flex flex-row justify-between space-x-4">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Ingredients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {ingredients.map((ingredient) => (
                        <li
                          key={ingredient.id}
                          className="flex justify-between"
                        >
                          <span>{ingredient.name}</span>
                          <span className="text-muted-foreground">
                            {ingredient.amount} {ingredient.unit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Nutritional Information */}
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Nutritional Information</CardTitle>
                    <p className="text-sm text-muted-foreground">Per serving</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Calories
                        </p>
                        <p className="text-2xl font-bold">{recipe.calories}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Protein</p>
                        <p className="text-2xl font-bold">{recipe.protein}g</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Carbs</p>
                        <p className="text-2xl font-bold">{recipe.carbs}g</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Fat</p>
                        <p className="text-2xl font-bold">{recipe.fat}g</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    {recipe.instructions.split("\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
