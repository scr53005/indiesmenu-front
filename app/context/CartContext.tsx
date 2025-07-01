// app/context/CartContext.tsx
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: string; // Decimal from Prisma
  quantity: number;
  options: { [key: string]: string }; // e.g., { size: 'large', cuisson: 'medium' }
  table: string;
};

// Define the shape of the cart context state and actions
interface CartContextType {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void; // Updated for unique item identification
  updateQuantity: (id: string, newQuantity: number, options?: { [key: string]: string }, table?: string) => void; // Updated
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => string;
}

// Create the context with a default undefined value (it will be provided by CartProvider)
const CartContext = createContext<CartContextType>({
  cart: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getTotalItems: () => 0,
  getTotalPrice: () => '0.00',
});

/* from Grok
const CartContext = createContext<{
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
}>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
}); */

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Optional: Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      // Fallback to empty cart if there's an issue with localStorage
      setCart([]);
    }
  }, []);

  // Optional: Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  // Helper function for deep comparison of options (important for unique items)
  const areOptionsEqual = (opts1: { [key: string]: string }, opts2: { [key: string]: string }) => {
    const keys1 = Object.keys(opts1);
    const keys2 = Object.keys(opts2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      if (opts1[key] !== opts2[key]) {
        return false;
      }
    }
    return true;
  };

  /*
  from Grok
  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }; */

  const addItem = (item: CartItem) => {
    console.log('Adding item to cart:', item); // Debug log
    // Default options and table if not provided
    const defaultOptions = item.options || {};
    const defaultTable = item.table || '203'; // Or some other default table ID

    /* from Gemini
    setCart((prevCart) => {
      // Find an existing item that matches by ID, options, AND table
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.id === item.id &&
          areOptionsEqual(cartItem.options, defaultOptions) &&
          cartItem.table === defaultTable
      );

      if (existingItemIndex > -1) {
        // If item exists, update its quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantityToAdd,
        };
        return updatedCart;
      } else {
        // If item is new, add it to the cart with default options/table
        return [...prevCart, {
          ...item,
          quantity: quantityToAdd,
          options: defaultOptions,
          table: defaultTable
        } as CartItem]; // Cast to CartItem to ensure all properties are present
      }
    });*/
    setCart((prev) => {
      const existingItem = prev.find((i) => i.id === item.id && i.options.size === item.options.size);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id && i.options.size === item.options.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });

  };

  // Updated removeItem to consider options and table for uniqueness
  const removeItem = (id: string) => {
    console.log('Removing item:', id); // Debug log
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  /* from Gemini
  // Updated updateQuantity to consider options and table for uniqueness
  const updateQuantity = (id: string, newQuantity: number, options: { [key: string]: string } = {}, table: string = 'default') => {
    setCart((prevCart) => {
      const itemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.id === id &&
          areOptionsEqual(cartItem.options, options) &&
          cartItem.table === table
      );

      if (itemIndex === -1) {
        return prevCart; // Item not found
      }

      if (newQuantity <= 0) {
        // If quantity is 0 or less, remove the item
        return prevCart.filter((_, idx) => idx !== itemIndex);
      } else {
        // Otherwise, update the quantity
        const updatedCart = [...prevCart];
        updatedCart[itemIndex] = { ...updatedCart[itemIndex], quantity: newQuantity };
        return updatedCart;
      }
    });
  };
*/

  const updateQuantity = (id: string, newQuantity: number) => {
    console.log('Updating quantity:', id, newQuantity); // Debug log
    if (newQuantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    console.log('Clearing cart'); // Debug log
    setCart([]);
    localStorage.removeItem('cart'); // Clear localStorage as well
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart
      .reduce((total, item) => {
        const price = parseFloat(item.price);
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to consume the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}