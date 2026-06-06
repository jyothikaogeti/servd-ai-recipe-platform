import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Clock, Flame, Star, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { FEATURES, HOW_IT_WORKS_STEPS, STATS } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PricingSection from "@/components/PricingSection";

export default async function Home() {
  const { has } = await auth();
  const subscriptionTier = has({ plan: "pro" }) ? "pro" : "free";

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="flex-1 text-center md:text-left">
              <Badge
                variant="outline"
                className="bg-orange-50 text-orange-700 text-sm font-bold border-2 border-orange-600 uppercase tracking-wide p-3 mb-6"
              >
                <Flame className="mr-1" />
                #1 AI Cooking Assistant
              </Badge>

              <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-6">
                Turn your{" "}
                <span className="italic underline decoration-4 decoration-orange-600">
                  leftovers{" "}
                </span>
                into <br />
                masterpieces.
              </h1>

              <p className="text-xl md:text-2xl text-stone-600 font-light max-w-lg mx-auto md:mx-0 mb-10">
                Snap a photo of your fridge. We&apos;ll tell you what to cook.
                Save money, reduce waste, and eat better tonight.
              </p>

              <Link href="/dashboard">
                <Button
                  size="xl"
                  variant="primary"
                  className="text-lg px-8 py-6"
                >
                  Start Cooking Free <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <p className="text-stone-500 text-sm mt-6">
                <span className="text-stone-900 font-bold">10k+ cooks</span>{" "}
                {""}
                joined last month
              </p>
            </div>

            <Card className="relative aspect-square md:aspect-4/5 bg-stone-200 border-4 border-stone-900 overflow-hidden py-0">
              <Image
                src="/hero-image.png"
                alt="Delicious Pasta Dish"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />

              <Card className="absolute left-8 right-8 bottom-8 bg-white/95 border-2 border-stone-900 backdrop-blur-sm py-0">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold">
                        Rustic Tomato Basil Pasta
                      </h3>

                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 text-orange-500 fill-orange-500"
                          />
                        ))}
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 font-bold border-2 border-green-700"
                    >
                      98% MATCH
                    </Badge>
                  </div>

                  <div className="text-stone-500 text-xs font-medium flex gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 25 mins
                    </span>

                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> 2 servings
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-stone-900 border-y-2 border-stone-900 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center px-4 gap-8">
          {STATS.map((stat, i) => (
            <div key={i}>
              <div className="text-4xl text-stone-50 font-bold mb-1">
                {stat.value}
              </div>

              <Badge
                variant="outline"
                className="bg-transparent text-orange-500 text-sm font-medium border-none uppercase tracking-wider"
              >
                {stat.label}
              </Badge>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              Your Smart Kitchen
            </h2>

            <p className="text-xl text-stone-600 font-light">
              Everything you need to master your meal prep.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;

              return (
                <Card
                  key={i}
                  className="bg-white border-2 border-stone-200 hover:border-orange-600 hover:shadow-lg group transition-all py-0"
                >
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-orange-50 border-2 border-stone-200 group-hover:bg-orange-100 group-hover:border-orange-600 transition-colors p-3">
                        <Icon className="w-6 h-6" />
                      </div>

                      <Badge
                        variant="secondary"
                        className="bg-stone-100 text-stone-600 text-xs font-mono border border-stone-200 uppercase tracking-wide"
                      >
                        {feature.limit}
                      </Badge>
                    </div>

                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>

                    <p className="text-lg text-stone-600 font-light">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How To Cook In 3 Steps */}
      <section className="bg-stone-900 text-stone-50 border-y-2 border-stone-200 px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-16">
            Cook in 3 Steps
          </h2>

          <div className="space-y-12">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <div key={i}>
                <div className="flex items-start gap-6">
                  <Badge
                    variant="outline"
                    className="text-6xl bg-transparent text-orange-500 font-bold border-none h-auto p-0"
                  >
                    {step.step}
                  </Badge>

                  <div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>

                    <p className="text-lg text-stone-400 font-light">
                      {step.description}
                    </p>
                  </div>
                </div>

                {i < HOW_IT_WORKS_STEPS.length - 1 && (
                  <hr className="bg-stone-700 my-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-24">
        <PricingSection subscriptionTier={subscriptionTier} />
      </section>
    </div>
  );
}
