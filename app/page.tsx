"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, Clock, Plus, Search, Utensils } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Recipe {
  id: string;
  title: string;
  description: string;
  cooking_time: number;
  difficulty: string;
  image_url: string;
}

export default function Home() {
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchFeaturedRecipes() {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .limit(6);
      
      if (data) {
        setFeaturedRecipes(data);
      }
    }

    fetchFeaturedRecipes();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!searchQuery.trim()) return;

  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("id")
    .ilike("title", `%${searchQuery}%`);

  if (recipes && recipes.length > 0) {
    router.push(`/recipes?search=${encodeURIComponent(searchQuery)}`);
  } else {
    alert("No recipes found matching your search.");
  }
};

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3')",
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Discover & Share Amazing Recipes
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Join our community of food lovers and find your next favorite dish
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search recipes..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg">
              Find Recipes
            </Button>
          </form>

          <div className="mt-8">
            <Link href="/new">
              <Button variant="secondary" size="lg" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Your Recipe
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Cook With Us?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <ChefHat className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Expert Recipes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Curated recipes from professional chefs and experienced home cooks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Utensils className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Step-by-Step Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Detailed instructions and tips to help you cook with confidence
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Time-Saving</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Quick and easy recipes for busy weekdays
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Recipes</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe) => (
              <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img 
                      src={recipe.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                      alt={recipe.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{recipe.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2">{recipe.description}</p>
                    <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.cooking_time} mins</span>
                      <span className="mx-2">•</span>
                      <span className="capitalize">{recipe.difficulty}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}