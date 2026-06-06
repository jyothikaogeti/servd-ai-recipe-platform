"use client";

import { useParams } from "next/navigation";

import { getMealsByArea } from "@/actions/mealdb.actions";
import RecipeGrid from "@/components/RecipeGrid";

export default function CategoryRecipesPage() {
  const params = useParams();
  const cuisine = params.cuisine;

  return (
    <RecipeGrid
      type="cuisine"
      value={cuisine}
      fetchAction={getMealsByArea}
      backLink="/dashboard"
    />
  );
}
