
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { useAuth } from "./authcontext";

const CartContext = createContext();

function getUserKey(user) {
  if (!user) return null;

  const userId = user.id ?? user.email;

  return userId ? String(userId) : null;
}

function getSavedCart(userKey) {
  if (!userKey) return [];

  try {
    const savedCart = localStorage.getItem(`cart_${userKey}`);
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];

    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
}

function showToast(message, type = "success", title) {
  window.dispatchEvent(
    new CustomEvent("tivaro-toast", {
      detail: { message, type, title },
    })
  );
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth();

  const userKey = getUserKey(currentUser);

  const [cartData, setCartData] = useState(() => ({
    userKey,
    items: getSavedCart(userKey),
  }));

  // Load the correct cart whenever the logged-in user changes
  useEffect(() => {
    if (!userKey) {
      setCartData({
        userKey: null,
        items: [],
      });
      return;
    }

    setCartData({
      userKey,
      items: getSavedCart(userKey),
    });
  }, [userKey]);

  // Show cart only when it belongs to the current user
  const cart =
    userKey && cartData.userKey === userKey
      ? cartData.items
      : [];

  // Save cart separately for each user
  useEffect(() => {
    if (!userKey || cartData.userKey !== userKey) return;

    localStorage.setItem(
      `cart_${userKey}`,
      JSON.stringify(cartData.items)
    );
  }, [cartData, userKey]);

  // Update cart
  const setCart = (newCart) => {
    if (!userKey || cartData.userKey !== userKey) return;

    setCartData((previous) => ({
      ...previous,
      items:
        typeof newCart === "function"
          ? newCart(previous.items)
          : newCart,
    }));
  };

  // Check whether a product is already in cart
  const isInCart = (productId) => {
    return cart.some(
      (item) => String(item.id) === String(productId)
    );
  };

  // Add product only when stock is available
  const addToCart = (product) => {
    if (!userKey || cartData.userKey !== userKey) {
      showToast(
        "Please login to add products to your cart.",
        "info",
        "Login Required"
      );
      return;
    }

    const stock = Number(product.stock ?? 0);

    // Check stock
    if (!Number.isFinite(stock) || stock <= 0) {
      showToast(
        "This watch is currently out of stock.",
        "error",
        "Out of Stock"
      );
      return;
    }

    // Check whether product already exists
    const alreadyExists = cart.some(
      (item) => String(item.id) === String(product.id)
    );

    if (alreadyExists) {
      showToast(
        "This product is already in your cart.",
        "info",
        "Already Added"
      );
      return;
    }

    const requestedQuantity = Math.max(
      1,
      Number(product.quantity) || 1
    );

    // Prevent adding more than available stock
    if (requestedQuantity > stock) {
      showToast(
        `Only ${stock} watches are available.`,
        "error",
        "Insufficient Stock"
      );
      return;
    }

    setCart((previousCart) => [
      ...previousCart,
      {
        ...product,
        quantity: requestedQuantity,
      },
    ]);

    showToast(
      `${product.name || "Product"} added to your cart.`,
      "success",
      "Added to Cart"
    );
  };

  // Remove product completely
  const removeFromCart = (productId) => {
    const product = cart.find(
      (item) => String(item.id) === String(productId)
    );

    if (!product) return;

    setCart((previousCart) =>
      previousCart.filter(
        (item) => String(item.id) !== String(productId)
      )
    );

    showToast(
      `${product.name || "Product"} removed from your cart.`,
      "info",
      "Removed from Cart"
    );
  };

  // Increase or decrease quantity
  const updateQuantity = (productId, action) => {
    const product = cart.find(
      (item) => String(item.id) === String(productId)
    );

    if (!product) return;

    if (action === "increase") {
      const stock = Number(product.stock ?? 0);

      if (product.quantity >= stock) {
        showToast(
          `Only ${stock} watches are available.`,
          "error",
          "Stock Limit Reached"
        );
        return;
      }
    }

    setCart((previousCart) =>
      previousCart.map((item) => {
        if (String(item.id) !== String(productId)) {
          return item;
        }

        return {
          ...item,
          quantity:
            action === "increase"
              ? item.quantity + 1
              : Math.max(1, item.quantity - 1),
        };
      })
    );
  };

  // Clear cart after placing an order
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        isInCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
