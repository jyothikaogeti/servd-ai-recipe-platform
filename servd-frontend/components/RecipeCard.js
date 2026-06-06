import { ChefHat, Clock, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function RecipeCard({ recipe, variant = "default" }) {
  function getRecipeData() {
    // For MealDB Recipes
    if (recipe.strMeal) {
      return {
        title: recipe.strMeal,
        image: recipe.strMealThumb,
        href: `/recipe?cook=${encodeURIComponent(recipe.strMeal)}`,
        showImage: true,
      };
    }

    // For AI Generated Pantry Recipes
    if (recipe.matchPercentage) {
      return {
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        cuisine: recipe.cuisine,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        matchPercentage: recipe.matchPercentage,
        missingIngredients: recipe.missingIngredients || [],
        image: recipe.imageUrl,
        href: `/recipe?cook=${encodeURIComponent(recipe.title)}`,
        showImage: !!recipe.imageUrl,
      };
    }

    // For Strapi Recipes
    if (recipe) {
      return {
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        cuisine: recipe.cuisine,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        image: recipe.imageUrl,
        href: `/recipe?cook=${encodeURIComponent(recipe.title)}`,
        showImage: !!recipe.imageUrl,
      };
    }
    return {};
  }

  const data = getRecipeData();

  // Variant - Grid
  if (variant === "grid") {
    return (
      <Link href={data.href}>
        <Card className="border-stone-200 rounded-none hover:shadow-xl hover:-translate-y-1 overflow-hidden transition-all cursor-pointer group duration-300 pt-0">
          {data.showImage ? (
            <div className="relative aspect-square">
              <Image
                src={data.image}
                alt={data.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute left-0 right-0 bottom-0 p-4">
                  <p className="text-white  text-sm font-medium">
                    Click to View Recipe
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative aspect-square bg-linear-to-br from-orange-400 via-amber-400 to-yellow-400 flex justify-center items-center">
              <ChefHat className="w-20 h-20 text-white/30" />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            </div>
          )}

          <CardHeader>
            <CardTitle className="text-lg text-stone-900 group-hover:text-orange-600 font-bold line-clamp-2 transition-colors">
              {data.title}
            </CardTitle>
          </CardHeader>
        </Card>
      </Link>
    );
  }

  // Variant - Pantry
  if (variant === "pantry") {
    return (
      <Card className="border-stone-200 rounded-none hover:shadow-xl hover:-translate-y-1 overflow-hidden transition-all duration-300">
        {/* Show Image If Available */}
        {data.showImage && (
          <div className="relative aspect-video">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {data.matchPercentage && (
              <div className="absolute top-4 right-4">
                <Badge
                  className={`text-lg text-white shadow-lg px-3 py-1.5 ${
                    data.matchPercentage >= 90
                      ? "bg-green-600"
                      : data.matchPercentage >= 75
                        ? "bg-orange-600"
                        : "bg-stone-600"
                  }`}
                >
                  {data.matchPercentage}% Match
                </Badge>
              </div>
            )}
          </div>
        )}

        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                {data.cuisine && (
                  <Badge
                    variant="outline"
                    className="text-orange-600 border-orange-200 capitalize"
                  >
                    {data.cuisine}
                  </Badge>
                )}

                {data.category && (
                  <Badge
                    variant="outline"
                    className="text-stone-600 border-stone-200 capitalize"
                  >
                    {data.category}
                  </Badge>
                )}
              </div>
            </div>

            {!data.showImage && data.matchPercentage && (
              <div className="flex flex-col items-end gap-1">
                <Badge
                  className={`text-lg text-white px-3 py-1 ${
                    data.matchPercentage >= 90
                      ? "bg-green-600"
                      : data.matchPercentage >= 75
                        ? "bg-orange-600"
                        : "bg-stone-600"
                  }`}
                >
                  {data.matchPercentage}%
                </Badge>

                <span className="text-stone-500 text-xs">Match</span>
              </div>
            )}
          </div>

          <CardTitle className="text-2xl text-stone-900 font-serif font-bold">
            {data.title}
          </CardTitle>

          {data.description && (
            <CardDescription className="text-stone-600 leading-relaxed mt-2">
              {data.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-4 flex-1">
          {(data.prepTime || data.cookTime || data.servings) && (
            <div className="text-stone-500 text-sm flex gap-4">
              {(data.prepTime || data.cookTime) && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {parseInt(data.prepTime || 0) +
                      parseInt(data.cookTime || 0)}
                    mins
                  </span>
                </div>
              )}

              {data.servings && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{data.servings} servings</span>
                </div>
              )}
            </div>
          )}

          {data.missingIngredients && data.missingIngredients.length > 0 && (
            <div className="bg-orange-50 border border-orange-100 p-4">
              <h4 className="text-orange-900 text-sm font-semibold mb-2">
                You&apos;ll need:
              </h4>

              <div className="flex flex-wrap gap-2">
                {data.missingIngredients.map((ingredient, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="bg-white text-orange-700 border-orange-200"
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Link href={data.href} className="w-full">
            <Button className="w-full bg-green-600 text-white hover:bg-green-700 gap-2">
              <ChefHat className="w-4 h-4" />
              View Full Recipe
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  // Variant - List
  if (variant === "list") {
    return (
      <Link href={data.href}>
        <Card className="border-stone-200 rounded-none hover:border-orange-200 hover:shadow-lg group transition-all overflow-hidden cursor-pointer py-0">
          <div className="flex flex-col md:flex-row">
            {data.showImage ? (
              <div className="relative w-full md:w-48 aspect-video md:aspect-square shrink-0">
                <Image
                  src={data.image}
                  alt={data.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 192px"
                />
              </div>
            ) : (
              <div className="relative w-full md:w-48 aspect-video md:aspect-square bg-linear-to-br from-orange-400 to-amber-400 flex justify-center items-center shrink-0">
                <ChefHat className="w-12 h-12 text-white/30" />
              </div>
            )}

            <div className="flex-1 py-5">
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  {data.cuisine && (
                    <Badge
                      variant="outline"
                      className="text-orange-600 border-orange-200 capitalize"
                    >
                      {data.cuisine}
                    </Badge>
                  )}

                  {data.category && (
                    <Badge
                      variant="outline"
                      className="text-stone-600 border-stone-200 capitalize"
                    >
                      {data.category}
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-xl text-stone-900 group-hover:text-orange-600 font-bold transition-colors">
                  {data.title}
                </CardTitle>

                {data.description && (
                  <CardDescription className="line-clamp-2">
                    {data.description}
                  </CardDescription>
                )}
              </CardHeader>

              {(data.prepTime || data.cookTime || data.servings) && (
                <CardContent>
                  <div className="flex text-stone-500 text-sm gap-4 pt-4">
                    {(data.prepTime || data.cookTime) && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {parseInt(data.prepTime || 0) +
                            parseInt(data.cookTime || 0)}
                          mins
                        </span>
                      </div>
                    )}

                    {data.servings && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{data.servings} servings</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  // Variant - Default
  return (
    <Link href={data.href}>
      <Card className="border-stone-200 rounded-none hover:shadow-lg overflow-hidden transition-all cursor-pointer py-0">
        {data.showImage && (
          <div className="relative aspect-video">
            <Image
              src={data.image}
              alt={data.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-lg">{data.title}</CardTitle>

          {data.description && (
            <CardDescription className="line-clamp-2">
              {data.description}
            </CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
