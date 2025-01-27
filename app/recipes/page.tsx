"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Clock, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Recipe {
  id: string;
  title: string;
  description: string;
  cooking_time: number;
  difficulty: string;
  image_url: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [caloriesRange, setCaloriesRange] = useState([0, 5000]);
  const [proteinRange, setProteinRange] = useState([0, 500]);
  const [urlSearchUsed, setUrlSearchUsed] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  const supabase = createClient();
  const searchParams = useSearchParams();

  // Fetch recipes based on filters
  const fetchRecipes = async () => {
    let query = supabase.from("recipes").select("*");

    if (searchQuery) {
      query = query.ilike("title", `%${searchQuery}%`);
    }

    if (difficulty) {
      query = query.eq("difficulty", difficulty);
    }

    if (caloriesRange[1] < 5000 || caloriesRange[0] > 0) {
      query = query
        .gte("calories", caloriesRange[0])
        .lte("calories", caloriesRange[1]);
    }

    if (proteinRange[1] < 500 || proteinRange[0] > 0) {
      query = query
        .gte("protein", proteinRange[0])
        .lte("protein", proteinRange[1]);
    }

    const { data, error } = await query;

    if (data) {
      setRecipes(data);
    }
  };

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch && !urlSearchUsed) {
      setUrlSearchUsed(true);
      setSearchQuery(urlSearch);
      setLoading(false); // Set loading to false after updating the search query
    }
  }, [searchParams, urlSearchUsed]);

  useEffect(() => {
    if (!loading) {
      console.log("Updated searchQuery:", searchQuery);
      fetchRecipes();
    }
  }, [searchQuery, difficulty, caloriesRange, proteinRange, loading]);

  return (
    <main className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search recipes..."
                      defaultValue={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select
                    value={difficulty || "all"}
                    onValueChange={(value) =>
                      setDifficulty(value === "all" ? "" : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any difficulty</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Calories Range</Label>
                  <Slider
                    defaultValue={[0, 5000]}
                    min={0}
                    max={5000}
                    step={5}
                    value={[caloriesRange[0], caloriesRange[1]]}
                    onValueChange={(value) => {
                      setCaloriesRange([value[0], value[1]]);
                      console.log(caloriesRange);
                    }}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{caloriesRange[0]} cal</span>
                    <span>{caloriesRange[1]} cal</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Protein Range</Label>
                  <Slider
                    defaultValue={[0, 500]}
                    min={0}
                    max={500}
                    step={5}
                    value={[proteinRange[0], proteinRange[1]]}
                    onValueChange={(value) => {
                      setProteinRange([value[0], value[1]]);
                    }}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{proteinRange[0]}g</span>
                    <span>{proteinRange[1]}g</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Recipe Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[35%] gap-6">
              {recipes.map((recipe) => (
                <Link href={`/${recipe.id}`} key={recipe.id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="aspect-video relative">
                      <img
                        src={
                          recipe.image_url ||
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                        }
                        alt={recipe.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">
                        {recipe.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2 mb-4">
                        {recipe.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{recipe.cooking_time} mins</span>
                        </div>
                        <span className="capitalize">{recipe.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-7">
                        <span className="capitalize">Calories: {recipe.calories}</span>
                        <span>Protein: {recipe.protein} g</span>
                        <span>Carbs: {recipe.carbs} g</span>
                        <span>Fat: {recipe.fat} g</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {recipes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No recipes found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
