import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";

export const arcjetClient = arcjet({
  key: process.env.ARCJEY_KEY,
  rules: [
    shield({
      mode: "LIVE",
    }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
    }),
  ],
});

// Free Tier Limit (10 Scans Per Month)
export const freePantryScans = arcjetClient.withRule(
  tokenBucket({
    mode: "LIVE",
    characteristics: ["userId"],
    refillRate: 10,
    interval: "30d",
    capacity: 10,
  }),
);

// Free Tier Limit (5 AI Meal Recommendations)
export const freeMealRecommendations = arcjetClient.withRule(
  tokenBucket({
    mode: "LIVE",
    characteristics: ["userId"],
    refillRate: 5,
    interval: "30d",
    capacity: 5,
  }),
);

// Pro Tier Limit (1000 Requests Per Day)
export const proTierLimit = arcjetClient.withRule(
  tokenBucket({
    mode: "LIVE",
    characteristics: ["userId"],
    refillRate: 1000,
    interval: "1d",
    capacity: 1000,
  }),
);
