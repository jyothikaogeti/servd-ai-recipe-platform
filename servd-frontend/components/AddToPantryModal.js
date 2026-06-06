"use client";

import { useState } from "react";
import { Camera, Check, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

import {
  addPantryItemManually,
  saveToPantry,
  scanPantryImage,
} from "@/actions/pantry.actions";
import { useFetch } from "@/hooks/useFetch";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ImageUploader from "./ImageUploader";

export default function AddToPantryModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("scan");
  const [selectedImage, setSelectedImage] = useState(null);
  const [scannedIngredients, setScannedIngredients] = useState([]);
  const [manualItem, setManualItem] = useState({ name: "", quantity: "" });

  // Scan Image
  const {
    isLoading: isScanningImage,
    data: scanImageData,
    execute: scanImage,
  } = useFetch(scanPantryImage);

  // Save Scanned Items
  const {
    isLoading: isSavingScannedItems,
    data: savedScannedItemsData,
    execute: saveScannedItems,
  } = useFetch(saveToPantry);

  // Add Manual Item
  const {
    isLoading: isAddingManualItem,
    data: addManualItemData,
    execute: addManualItem,
  } = useFetch(addPantryItemManually);

  // Handle Modal Close
  const handleModalClose = () => {
    setActiveTab("scan");
    setSelectedImage(null);
    setScannedIngredients([]);
    setManualItem({ name: "", quantity: "" });
    onClose();
  };

  // Handle Image Selection
  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setScannedIngredients([]);
  };

  // Handle Scan Image
  const handleScanImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    const response = await scanImage(formData);

    if (response?.success) {
      setScannedIngredients(response.data);
      toast.success(response.message);
    }
  };
  // Handle Save Scanned Items
  const handleSaveScannedItems = async () => {
    if (scannedIngredients.length === 0) {
      toast.error("No Ingredients to Save");
      return;
    }

    const formData = new FormData();
    formData.append("ingredients", JSON.stringify(scannedIngredients));

    const response = await saveScannedItems(formData);

    if (response?.success) {
      toast.success(response.message);
      handleModalClose();
      onSuccess?.();
    }
  };

  // Handle Add Manual Item
  const handleAddManualItem = async (e) => {
    e.preventDefault();

    if (!manualItem.name.trim() || !manualItem.quantity.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", manualItem.name);
    formData.append("quantity", manualItem.quantity);

    const response = await addManualItem(formData);

    if (response?.success) {
      toast.success(response.message);
      setManualItem({ name: "", quantity: "" });
      handleModalClose();
      onSuccess?.();
    }
  };

  // Handle Remove Ingredient
  const handleRemoveIngredient = (index) => {
    setScannedIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Add to Pantry
          </DialogTitle>

          <DialogDescription>
            Scan your Pantry with AI or Add Items Manually
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="scan" className="gap-2">
              <Camera className="w-4 h-4" />
              AI Scan
            </TabsTrigger>

            <TabsTrigger value="manual" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Manually
            </TabsTrigger>
          </TabsList>

          {/* AI Scan */}
          <TabsContent value="scan" className="space-y-6 mt-6">
            {scannedIngredients.length === 0 ? (
              // Upload & Scan
              <div className="space-y-4">
                <ImageUploader
                  onImageSelect={handleImageSelect}
                  loading={isScanningImage}
                />

                {selectedImage && !isScanningImage && (
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700 text-lg text-white h-12"
                    onClick={handleScanImage}
                    disabled={isScanningImage}
                  >
                    {isScanningImage ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5 mr-2" />
                        Scan Image
                      </>
                    )}
                  </Button>
                )}
              </div>
            ) : (
              // Review & Save
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg text-stone-900 font-bold">
                      Review Detected Items
                    </h3>
                    <p className="text-stone-600 text-sm">
                      Found {scannedIngredients.length} Ingredients
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      setSelectedImage(null);
                      setScannedIngredients([]);
                    }}
                  >
                    <Camera className="w-4 h-4" />
                    Scan Again
                  </Button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {scannedIngredients.map((ingredient, i) => (
                    <div
                      key={i}
                      className="bg-stone-50 border border-stone-200 rounded-xl flex items-center gap-3 p-4"
                    >
                      <div className="flex-1">
                        <div className="text-stone-900 font-medium">
                          {ingredient.name}
                        </div>

                        <div className="text-stone-500 text-sm">
                          {ingredient.quantity}
                        </div>
                      </div>

                      {ingredient.confidence && (
                        <Badge
                          variant="outline"
                          className="text-green-700 text-xs border-green-200"
                        >
                          {Math.round(ingredient.confidence * 100)}%
                        </Badge>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-stone-600 hover:text-red-600"
                        onClick={() => handleRemoveIngredient(i)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white w-full h-12"
                  onClick={handleSaveScannedItems}
                  disabled={
                    isSavingScannedItems || scannedIngredients.length === 0
                  }
                >
                  {isSavingScannedItems ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Save {scannedIngredients.length} Items to Pantry
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Add Manual */}
          <TabsContent value="manual" className="mt-6">
            <form className="space-y-4" onSubmit={handleAddManualItem}>
              <div>
                <label className="text-stone-700 text-sm font-medium block mb-2">
                  Ingredient Name
                </label>

                <input
                  type="text"
                  value={manualItem.name}
                  placeholder="e.g., Chicken Breast"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isAddingManualItem}
                  onChange={(e) =>
                    setManualItem({ ...manualItem, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-stone-700 text-sm font-medium block mb-2">
                  Quantity
                </label>

                <input
                  type="text"
                  value={manualItem.quantity}
                  placeholder="e.g., 500g, 2 cups, 3 pieces"
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={isAddingManualItem}
                  onChange={(e) =>
                    setManualItem({ ...manualItem, quantity: e.target.value })
                  }
                />
              </div>

              <Button
                type="submit"
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white w-full h-12"
                disabled={isAddingManualItem}
              >
                {isAddingManualItem ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Add Item
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
