"use server";

const MEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export async function getRecipeOfTheDay() {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/random.php`, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error("Failed to Fetch Recipe of the Day");
    }

    const data = await response.json();

    return {
      success: true,
      data: data.meals[0],
    };
  } catch (error) {
    console.error("Error Fetching Recipe of the Day:", error);
    throw new Error(error.message || "Failed to Load Recipe");
  }
}

export async function getCategories() {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/list.php?c=list`, {
      next: { revalidate: 604800 },
    });

    if (!response.ok) {
      throw new Error("Failed to Fetch Categories");
    }

    const data = await response.json();

    return {
      success: true,
      data: data.meals || [],
    };
  } catch (error) {
    console.error("Error Fetching Categories:", error);
    throw new Error(error.message || "Failed to Load Categories");
  }
}

export async function getAreas() {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/list.php?a=list`, {
      next: { revalidate: 604800 },
    });

    if (!response.ok) {
      throw new Error("Failed to Fetch Areas");
    }

    const data = await response.json();

    return {
      success: true,
      data: data.meals || [],
    };
  } catch (error) {
    console.error("Error Fetching Areas:", error);
    throw new Error(error.message || "Failed to Load Areas");
  }
}

export async function getMealsByCategory(category) {
  try {
    const response = await fetch(
      `${MEALDB_BASE_URL}/filter.php?c=${category}`,
      {
        next: { revalidate: 86400 },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to Fetch Meals");
    }

    const data = await response.json();

    return {
      success: true,
      data: data.meals || [],
    };
  } catch (error) {
    console.error("Error Fetching Meals by Category:", error);
    throw new Error(error.message || "Failed to Load Meals");
  }
}

export async function getMealsByArea(area) {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/filter.php?a=${area}`, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error("Failed to Fetch Meals");
    }

    const data = await response.json();

    return {
      success: true,
      data: data.meals || [],
    };
  } catch (error) {
    console.error("Error Fetching Meals by Area:", error);
    throw new Error(error.message || "Failed to Load Meals");
  }
}
