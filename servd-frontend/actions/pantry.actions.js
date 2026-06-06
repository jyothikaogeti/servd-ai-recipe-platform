"use server";

import { GoogleGenAI } from "@google/genai";
import { request } from "@arcjet/next";

import { freePantryScans, proTierLimit } from "@/lib/arcjet";
import { checkUser } from "@/lib/checkUser";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function scanPantryImage(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    const isPro = user.subscriptionTier === "pro";

    // Apply Arcjet Rate Limit Based On Tier
    const arcjetRateLimiter = isPro ? proTierLimit : freePantryScans;

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

    const imageFile = formData.get("image");

    if (!imageFile || !(imageFile instanceof File)) {
      throw new Error("No Valid Image Provided");
    }
    if (!imageFile.type.startsWith("image/")) {
      throw new Error("File must be an Image");
    }
    if (imageFile.size > 10 * 1024 * 1024) {
      throw new Error("Image must be smaller than 10MB");
    }

    const base64Image = Buffer.from(await imageFile.arrayBuffer()).toString(
      "base64",
    );

    const prompt = `You are a professional chef and ingredient recognition expert. Analyze this image of a pantry/fridge and identify all visible food ingredients.

      Return ONLY a valid JSON array with this exact structure (no markdown, no explanations):
      [
        {
          "name": "ingredient name",
          "quantity": "estimated quantity with unit",
          "confidence": 0.95
        }
      ]

      Rules:
      - Only identify food ingredients (not containers, utensils, or packaging)
      - Be specific (e.g., "Cheddar Cheese" not just "Cheese")
      - Estimate realistic quantities (e.g., "3 eggs", "1 cup milk", "2 tomatoes")
      - Confidence should be 0.7-1.0 (omit items below 0.7)
      - Maximum 20 items
      - Common pantry staples are acceptable (salt, pepper, oil)
  `;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: imageFile.type,
                data: base64Image,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const ingredientsText = result.text;

    if (!ingredientsText) {
      throw new Error("Empty Response from Gemini");
    }

    let ingredients;

    try {
      const cleanIngredientsText = ingredientsText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      ingredients = JSON.parse(cleanIngredientsText);
    } catch (parseError) {
      console.error("Failed to Parse Gemini Response:", ingredientsText);
      throw new Error("Failed to Parse Ingredients. Please Try Again");
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error(
        "No ingredients detected in the Image. Please try a clearer photo.",
      );
    }

    const validIngredients = ingredients
      .filter(
        (ingredient) =>
          ingredient?.name &&
          ingredient?.quantity &&
          typeof ingredient?.confidence === "number" &&
          ingredient.confidence >= 0.7,
      )
      .slice(0, 20);

    return {
      success: true,
      data: validIngredients,
      scansLimit: isPro ? "unlimited" : 10,
      message: `Found ${validIngredients.length} Ingredients`,
    };
  } catch (error) {
    console.error("Pantry Image Scan Failed:", error);
    throw new Error(error.message || "Failed to Scan Image");
  }
}

export async function saveToPantry(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    const ingredientsJson = formData.get("ingredients");
    const ingredients = JSON.parse(ingredientsJson);

    if (!ingredients || ingredients.length === 0) {
      throw new Error("No Ingredients to Save");
    }

    const savedIngredients = [];

    for (const ingredient of ingredients) {
      const response = await fetch(`${STRAPI_URL}/api/pantry-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            name: ingredient.name,
            quantity: ingredient.quantity,
            imageUrl: "",
            owner: user.id,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        savedIngredients.push(data.data);
      }
    }

    return {
      success: true,
      data: savedIngredients,
      message: `Saved ${savedIngredients.length} Items to your Pantry`,
    };
  } catch (error) {
    console.error("Pantry Save Failed:", error);
    throw new Error(error.message || "Failed to Save Ingredients");
  }
}

export async function addPantryItemManually(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    const name = formData.get("name");
    const quantity = formData.get("quantity");

    if (
      !name ||
      !quantity ||
      typeof name !== "string" ||
      typeof quantity !== "string"
    ) {
      throw new Error("Name and Quantity are required");
    }

    const response = await fetch(`${STRAPI_URL}/api/pantry-items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          name: name.trim(),
          quantity: quantity.trim(),
          imageUrl: "",
          owner: user.id,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Strapi Pantry Item Creation Failed:", errorText);
      throw new Error("Failed to Add Pantry Item to Pantry");
    }

    const data = await response.json();

    return {
      success: true,
      data: data.data,
      message: "Item Added Successfully",
    };
  } catch (error) {
    console.error("Error Adding Item Manually:", error);
    throw new Error(error.message || "Failed to Add Pantry Item");
  }
}

export async function getPantryItems(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    const response = await fetch(
      `${STRAPI_URL}/api/pantry-items?filters[owner][id][$eq]=${user.id}&sort=createdAt:desc`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Strapi Pantry Fetch Failed:", errorText);
      throw new Error("Failed to Fetch Pantry Items");
    }

    const data = await response.json();
    const isPro = user.subscriptionTier === "pro";

    return {
      success: true,
      data: data.data || [],
      scansLimit: isPro ? "unlimited" : 10,
      message: "Pantry Items Loaded Successfully",
    };
  } catch (error) {
    console.error("Error Fetching Pantry:", error);
    throw new Error(error.message || "Failed to Load Pantry");
  }
}

export async function deletePantryItem(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    const itemId = formData.get("itemId");

    const response = await fetch(`${STRAPI_URL}/api/pantry-items/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Strapi Pantry Delete Failed:", errorText);
      throw new Error("Failed to Delete Item");
    }

    return {
      success: true,
      message: "Item Removed Successfully",
    };
  } catch (error) {
    console.error("Pantry Item Delete Failed:", error);
    throw new Error(error.message || "Failed to Delete Pantry Item");
  }
}

export async function updatePantryItem(formData) {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User Not Authenticated");
    }

    const itemId = formData.get("itemId");
    const name = formData.get("name");
    const quantity = formData.get("quantity");

    if (
      !itemId &&
      !name &&
      !quantity &&
      typeof itemId !== "string" &&
      typeof name !== "string" &&
      typeof quantity !== "string"
    ) {
      throw new Error("Item ID, Name, and Quantity are required");
    }

    const response = await fetch(`${STRAPI_URL}/api/pantry-items/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          name: name.trim(),
          quantity: quantity.trim(),
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Strapi Pantry Update Failed:", errorText);
      throw new Error("Failed to Update Pantry Item");
    }

    const data = await response.json();

    return {
      success: true,
      data: data.data,
      message: "Item Updated Successfully",
    };
  } catch (error) {
    console.error("Pantry Item Update Failed:", error);
    throw new Error(error.message || "Failed to Update Pantry Item");
  }
}
