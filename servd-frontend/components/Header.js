import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Cookie, Refrigerator, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { checkUser } from "@/lib/checkUser";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import PricingModal from "./PricingModal";
import UserDropdown from "./UserDropdown";
import HowToCookModal from "./HowToCookModal";

export default async function Header() {
  const user = await checkUser();

  return (
    <header className="fixed top-0 w-full bg-stone-50/80 border-b border-stone-200 backdrop-blur-md supports-backdrop-filter:bg-stone-50/60 z-50">
      <nav className="container mx-auto h-16 px-4 flex justify-between items-center">
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center group gap-2"
        >
          <Image
            src="/logo-orange.png"
            alt="Servd Logo"
            width={60}
            height={60}
            className="w-16"
          />
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-stone-600 text-sm font-medium">
          <Link
            href="/recipes"
            className="hover:text-orange-600 flex items-center transition-colors gap-1.5"
          >
            <Cookie className="w-4 h-4" />
            My Recipes
          </Link>

          <Link
            href="/pantry"
            className="hover:text-orange-600 flex items-center transition-colors gap-1.5"
          >
            <Refrigerator className="w-4 h-4" />
            My Pantry
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <HowToCookModal />

          <Show when="signed-in">
            {user && (
              <PricingModal subscriptionTier={user.subscriptionTier}>
                <Badge
                  variant="outline"
                  className={`flex text-xs font-semibold rounded-full transition-all h-8 px-3 gap-1.5 ${
                    user.subscriptionTier === "pro"
                      ? "bg-linear-to-r from-orange-600 to-amber-500 text-white shadow-sm border-none"
                      : "bg-stone-200/50 text-stone-600 border-stone-200 cursor-pointer hover:bg-stone-300/50 hover:border-stone-300"
                  }`}
                >
                  <Sparkles
                    className={`w-3 h-3 ${
                      user.subscriptionTier === "pro"
                        ? "text-white fill-white/20"
                        : "text-stone-500"
                    }`}
                  />

                  <span>
                    {user.subscriptionTier === "pro" ? "Pro Chef" : "Free plan"}
                  </span>
                </Badge>
              </PricingModal>
            )}

            <UserDropdown />
          </Show>

          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                className="text-stone-600 hover:text-orange-600 hover:bg-orange-50 font-medium"
              >
                Sign In
              </Button>
            </SignInButton>

            <SignUpButton mode="modal">
              <Button variant="primary" className="rounded-full px-6">
                Get Started
              </Button>
            </SignUpButton>
          </Show>
        </div>
      </nav>
    </header>
  );
}
