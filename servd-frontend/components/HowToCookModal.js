"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function HowToCookModal() {
  const router = useRouter();

  const [recipeName, setRecipeName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    if (!recipeName.trim()) {
      toast.error("Please Enter a Recipe Name");
      return;
    }

    router.push(`/recipe?cook=${encodeURIComponent(recipeName.trim())}`);
    handleOpenChange(false);
  };

  const handleOpenChange = (open) => {
    setIsModalOpen(open);
    if (!open) {
      setRecipeName("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="text-stone-600 text-sm font-medium flex items-center gap-1.5 transition-colors hover:text-orange-600">
          <ChefHat className="w-4 h-4" />
          How to Cook
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif font-bold flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-orange-600" />
            How to Cook ?
          </DialogTitle>

          <DialogDescription>
            Enter any recipe name and our AI Chef will guide you through the
            cooking process
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6 mt-4" onSubmit={handleModalSubmit}>
          <div>
            <label className="block text-stone-700 text-sm font-medium mb-2">
              What would you like to cook ?
            </label>

            <div className="relative">
              <input
                type="text"
                value={recipeName}
                placeholder="e.g., Chicken Biryani, Chocolate Cake, Pasta Carbonara"
                className="w-full text-stone-900 placeholder:text-stone-400 border border-stone-200 rounded-xl focus:outline-none focus: ring-2 focus:ring-orange-500 px-4 py-3 pr-12"
                onChange={(e) => setRecipeName(e.target.value)}
                autoFocus
              />
              <Search className="w-5 h-5 absolute top-1/2 right-4 text-stone-400 -translate-y-1/2" />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
            <h4 className="text-orange-900 text-sm font-semibold mb-2">
              💡 Try These:
            </h4>

            <div className="flex flex-wrap gap-2">
              {["Butter Chicken", "Chicken Biryani", "Chocolate Brownies"].map(
                (exampleRecipe) => (
                  <button
                    key={exampleRecipe}
                    type="button"
                    className="bg-white text-orange-700 text-sm border border-orange-200 rounded-full transition-colors px-3 py-1 hover:bg-orange-100"
                    onClick={() => setRecipeName(exampleRecipe)}
                  >
                    {exampleRecipe}
                  </button>
                ),
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white w-full h-12"
            disabled={!recipeName.trim()}
          >
            <ChefHat className="w-5 h-5 mr-2" />
            Get Recipe
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
