"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus } from "lucide-react";

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function NewRecipe() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [servings, setServings] = useState("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: "", unit: "" },
  ]);
  const [macros, setMacros] = useState<Macros>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", unit: "" }]);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, [field]: value };
      }
      return ingredient;
    });
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: recipe, error: recipeError } = await supabase
      .from("recipes")
      .insert([
        {
          title,
          description,
          instructions,
          cooking_time: parseInt(cookingTime),
          servings: parseInt(servings),
          difficulty,
          image_url: imageUrl,
          calories: macros.calories,
          protein: macros.protein,
          carbs: macros.carbs,
          fat: macros.fat,
        },
      ])
      .select()
      .single();

    if (recipeError || !recipe) {
      toast({
        title: "Error",
        description: "Failed to create recipe",
        variant: "destructive",
      });
      return;
    }

    const { error: ingredientsError } = await supabase.from("ingredients").insert(
      ingredients.map((ingredient) => ({
        recipe_id: recipe.id,
        name: ingredient.name,
        amount: parseFloat(ingredient.amount),
        unit: ingredient.unit,
      }))
    );

    if (ingredientsError) {
      toast({
        title: "Error",
        description: "Failed to add ingredients",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Recipe created successfully",
    });

    router.push(`/${recipe.id}`);
  };

  return (
    <main className="min-h-screen py-12 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Create New Recipe</h1>
        
        <form onSubmit={handleSubmit}>
          <Card className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Basic Information</h2>
              
              <div className="space-y-2">
                <Label htmlFor="title">Recipe Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter recipe title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your recipe"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cookingTime">Cooking Time (minutes)</Label>
                  <Input
                    id="cookingTime"
                    type="number"
                    value={cookingTime}
                    onChange={(e) => setCookingTime(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servings">Servings</Label>
                  <Input
                    id="servings"
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Ingredients</h2>
              
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1 space-y-2">
                    <Label>Ingredient Name</Label>
                    <Input
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(index, "name", e.target.value)}
                      placeholder="e.g., Flour"
                      required
                    />
                  </div>
                  <div className="w-24 space-y-2">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(index, "amount", e.target.value)}
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="w-24 space-y-2">
                    <Label>Unit</Label>
                    <Input
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                      placeholder="g, ml, pcs"
                      required
                    />
                  </div>
                  {ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="mt-8"
                      onClick={() => removeIngredient(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addIngredient}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Ingredient
              </Button>
            </div>

            {/* Macros */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Nutritional Information (per serving)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={macros.calories}
                    onChange={(e) => setMacros({ ...macros, calories: parseFloat(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={macros.protein}
                    onChange={(e) => setMacros({ ...macros, protein: parseFloat(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={macros.carbs}
                    onChange={(e) => setMacros({ ...macros, carbs: parseFloat(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    value={macros.fat}
                    onChange={(e) => setMacros({ ...macros, fat: parseFloat(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Instructions</h2>
              
              <div className="space-y-2">
                <Label htmlFor="instructions">Step-by-Step Instructions</Label>
                <Textarea
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Enter detailed cooking instructions..."
                  className="min-h-[200px]"
                  required
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Create Recipe
            </Button>
          </Card>
        </form>
      </div>
    </main>
  );
}