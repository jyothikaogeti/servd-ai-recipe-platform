"use client";

import { useEffect } from "react";
import { Bookmark, ChefHat, Loader2 } from "lucide-react";
import Link from "next/link";

import { useFetch } from "@/hooks/useFetch";
import { getSavedRecipes } from "@/actions/recipe.actions";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/RecipeCard";

export default function SavedRecipesPage() {
  const {
    isLoading,
    data: recipesData,
    execute: fetchSavedRecipes,
  } = useFetch(getSavedRecipes);

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const recipes = recipesData?.data || [];

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center gap-1 mb-8">
          <Bookmark className="w-25 h-25 text-orange-600" />
          <div>
            <h1 className="text-4xl md:text-6xl text-stone-900 font-bold tracking-tight leading-tight">
              My Saved Recipes
            </h1>

            <p className="text-stone-600">
              Your Personal Collection of Favorite Recipes
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-6" />
            <p className="text-stone-600">Loading your Saved Recipes...</p>
          </div>
        )}

        {/* Recipes Grid  */}
        {!isLoading && recipes.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.documentId}
                recipe={recipe}
                variant="list"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && recipes.length === 0 && (
          <div className="bg-white text-center border-2 border-dashed border-stone-200 rounded-3xl p-12">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex justify-center items-center mx-auto mb-6">
              <Bookmark className="w-10 h-10 text-orange-600" />
            </div>

            <h3 className="text-2xl text-stone-900 font-bold mb-2">
              No Saved Recipes Yet
            </h3>

            <p className="text-stone-600 max-w-md mx-auto mb-8">
              Start exploring recipes and save your favorites to build your
              personal cookbook!
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/dashboard">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                  <ChefHat className="w-4 h-4" />
                  Explore Recipes
                </Button>
              </Link>

              <Link href="/pantry">
                <Button variant="outline" className="border-stone-300 gap-2">
                  Check Your Pantry
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
