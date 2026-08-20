import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/lib/types";
import { useUIStore } from "./ui.store";
import { calculateShippingFee } from "@/lib/shipping";

export interface CartItem {
  id: string; // product.id or product.id + "-" + variantName
  productId: string;
  product: Product;
  variantName?: string;
  unitPrice: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variantName?: string, unitPrice?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  getTotalItems: () => number;
  getSubtotal: () => number;
  getShippingFee: (postcode?: string | number | null) => number;
  getTotal: (postcode?: string | number | null) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, variantName, unitPrice) => {
        const itemUnitPrice = unitPrice ?? product.price;
        const itemId = variantName ? `${product.id}-${variantName}` : product.id;

        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item.id === itemId);

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          const newItem: CartItem = {
            id: itemId,
            productId: product.id,
            product,
            variantName,
            unitPrice: itemUnitPrice,
            quantity,
          };
          set({ items: [...currentItems, newItem] });
        }

        const toastMsg = variantName
          ? `Added ${quantity}x ${product.name} (${variantName}) to cart!`
          : `Added ${quantity}x ${product.name} to cart!`;
        useUIStore.getState().addToast(toastMsg, "success");
      },

      removeItem: (id) => {
        const itemToRemove = get().items.find((item) => item.id === id);
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
        if (itemToRemove) {
          useUIStore.getState().addToast(`Removed ${itemToRemove.product.name} from cart`, "info");
        }
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },

      getShippingFee: (postcode?: string | number | null) => {
        const subtotal = get().getSubtotal();
        return calculateShippingFee(subtotal, postcode);
      },

      getTotal: (postcode?: string | number | null) => {
        return get().getSubtotal() + get().getShippingFee(postcode);
      },
    }),
    {
      name: "flavour-and-co-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
