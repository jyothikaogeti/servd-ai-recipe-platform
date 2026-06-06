import { Show, SignInButton } from "@clerk/nextjs";
import { CheckoutButton } from "@clerk/nextjs/experimental";
import { Check } from "lucide-react";
import Link from "next/link";

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

export default function PricingSection({ subscriptionTier = "free" }) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-16">
        <h2 className="text-5xl md:text-6xl font-bold mb-4">Simple Pricing</h2>
        <p className="text-xl text-stone-600 font-light">
          Start for Free. Upgrade to Become a Master Chef.
        </p>
      </div>

      <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-8">
        {/* Free Plan */}
        <Card className="bg-white border-2 border-stone-200">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Free Chef</CardTitle>

            <div className="text-5xl text-stone-900 font-bold">
              $0
              <span className="text-lg text-stone-400 font-normal">/mo</span>
            </div>

            <CardDescription className="text-stone-600 text-base font-light">
              Perfect for Casual Weekly Cooks.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-4">
              {[
                "10 Pantry Scans per Month",
                "5 AI Meal Recommendations",
                "Standard Recipes",
                "Standard Support",
              ].map((feature, i) => (
                <li key={i} className="text-stone-700 flex gap-3">
                  <Check className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className="mt-auto">
            <Link href="/dashboard" className="w-full">
              <Button
                variant="outline"
                className="w-full border-2 border-stone-900 hover:bg-stone-900 hover:text-white"
              >
                Get Started
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="relative bg-orange-50 border-2 border-orange-600">
          <Badge className="absolute top-0 right-0 bg-orange-600 text-white font-bold border-none rounded-none rounded-bl-lg uppercase tracking-wide">
            Most Popular
          </Badge>

          <CardHeader>
            <CardTitle className="text-3xl text-orange-900 font-bold">
              Pro Chef
            </CardTitle>

            <div className="text-5xl text-orange-600 font-bold">
              $7.99
              <span className="text-lg text-orange-400 font-normal">/mo</span>
            </div>

            <CardDescription className="text-orange-800/70 text-base font-light">
              For the Serious Home Cook.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-4">
              {[
                "Unlimited Pantry Scans",
                "Unlimited AI Recipes",
                "Chef's Tips & Tricks",
                "Ingredient Substitutions",
                "Recipes with Nutritional Analysis",
                "Priority Support",
              ].map((feature, i) => (
                <li key={i} className="text-orange-950 flex gap-3">
                  <Badge className="bg-orange-200 flex justify-center items-center border-none rounded-full w-6 h-6 p-1">
                    <Check className="w-4 h-4 text-orange-700" />
                  </Badge>

                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter>
            <Show when="signed-in">
              <CheckoutButton
                planId="cplan_3Ekr6iPRF3QRO4g4plAiDtOUkcA"
                planPeriod="month"
                newSubscriptionRedirectUrl="/dashboard"
                checkoutProps={{
                  appearance: {
                    elements: {
                      drawerRoot: {
                        zIndex: 10000,
                      },
                    },
                  },
                }}
              >
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={subscriptionTier === "pro"}
                >
                  {subscriptionTier === "pro" ? "Subscribed" : "Subscribe Now"}
                </Button>
              </CheckoutButton>
            </Show>

            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="primary" className="w-full">
                  Login to Subscribe
                </Button>
              </SignInButton>
            </Show>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
