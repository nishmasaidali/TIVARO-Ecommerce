
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

import { useAuth } from "./authcontext";
import axiosInstance from "../api/axiosinstance";

const CartContext = createContext();

function showToast(message, type = "success", title) {
  window.dispatchEvent(
    new CustomEvent("tivaro-toast", {
      detail: { message, type, title },
    })
  );
}

export function CartProvider({ children }) {
  const { currentUser } = useAuth();

  const userId =
    currentUser?.id != null
      ? String(currentUser.id)
      : null;

  const [cartData, setCartData] = useState({
    userId: null,
    items: [],
    loaded: false,
  });

  // Store each user's cart record ID
  const cartRecords = useRef({});

  // Keep backend updates in order
  const saveQueue = useRef(Promise.resolve());

  // Load cart from db.json
  useEffect(() => {
    let active = true;

    if (!userId) {
      setCartData({
        userId: null,
        items: [],
        loaded: true,
      });
      return;
    }

    setCartData({
      userId,
      items: [],
      loaded: false,
    });

    async function fetchCart() {
      try {
        const response = await axiosInstance.get("/cart", {
          params: { userId },
        });

        const savedCart = response.data[0] || null;

        if (!active) return;

        if (savedCart) {
          cartRecords.current[userId] = savedCart;
        }

        setCartData({
          userId,
          items: savedCart?.items || [],
          loaded: true,
        });
      } catch (error) {
        console.error("Error loading cart:", error);

        if (active) {
          setCartData({
            userId,
            items: [],
            loaded: true,
          });

          showToast(
            "Unable to load your cart.",
            "error",
            "Cart Error"
          );
        }
      }
    }

    fetchCart();

    return () => {
      active = false;
    };
  }, [userId]);

  // Show cart only for the logged-in user
  const cart =
    userId &&
    cartData.userId === userId &&
    cartData.loaded
      ? cartData.items
      : [];

  // Save cart in db.json
  const saveCartToDB = (targetUserId, items) => {
    const operation = saveQueue.current.then(async () => {
      const savedCart = cartRecords.current[targetUserId];

      if (savedCart) {
        await axiosInstance.patch(
          `/cart/${savedCart.id}`,
          { items }
        );
      } else {
        const response = await axiosInstance.post("/cart", {
          userId: targetUserId,
          items,
        });

        cartRecords.current[targetUserId] = response.data;
      }
    });

    saveQueue.current = operation.catch((error) => {
      console.error("Error saving cart:", error);

      showToast(
        "Unable to save your cart. Please try again.",
        "error",
        "Cart Error"
      );
    });

    return saveQueue.current;
  };

  // Update cart
  const setCart = (newCart) => {
    if (
      !userId ||
      cartData.userId !== userId ||
      !cartData.loaded
    ) {
      return;
    }

    const updatedCart =
      typeof newCart === "function"
        ? newCart(cartData.items)
        : newCart;

    setCartData((previous) => ({
      ...previous,
      items: updatedCart,
    }));

    saveCartToDB(userId, updatedCart);
  };

  // Check whether product is already in cart
  const isInCart = (productId) => {
    return cart.some(
      (item) => String(item.id) === String(productId)
    );
  };

  // Add product to cart
  const addToCart = (product) => {
    if (!userId) {
      showToast(
        "Please login to add products to your cart.",
        "info",
        "Login Required"
      );
      return;
    }

    if (!cartData.loaded || cartData.userId !== userId) {
      showToast(
        "Please wait while your cart loads.",
        "info",
        "Loading Cart"
      );
      return;
    }

    const stock = Number(product.stock ?? 0);

    if (!Number.isFinite(stock) || stock <= 0) {
      showToast(
        "This watch is currently out of stock.",
        "error",
        "Out of Stock"
      );
      return;
    }

    const alreadyExists = isInCart(product.id);

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

  // Remove product
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

  // Clear cart after checkout
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
        isCartLoading: !cartData.loaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
