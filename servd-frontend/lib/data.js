import { Camera, BookOpen, ChefHat, Search } from "lucide-react";

export const STATS = [
  { label: "Free Scans", value: "10/mo" },
  { label: "Recipes Generated", value: "1M+" },
  { label: "Cost to Start", value: "$0" },
  { label: "App Store Rating", value: "4.9" },
];

export const FEATURES = [
  {
    title: "Scan Your Pantry",
    description:
      "Photo recognition that actually works. Know what you have instantly.",
    icon: Camera,
    limit: "10 scans/mo free",
  },
  {
    title: "AI Chef Suggestions",
    description:
      "Turn random ingredients into a gourmet meal. Zero food waste.",
    icon: ChefHat,
    limit: "5 meals/mo free",
  },
  {
    title: "Search Any Dish",
    description:
      "Find any recipe instantly. Filter by cuisine, time, or dietary needs.",
    icon: Search,
    limit: "Unlimited searches",
  },
  {
    title: "Digital Cookbook",
    description: "Save your favorites. Export as PDF. Share with family.",
    icon: BookOpen,
    limit: "3 saves/mo free",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Scan",
    description: "Point camera at fridge. AI identifies ingredients.",
  },
  {
    step: "02",
    title: "Select",
    description: "Choose a generated recipe based on your mood.",
  },
  {
    step: "03",
    title: "Savor",
    description: "Follow simple steps. Eat delicious food.",
  },
];

export const FEATURED_AREAS = [
  "American",
  "British",
  "Canadian",
  "Chinese",
  "Croatian",
  "Dutch",
  "Egyptian",
  "Filipino",
  "French",
  "Greek",
  "Indian",
  "Irish",
  "Italian",
  "Jamaican",
  "Japanese",
  "Kenyan",
  "Malaysian",
  "Mexican",
  "Moroccan",
  "Polish",
  "Portuguese",
  "Russian",
  "Spanish",
  "Thai",
  "Tunisian",
  "Turkish",
  "Ukrainian",
  "Vietnamese",
  "Algerian",
  "Argentinian",
  "Australian",
  "Norwegian",
  "Saudi Arabian",
  "Slovakian",
  "Syrian",
  "Uruguayan",
  "Venezuelan",
];

export function getCategoryEmoji(category) {
  const emojiMap = {
    Beef: "🥩",
    Chicken: "🍗",
    Dessert: "🍰",
    Lamb: "🍖",
    Miscellaneous: "🍴",
    Pasta: "🍝",
    Pork: "🥓",
    Seafood: "🦐",
    Side: "🥗",
    Starter: "🥟",
    Vegan: "🥬",
    Vegetarian: "🥕",
    Breakfast: "🍳",
    Goat: "🐐",
  };
  return emojiMap[category] || "🍽️";
}

export function getCountryFlag(country) {
  const emojiMap = {
    American: "🗽",
    British: "👑",
    Canadian: "🍁",
    Chinese: "🐉",
    Croatian: "⚽",
    Dutch: "🌷",
    Egyptian: "🐫",
    Filipino: "🌴",
    French: "🥐",
    Greek: "🏛️",
    Indian: "🪷",
    Irish: "☘️",
    Italian: "🍕",
    Jamaican: "🌴",
    Japanese: "🗾",
    Kenyan: "🦒",
    Malaysian: "🌺",
    Mexican: "🌮",
    Moroccan: "🕌",
    Polish: "🦅",
    Portuguese: "🚢",
    Russian: "❄️",
    Spanish: "💃",
    Thai: "🛕",
    Tunisian: "🏜️",
    Turkish: "🧿",
    Ukrainian: "🌻",
    Vietnamese: "🍜",
    Algerian: "🏜️",
    Argentinian: "⚽",
    Australian: "🦘",
    Norwegian: "❄️",
    "Saudi Arabian": "🕋",
    Slovakian: "🏔️",
    Syrian: "🏛️",
    Uruguayan: "⚽",
    Venezuelan: "🌞",
  };

  return emojiMap[country] ?? "🌍";
}
