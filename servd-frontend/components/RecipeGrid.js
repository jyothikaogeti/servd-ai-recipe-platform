"use client";

import { useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { useFetch } from "@/hooks/useFetch";
import RecipeCard from "./RecipeCard";

export default function RecipeGrid({
  type,
  value,
  fetchAction,
  backLink = "/dashboard",
}) {
  const { isLoading, data, execute: fetchMeals } = useFetch(fetchAction);

  useEffect(() => {
    if (value) {
      const formattedMealValue = value.charAt(0).toUpperCase() + value.slice(1);
      fetchMeals(formattedMealValue);
    }
  }, [value]);

  const meals = data?.data || [];
  const mealName = value?.replace(/-/g, " ").toLowerCase();

  return (
    <div className="min-h-screen bg-stone-50 pt-14 pb-16 px-4">
      <div className="container max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href={backLink}
            className="text-stone-600 hover:text-orange-600 inline-flex items-center transition-colors gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-5xl md:text-6xl text-stone-900 font-bold capitalize tracking-tight leading-tight">
            {mealName}{" "}
            <span className="text-orange-600">
              {type === "cuisine" ? "Cuisine" : "Recipes"}
            </span>
          </h1>

          {!isLoading && meals.length > 0 && (
            <p className="text-stone-600 mt-2">
              {meals.length} Delicious{" "}
              <span className="capitalize">{mealName}</span>{" "}
              {type === "cuisine" ? "Dishes" : "Recipes"} To Try
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-4" />
            <p className="text-stone-500">Loading Recipes...</p>
          </div>
        )}

        {/* Meals Grid - RecipeCard */}
        {!isLoading && meals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {meals.map((meal) => (
              <RecipeCard key={meal.idMeal} recipe={meal} variant="grid" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && meals.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>

            <h3 className="text-2xl text-stone-900 font-bold mb-2">
              No Recipes Found
            </h3>

            <p className="text-stone-500 mb-6">
              We couldn&apos;t find any
              <span className="capitalize">{mealName}</span>
              {type === "cuisine" ? "dishes" : "recipes"}.
            </p>

            <Link href={backLink}>
              <span className="text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Go Back to Explore More
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
