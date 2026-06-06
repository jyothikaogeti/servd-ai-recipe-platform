"use client";

import { useEffect } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ChefHat,
  Loader2,
  Package,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { useFetch } from "@/hooks/useFetch";
import { getRecipesByPantryIngredients } from "@/actions/recipe.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RecipeCard from "@/components/RecipeCard";
import PricingModal from "@/components/PricingModal";

export default function PantryRecipesPage() {
  const {
    isLoading,
    data: recipesData,
    execute: fetchRecipeSuggestions,
  } = useFetch(getRecipesByPantryIngredients);

  useEffect(() => {
    fetchRecipeSuggestions();
  }, []);

  const recipes = recipesData?.data || [];
  const ingredientsUsed = recipesData?.ingredientsUsed || "";

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/pantry"
            className="text-stone-600 hover:text-orange-600 font-medium inline-flex items-center gap-2 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pantry
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <ChefHat className="w-16 h-16 text-green-600" />

            <div>
              <h1 className="text-4xl md:text-5xl text-stone-900 font-bold tracking-tight">
                What Can I Cook?
              </h1>
              <p className="text-stone-600 font-light">
                AI-Powered Recipe Suggestions based on Your Pantry
              </p>
            </div>
          </div>

          {ingredientsUsed && (
            <div className="bg-white border-2 border-stone-200 mb-4 p-4">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />

                <div>
                  <h3 className="text-stone-900 font-bold mb-1">
                    Your Available Ingredients:
                  </h3>
                  <p className="text-stone-600 text-sm font-light">
                    {ingredientsUsed}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Usage Stats */}
          {recipesData !== undefined && (
            <div className="bg-orange-50 border-2 border-orange-200 inline-flex items-center gap-3 p-4">
              <Sparkles className="w-5 h-5 text-orange-600" />

              <div className="text-sm">
                {recipesData.recommendationsLimit === "unlimited" ? (
                  <>
                    <span className="text-green-600 font-bold">♾️</span>
                    <span className="text-orange-700 font-light">
                      Unlimited AI Recommendations (Pro Plan)
                    </span>
                  </>
                ) : (
                  <span className="text-orange-700 font-light">
                    Upgrade to Pro for Unlimited AI Recommendations
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-6" />

            <h2 className="text-2xl text-stone-900 font-bold mb-2">
              Finding Perfect Recipes...
            </h2>

            <p className="text-stone-600 font-light">
              Our AI Chef is Analyzing your Ingredients
            </p>
          </div>
        )}

        {/* Recipes Grid - RecipeCard */}
        {!isLoading && recipes.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h2 className="text-2xl text-stone-900 font-bold">
                  Recipe Suggestions
                </h2>
              </div>

              <Badge
                variant="outline"
                className="text-stone-900 border-2 border-stone-900 font-bold uppercase tracking-wide"
              >
                {recipes.length} {recipes.length === 1 ? "Recipe" : "Recipes"}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {recipes.map((recipe, i) => (
                <RecipeCard key={i} recipe={recipe} variant="pantry" />
              ))}
            </div>

            <div className="text-center mt-8">
              <Button
                variant="outline"
                className="border-2 border-stone-900 hover:bg-stone-900 hover:text-white gap-2"
                onClick={() => fetchRecipeSuggestions(new FormData())}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Get New Suggestions
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading &&
          recipes.length === 0 &&
          recipesData?.success === false && (
            <div className="bg-white text-center border-2 border-dashed border-stone-200 p-12">
              <div className="w-20 h-20 bg-orange-50 border-2 border-orange-200 flex justify-center items-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-orange-600" />
              </div>

              <h3 className="text-2xl text-stone-900 font-bold mb-2">
                Your Pantry is Empty
              </h3>

              <p className="text-stone-600 font-light max-w-md mx-auto mb-8">
                Add Ingredients to your Pantry First so we can Suggest Delicious
                Recipes you can make!
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/pantry">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                    <Sparkles className="w-4 h-4" />
                    Scan with AI
                  </Button>
                </Link>

                <Link href="/pantry">
                  <Button
                    variant="outline"
                    className="border-2 border-stone-900 hover:bg-stone-900 hover:text-white gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Manually
                  </Button>
                </Link>
              </div>
            </div>
          )}

        {/* Rate Limit Reached */}
        {!isLoading && recipesData === undefined && (
          <div className="bg-linear-to-br from-orange-50 to-amber-50 text-center border-2 border-orange-200 p-12">
            <div className="w-20 h-20 bg-orange-100 border-2 border-orange-200 flex justify-center items-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-orange-600" />
            </div>

            <h3 className="text-2xl text-stone-900 font-bold mb-2">
              Monthly Limit Reached
            </h3>

            <p className="text-stone-600 font-light max-w-md mx-auto mb-8">
              You&apos;ve used all your AI recipe recommendations this month.
              Upgrade to Pro for unlimited suggestions!
            </p>

            <PricingModal>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                <Sparkles className="w-4 h-4" />
                Upgrade to Pro
              </Button>
            </PricingModal>
          </div>
        )}
      </div>
    </div>
  );
}
