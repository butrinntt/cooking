"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { ChefHat, Home, Plus, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <ChefHat className="w-6 h-6" />
          <span>CookBook</span>
        </Link>
        
        <nav className="flex items-center gap-6 ml-6">
          <Link 
            href="/"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link 
            href="/recipes"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              pathname === "/recipes" ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Search className="w-4 h-4" />
            Browse Recipes
          </Link>
        </nav>
        
        <div className="ml-auto">
          <Link href="/new">
            <Button variant="default" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Recipe
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}