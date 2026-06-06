"use server";

import { GoogleGenAI } from "@google/genai";
import { request } from "@arcjet/next";

import { freeMealRecommendations } from "@/lib/arcjet";
import { checkUser } from "@/lib/checkUser";
import { normalizeTitle } from "@/lib/helper";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function getRecipesByPantryIngredients() {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    const isPro = user.subscriptionTier === "pro";

    // Apply Arcjet Rate Limit Based On Tier
    const arcjetRateLimiter = isPro ? proTierLimit : freeMealRecommendations;

    const req = await request();
    const decision = await arcjetRateLimiter.protect(req, {
      userId: user.clerkId,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw new Error(
          `Monthly Scan Limit Reached. ${
            isPro
              ? "Please Contact Support If You Needed More Scans."
              : "Upgrade to Pro for Unlimited Scans!"
          }`,
        );
      }
      throw new Error("Request Denied by Security System.");
    }

    // Get User's Pantry Items
    const pantryResponse = await fetch(
      `
      ${STRAPI_URL}/api/pantry-items?filters[owner][id][$eq]=${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (!pantryResponse.ok) {
      const errorText = await pantryResponse.text();
      console.error("Failed to Fetch Items:", errorText);
      throw new Error("Failed to Fetch Pantry Items");
    }

    const pantryData = await pantryResponse.json();

    if (!pantryData.data || pantryData.data.length === 0) {
      return {
        success: false,
        message: "Your Pantry is Empty. Add Ingredients First",
      };
    }

    const ingredients = pantryData.data
      .map((ingredient) => ingredient.name)
      .join(", ");

    const prompt = `You are a professional chef. Given these available ingredients: ${ingredients}

    Suggest 5 recipes that can be made primarily with these ingredients. It's okay if the recipes need 1-2 common pantry staples (salt, pepper, oil, etc.) that aren't listed.

    Return ONLY a valid JSON array (no markdown, no explanations):
    [
      {
        "title": "Recipe name",
        "description": "Brief 1-2 sentence description",
        "matchPercentage": 85,
        "missingIngredients": ["ingredient1", "ingredient2"],
        "category": "breakfast|lunch|dinner|snack|dessert",
        "cuisine": "italian|chinese|mexican|etc",
        "prepTime": 20,
        "cookTime": 30,
        "servings": 4
      }
    ]

    Rules:
    - matchPercentage should be 70-100% (how many listed ingredients are used)
    - missingIngredients should be common items or optional additions
    - Sort by matchPercentage descending
    - Make recipes realistic and delicious
  `;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const recipesText = result.text;

    let recipeSuggestions;

    try {
      const cleanRecipesText = recipesText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      recipeSuggestions = JSON.parse(cleanRecipesText);
    } catch (parseError) {
      console.error("Failed to Parse Gemini Response:", recipesText);
      throw new Error(
        "Failed to Generate Recipe Suggestions. Please Try Again",
      );
    }

    return {
      success: true,
      data: recipeSuggestions,
      ingredientsUsed: ingredients,
      recommendationsLimit: isPro ? "unlimited" : 5,
      message: `Found ${recipeSuggestions.length} Recipes you can make`,
    };
  } catch (error) {
    console.error("Error in Generating Recipes by Pantry Ingredients:", error);
    throw new Error(error.message || "Failed to Get Recipe Suggestions");
  }
}

async function fetchRecipeImage(recipeName) {
  try {
    if (!UNSPLASH_ACCESS_KEY) {
      console.error("UNSPLASH_ACCESS_KEY not set, skipping image fetch");
      return "";
    }

    const searchQuery = `${recipeName}`;

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      },
    );

    if (!response.ok) {
      console.error("Unsplash API Error:", response.statusText);
      return "";
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const photo = data.results[0];
      return photo.urls.regular;
    }

    return "";
  } catch (error) {
    console.error("Error Fetching Unsplash Image:", error);
    return "";
  }
}

export async function getOrGenerateRecipe(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    const recipeName = formData.get("recipeName");

    if (!recipeName) {
      throw new Error("Recipe Name is Required");
    }

    // Normalize The Title
    const normalizedTitle = normalizeTitle(recipeName);
    const isPro = user.subscriptionTier === "pro";

    // Step - 1: Check If Recipe Already Exists in DB
    const searchResponse = await fetch(
      `${STRAPI_URL}/api/recipes?filters[title][$eqi]=${encodeURIComponent(normalizedTitle)}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();

      if (searchData.data && searchData.data.length > 0) {
        // Check If User Saved This Recipe
        const savedRecipeResponse = await fetch(
          `
          ${STRAPI_URL}/api/saved-recipes?filters[user][$eq]=${user.id}&filters[recipe][id][$eq]=${searchData.data[0].id}`,
          {
            headers: {
              Authorization: `Bearer ${STRAPI_API_TOKEN}`,
            },
            cache: "no-store",
          },
        );

        let isSaved = false;

        if (savedRecipeResponse.ok) {
          const savedRecipeData = await savedRecipeResponse.json();
          isSaved = savedRecipeData.data && savedRecipeData.data.length > 0;
        }

        return {
          success: true,
          data: searchData.data[0],
          recipeId: searchData.data[0].id,
          isSaved: isSaved,
          fromDatabase: true,
          isPro,
          message: "Recipe Loaded from Database",
        };
      }
    }

    // Step - 2: Recipe Doesn't Exist, Generate With Gemini
    const prompt = `You are a professional chef and recipe expert. Generate a detailed recipe for: "${normalizedTitle}"

    CRITICAL: The "title" field MUST be EXACTLY: "${normalizedTitle}" (no changes, no additions like "Classic" or "Easy")

    Return ONLY a valid JSON object with this exact structure (no markdown, no explanations):
    {
      "title": "${normalizedTitle}",
      "description": "Brief 2-3 sentence description of the dish",
      "category": "Must be ONE of these EXACT values: breakfast, lunch, dinner, snack, dessert",
      "cuisine": "Must be ONE of these EXACT values: italian, chinese, mexican, indian, american, thai, japanese, mediterranean, french, korean, vietnamese, spanish, greek, turkish, moroccan, brazilian, caribbean, middle-eastern, british, german, portuguese, other",
      "prepTime": "Time in minutes (number only)",
      "cookTime": "Time in minutes (number only)",
      "servings": "Number of servings (number only)",
      "ingredients": [
        {
          "item": "ingredient name",
          "amount": "quantity with unit",
          "category": "Protein|Vegetable|Spice|Dairy|Grain|Other"
        }
      ],
      "instructions": [
        {
          "step": 1,
          "title": "Brief step title",
          "instruction": "Detailed step instruction",
          "tip": "Optional cooking tip for this step"
        }
      ],
     "nutrition": {
        "calories": "range with unit kcal",
        "protein": "range with unit g",
        "carbs": "range with unit g",
        "fat": "range with unit g"
      },
      "tips": [
        "General cooking tip 1",
        "General cooking tip 2",
        "General cooking tip 3"
      ],
      "substitutions": [
        {
          "original": "ingredient name",
          "alternatives": ["substitute 1", "substitute 2"]
        }
      ]
    }

    IMPORTANT RULES FOR CATEGORY:
    - Breakfast items (pancakes, eggs, cereal, etc.) → "breakfast"
    - Main meals for midday (sandwiches, salads, pasta, etc.) → "lunch"
    - Main meals for evening (heavier dishes, roasts, etc.) → "dinner"
    - Light items between meals (chips, crackers, fruit, etc.) → "snack"
    - Sweet treats (cakes, cookies, ice cream, etc.) → "dessert"

    IMPORTANT RULES FOR CUISINE:
    - Use lowercase only
    - Pick the closest match from the allowed values
    - If uncertain, use "other"

    IMPORTANT NUTRITION RULES:
    - Return estimated nutritional values as ranges
    - Calories must be formatted like: "450-500 kcal"
    - Protein must be formatted like: "30-35 g"
    - Carbs must be formatted like: "15-20 g"
    - Fat must be formatted like: "30-35 g"
    - DO NOT use words such as "approx", "approximately", "about", or "~"
    - DO NOT include any explanations
    - Return only the value and unit
    - Example:
      "nutrition": {
        "calories": "450-500 kcal",
        "protein": "30-35 g",
        "carbs": "15-20 g",
        "fat": "30-35 g"
      }

    Guidelines:
    - Make ingredients realistic and commonly available
    - Instructions should be clear and beginner-friendly
    - Include 6-10 detailed steps
    - Provide practical cooking tips
    - Estimate realistic cooking times
    - Keep total instructions under 12 steps
    `;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const recipesText = result.text;

    let recipeData;

    try {
      const cleanRecipesText = recipesText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      recipeData = JSON.parse(cleanRecipesText);
    } catch (parseError) {
      console.error("Failed to Parse Gemini Response:", recipesText);
      throw new Error("Failed to Generate Recipe. Please Try Again");
    }

    recipeData.title = normalizedTitle;

    // Validate Category
    const validCategories = [
      "breakfast",
      "lunch",
      "dinner",
      "snack",
      "dessert",
    ];
    const category = validCategories.includes(
      recipeData.category?.toLowerCase(),
    )
      ? recipeData.category.toLowerCase()
      : "dinner";

    // Validate Cuisine
    const validCuisines = [
      "italian",
      "chinese",
      "mexican",
      "indian",
      "american",
      "thai",
      "japanese",
      "mediterranean",
      "french",
      "korean",
      "vietnamese",
      "spanish",
      "greek",
      "turkish",
      "moroccan",
      "brazilian",
      "caribbean",
      "middle-eastern",
      "british",
      "german",
      "portuguese",
      "other",
    ];
    const cuisine = validCuisines.includes(recipeData.cuisine?.toLowerCase())
      ? recipeData.cuisine.toLowerCase()
      : "other";

    // Step - 3: Fetch Image with Unsplash
    const imageUrl = await fetchRecipeImage(normalizedTitle);

    // Step - 4: Save Generated Recipe to DB
    const strapiRecipeData = {
      data: {
        title: normalizedTitle,
        description: recipeData.description,
        cuisine,
        category,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        prepTime: Number(recipeData.prepTime),
        cookTime: Number(recipeData.cookTime),
        servings: Number(recipeData.servings),
        nutrition: recipeData.nutrition,
        tips: recipeData.tips,
        substitutions: recipeData.substitutions,
        imageUrl: imageUrl || "",
        isPublic: true,
        author: user.id,
      },
    };

    const createRecipeResponse = await fetch(`${STRAPI_URL}/api/recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(strapiRecipeData),
    });

    if (!createRecipeResponse.ok) {
      const errorText = await createRecipeResponse.text();
      console.error("Failed to Save Recipe:", errorText);
      throw new Error("Failed to Save Recipe to Database");
    }

    const createdRecipe = await createRecipeResponse.json();

    return {
      success: true,
      data: {
        ...recipeData,
        title: normalizedTitle,
        category,
        cuisine,
        imageUrl: imageUrl || "",
      },
      recipeId: createdRecipe.data.id,
      isSaved: false,
      fromDatabase: false,
      recommendationsLimit: isPro ? "unlimited" : 5,
      isPro,
      message: "New Recipe Generated and Saved Successfully",
    };
  } catch (error) {
    console.error("Error in Getting or Generating Recipe:", error);
    throw new Error("Failed to Load Recipe");
  }
}

export async function saveRecipeToCollection(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    const recipeId = formData.get("recipeId");
    if (!recipeId) {
      throw new Error("Recipe ID is Required");
    }

    // Check If Already Saved
    const existingResponse = await fetch(
      `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&filters[recipe][id][$eq]=${recipeId}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (existingResponse.ok) {
      const existingData = await existingResponse.json();

      if (existingData.data && existingData.data.length > 0) {
        return {
          success: true,
          alreadySaved: true,
          message: "Recipe is already in your Collection",
        };
      }
    }

    const saveResponse = await fetch(`${STRAPI_URL}/api/saved-recipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          user: user.id,
          recipe: recipeId,
          savedAt: new Date().toISOString(),
        },
      }),
    });

    if (!saveResponse.ok) {
      const errorText = await saveResponse.text();
      console.error("Failed to Save Recipe:", errorText);
      throw new Error("Failed to Save Recipe to Collection");
    }

    const savedRecipe = await saveResponse.json();

    return {
      success: true,
      alreadySaved: false,
      data: savedRecipe.data,
      message: "Recipe Saved to your Collection",
    };
  } catch (error) {
    console.error("Error Saving Recipe to Collection:", error);
    throw new Error("Failed to Save Recipe");
  }
}

export async function removeRecipeFromCollection(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    const recipeId = formData.get("recipeId");
    if (!recipeId) {
      throw new Error("Recipe ID is Required");
    }

    // Check If Already Saved
    const searchResponse = await fetch(
      `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&filters[recipe][id][$eq]=${recipeId}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error("Failed to find Saved Recipe:", errorText);
      throw new Error("Failed to find Saved Recipe from Collection");
    }

    const searchData = await searchResponse.json();

    if (!searchData.data || searchData.data.length === 0) {
      return {
        success: true,
        message: "Recipe was not in your Collection",
      };
    }

    // Delete Saved Recipe From Collection
    const savedRecipeId = searchData.data[0].id;

    const deleteResponse = await fetch(
      `${STRAPI_URL}/api/saved-recipes/${savedRecipeId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
      },
    );

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      console.error("Failed to Remove Recipe:", errorText);
      throw new Error("Failed to Remove Recipe from Collection");
    }

    return {
      success: true,
      message: "Recipe Removed from your Collection",
    };
  } catch (error) {
    console.error("Error Removing Recipe from Collection:", error);
    throw new Error("Failed to Remove Recipe");
  }
}

export async function getSavedRecipes() {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    const response = await fetch(
      `${STRAPI_URL}/api/saved-recipes?filters[user][id][$eq]=${user.id}&populate[recipe][populate]=*&sort=savedAt:desc`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to Fetch Saved Recipes:", errorText);
      throw new Error("Failed to Fetch Saved Recipes");
    }

    const data = await response.json();

    const recipes = data.data
      .map((savedRecipe) => savedRecipe.recipe)
      .filter(Boolean);

    return {
      success: true,
      data: recipes,
    };
  } catch (error) {
    console.error("Error Fetching Saved Recipes:", error);
    throw new Error("Failed to Load Saved Recipes");
  }
}
