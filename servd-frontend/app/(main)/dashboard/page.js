import { ArrowRight, Flame, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  getAreas,
  getCategories,
  getRecipeOfTheDay,
} from "@/actions/mealdb.actions";
import { FEATURED_AREAS, getCategoryEmoji, getCountryFlag } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const recipeData = await getRecipeOfTheDay();
  const categoriesData = await getCategories();
  const areasData = await getAreas();

  const recipeOfTheDay = recipeData?.data;
  const categories = categoriesData?.data || [];
  const areas = areasData?.data || [];

  const filteredAreas = areas.filter((area) =>
    FEATURED_AREAS.includes(area.strArea),
  );

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-5">
          <h1 className="text-5xl md:text-7xl text-stone-900 font-bold tracking-tight leading-tight mb-4">
            Fresh Recipes, Servd Daily 🔥
          </h1>

          <p className="text-xl max-w-2xl text-stone-600 font-light">
            Discover thousands of recipes from around the world. Cook, create,
            and savor.
          </p>
        </div>

        {/* Recipe Of The Day - Hero Section */}
        {recipeOfTheDay && (
          <section className="relative mb-24">
            <div className="flex items-center gap-2 mb-6">
              <Flame className="w-6 h-6 text-orange-600" />
              <h2 className="text-3xl text-stone-900 font-serif font-bold">
                Recipe of the Day
              </h2>
            </div>

            <div className="absolute top-20 left-5 flex items-center gap-3 z-10 mb-6">
              <Badge
                variant="outline"
                className="bg-orange-50 text-orange-700 font-bold border-2 border-orange-600 uppercase tracking-wide"
              >
                <Flame className="w-4 h-4 mr-1" />
                Today&apos;s Special
              </Badge>
            </div>

            <Link
              href={`/recipe?cook=${encodeURIComponent(recipeOfTheDay.strMeal)}`}
            >
              <div className="relative bg-white border-2 border-stone-900 hover:border-orange-600 hover:shadow-lg transition-all overflow-hidden cursor-pointer group duration-300">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-4/3 md:aspect-auto border-b-2 md:border-b-0 md:border-r-2 border-stone-900">
                    <Image
                      src={recipeOfTheDay.strMealThumb}
                      alt={recipeOfTheDay.strMeal}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-center p-8 md:p-12">
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge
                        variant="outline"
                        className="bg-orange-50 text-orange-700 font-bold border-2 border-orange-600"
                      >
                        {recipeOfTheDay.strCategory}
                      </Badge>

                      <Badge
                        variant="outline"
                        className="bg-stone-50 text-stone-700 font-bold border-2 border-stone-900"
                      >
                        <Globe className="w-3 h-2 mr-1" />
                        {recipeOfTheDay.strArea}
                      </Badge>
                    </div>

                    <h3 className="text-4xl md:text-5xl text-stone-900 group-hover:text-orange-600 font-bold transition-colors leading-tight mb-4">
                      {recipeOfTheDay.strMeal}
                    </h3>

                    <p className="text-lg text-stone-600 font-light line-clamp-3 mb-6">
                      {recipeOfTheDay.strInstructions?.substring(0, 200)}...
                    </p>

                    {recipeOfTheDay.strTags && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {recipeOfTheDay.strTags
                          .split(",")
                          .slice(0, 3)
                          .map((tag, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="bg-stone-100 text-stone-600 text-xs font-mono border border-stone-200 uppercase"
                            >
                              {tag.trim()}
                            </Badge>
                          ))}
                      </div>
                    )}

                    <Button className="w-fit bg-orange-600 hover:bg-orange-700 text-white font-bold border-2 border-orange-700 px-6 py-5">
                      Start Cooking <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Browse by Categories */}
        <section className="mb-24">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl text-stone-800 font-bold mb-2">
              Browse by Category
            </h2>

            <p className="text-lg text-stone-600 font-light">
              Find recipes that match your mood
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <Link
                key={category.strCategory}
                href={`/recipes/category/${category.strCategory.toLowerCase()}`}
              >
                <div className="bg-white text-center border-2 border-stone-200 hover:border-orange-600 hover:shadow-lg transition-all cursor-pointer group p-6">
                  <div className="text-4xl mb-3">
                    {getCategoryEmoji(category.strCategory)}
                  </div>

                  <h3 className="text-stone-900 text-sm font-bold group-hover:text-orange-600 transition-colors">
                    {category.strCategory}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Cuisine */}
        <section className="pb-12">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl text-stone-900 font-bold mb-2">
              Explore World Cuisines
            </h2>

            <p className="text-lg text-stone-600 font-light">
              Travel the globe through food
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredAreas.map((area) => (
              <Link
                key={`${area.strArea}-${area.strCountry}`}
                href={`/recipes/cuisine/${area.strArea
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <div className="bg-stone-50 border-2 border-stone-200 hover:border-orange-600 hover:shadow-lg transition-all cursor-pointer group p-5">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {getCountryFlag(area.strArea)}
                    </span>

                    <span className="text-stone-900 text-sm font-bold group-hover:text-orange-600 transition-colors">
                      {area.strArea}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
