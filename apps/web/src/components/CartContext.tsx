import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";

type CartItem = {
  productId: string;
  productSlug: string;
  productName: string;
  image: string;
  variantId: string;
  sku: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  priceLabel: string;
};

type AddCartItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: AddCartItemInput) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
};

const storageKey = "ecowear-cart";

const CartContext = createContext<CartContextValue | undefined>(undefined);

function readStoredCart() {
  if (typeof window === "undefined") {
    return [] as CartItem[];
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return [] as CartItem[];
  }

  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [] as CartItem[];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const value: CartContextValue = {
    items,
    itemCount,
    subtotal,
    addItem: (item) => {
      setItems((currentItems) => {
        const quantity = item.quantity ?? 1;
        const existingItem = currentItems.find((entry) => entry.variantId === item.variantId);

        if (existingItem) {
          return currentItems.map((entry) =>
            entry.variantId === item.variantId
              ? { ...entry, quantity: entry.quantity + quantity }
              : entry
          );
        }

        return [...currentItems, { ...item, quantity }];
      });
    },
    updateQuantity: (variantId, quantity) => {
      setItems((currentItems) =>
        currentItems
          .map((item) =>
            item.variantId === variantId ? { ...item, quantity: Math.max(1, quantity) } : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    removeItem: (variantId) => {
      setItems((currentItems) => currentItems.filter((item) => item.variantId !== variantId));
    },
    clearCart: () => {
      setItems([]);
    }
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

export type { CartItem, AddCartItemInput };
