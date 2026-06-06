"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ChefHat,
  Edit2,
  Loader2,
  Package,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import {
  deletePantryItem,
  getPantryItems,
  updatePantryItem,
} from "@/actions/pantry.actions";
import { useFetch } from "@/hooks/useFetch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PricingModal from "@/components/PricingModal";
import AddToPantryModal from "@/components/AddToPantryModal";

export default function PantryPage() {
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemValues, setEditItemValues] = useState({
    name: "",
    quantity: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Items
  const {
    isLoading: isLoadingItems,
    data: itemsData,
    execute: fetchItems,
  } = useFetch(getPantryItems);

  // Delete Item
  const {
    isLoading: isDeletingItem,
    data: deleteData,
    execute: deleteItem,
  } = useFetch(deletePantryItem);

  // Update Item
  const {
    isLoading: isUpdatingItem,
    data: updateData,
    execute: updateItem,
  } = useFetch(updatePantryItem);

  // Fetch Items On Mount
  useEffect(() => {
    fetchItems();
  }, []);

  const pantryItems = itemsData?.data ?? [];

  // Handle Delete Item
  const handleDeleteItem = async (itemId) => {
    const formData = new FormData();
    formData.append("itemId", itemId);

    const response = await deleteItem(formData);

    if (response?.success) {
      toast.success(response.message);
      fetchItems();
    }
  };

  // Handle Start Editing Item
  const handlestartEditItem = async (item) => {
    setEditingItemId(item.documentId);
    setEditItemValues({
      name: item.name,
      quantity: item.quantity,
    });
  };

  // Handle Save Edit Item
  const handleSaveEditItem = async () => {
    if (!editingItemId) return;

    if (!editItemValues.name.trim() || !editItemValues.quantity.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("itemId", editingItemId);
    formData.append("name", editItemValues.name);
    formData.append("quantity", editItemValues.quantity);

    const response = await updateItem(formData);

    if (response?.success) {
      toast.success(response.message);
      setEditingItemId(null);
      setEditItemValues({ name: "", quantity: "" });
      fetchItems();
    }
  };

  // Handle Cancel Edit Item
  const handleCancelEditItem = () => {
    setEditingItemId(null);
    setEditItemValues({ name: "", quantity: "" });
  };

  // Handle Modal Success
  const handleModalSuccess = () => {
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 px-4">
      <div className="container max-w-5xl mx-auto">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Package className="w-16 h-16 text-orange-600" />

              <div>
                <h1 className="text-4xl md:text-5xl text-stone-900 font-bold tracking-tight">
                  My Pantry
                </h1>
                <p className="text-stone-600 font-light">
                  Manage your ingredients and discover what you can cook
                </p>
              </div>
            </div>

            {/* Add To Pantry Button - Desktop */}
            <Button
              size="lg"
              className="hidden md:flex bg-orange-600 text-white hover:bg-orange-700 gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-5 h-5" />
              Add to Pantry
            </Button>
          </div>

          {/* Add To Pantry Button - Mobile */}
          <Button
            size="lg"
            className="md:hidden w-full bg-orange-600 text-white hover:bg-orange-700 gap-2 mb-4"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            Add to Pantry
          </Button>

          {/* Usage Stats */}
          {itemsData?.scansLimit !== undefined && (
            <div className="bg-white border-2 border-stone-200 inline-flex items-center gap-3 px-4 py-3">
              <Sparkles className="w-5 h-5 text-orange-600" />

              <div className="text-sm">
                {itemsData.scansLimit === "unlimited" ? (
                  <>
                    <span className="text-green-600 font-bold">♾️</span>{" "}
                    <span className="text-stone-500">
                      Unlimited AI Scans (Pro Plan)
                    </span>
                  </>
                ) : (
                  <PricingModal>
                    <span className="text-stone-500 cursor-pointer">
                      Upgrade to Pro for Unlimited Pantry Scans
                    </span>
                  </PricingModal>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Card - Find Recipes */}
        {pantryItems.length > 0 && (
          <Link href="/pantry/recipes" className="block mb-8">
            <div className="bg-linear-to-br from-green-600 to-emerald-500 text-white border-2 border-emerald-700 hover:shadow-xl hover:-translate-y-1 cursor-pointer group p-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 border-2 border-white/30 group-hover:bg-white/30 transition-colors p-3">
                  <ChefHat className="w-8 h-8" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">
                    What Can I Cook Today?
                  </h3>
                  <p className="text-green-100 text-sm font-light">
                    Get AI-Powered Recipe Suggestions from your{" "}
                    {pantryItems.length}{" "}
                    {pantryItems.length === 1 ? "Ingredient" : "Ingredients"}
                  </p>
                </div>

                <div className="hidden sm:block">
                  <Badge className="bg-white/20 text-white font-bold border-2 border-white/30 uppercase tracking-wide px-2 py-2.5">
                    {pantryItems.length}{" "}
                    {pantryItems.length === 1 ? "Item" : "Items"}
                  </Badge>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Loading State */}
        {isLoadingItems && (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mb-4" />
            <p className="text-stone-500">Loading your Pantry...</p>
          </div>
        )}

        {/* Pantry Items Grid */}
        {!isLoadingItems && pantryItems.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-stone-900 font-bold">
                Your Ingredients
              </h2>

              <Badge
                variant="outline"
                className="text-stone-600 border-2 border-stone-900 font-bold uppercase tracking-wide px-2 py-2.5"
              >
                {pantryItems.length}{" "}
                {pantryItems.length === 1 ? "Item" : "Items"}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pantryItems.map((pantryItem) => (
                <div
                  key={pantryItem.documentId}
                  className="bg-white border-2 border-stone-200 hover:border-orange-600 hover:shadow-lg transition-all p-5"
                >
                  {editingItemId === pantryItem.documentId ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editItemValues.name}
                        placeholder="Ingredient Name"
                        className="w-full px-3 py-2 text-sm border-2 border-stone-200 focus:border-orange-600 focus:outline-none"
                        onChange={(e) =>
                          setEditItemValues({
                            ...editItemValues,
                            name: e.target.value,
                          })
                        }
                      />

                      <input
                        type="text"
                        value={editItemValues.quantity}
                        placeholder="Quantity"
                        className="w-full px-3 py-2 text-sm border-2 border-stone-200 focus:border-orange-600 focus:outline-none"
                        onChange={(e) =>
                          setEditItemValues({
                            ...editItemValues,
                            quantity: e.target.value,
                          })
                        }
                      />

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 border-2 border-green-700"
                          onClick={handleSaveEditItem}
                          disabled={isUpdatingItem}
                        >
                          {isUpdatingItem ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-2 border-stone-900 hover:bg-stone-900 hover:text-white"
                          onClick={handleCancelEditItem}
                          disabled={isUpdatingItem}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg text-stone-900 font-bold mb-1">
                            {pantryItem.name}
                          </h3>
                          <p className="text-stone-500 text-sm font-light">
                            {pantryItem.quantity}
                          </p>
                        </div>

                        <div className="flex gap-1">
                          <button
                            className="text-stone-600 hover:text-orange-600 border-2 border-transparent hover:border-orange-600 hover:bg-orange-50 transition-all p-2"
                            onClick={() => handlestartEditItem(pantryItem)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            className="text-stone-600 hover:text-red-600 border-2 border-transparent hover:border-red-600 hover:bg-red-50 transition-all p-2"
                            onClick={() =>
                              handleDeleteItem(pantryItem.documentId)
                            }
                            disabled={isDeletingItem}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-stone-400 text-xs">
                        Added{" "}
                        {new Date(pantryItem.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoadingItems && pantryItems.length === 0 && (
          <div className="bg-white text-center border-2 border-dashed border-stone-200 p-12">
            <div className="bg-orange-50 border-2 border-orange-200 flex justify-center items-center mx-auto w-20 h-20 mb-6">
              <Package className="w-10 h-10 text-orange-600" />
            </div>

            <h3 className="text-2xl text-stone-900 font-bold mb-2">
              Your Pantry is Empty
            </h3>

            <p className="text-stone-600 font-light max-w-md mx-auto mb-8">
              Start by scanning your pantry with AI or adding ingredients
              manually to discover amazing recipes!
            </p>

            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-5 h-5" />
              Add Your First Item
            </Button>
          </div>
        )}
      </div>

      <AddToPantryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
