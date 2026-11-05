
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const CartContext = createContext();

function getCurrentUserKey() {
  try {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (user) {
      return user.id || user.email;
    }

    return "guest";
  } catch {
    return "guest";
  }
}

function getSavedCart(userKey) {
  try {
    const savedCart = localStorage.getItem(`cart_${userKey}`);

    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartData, setCartData] = useState(() => {
    const userKey = getCurrentUserKey();

    return {
      userKey,
      items: getSavedCart(userKey),
    };
  });

  const cart = cartData.items;

  // Listen for login, logout and account changes
  useEffect(() => {
    function handleUserChange() {
      const userKey = getCurrentUserKey();

      setCartData({
        userKey,
        items: getSavedCart(userKey),
      });
    }

    window.addEventListener("authChanged", handleUserChange);

    return () => {
      window.removeEventListener("authChanged", handleUserChange);
    };
  }, []);

  // Save cart separately for each user
  useEffect(() => {
    const currentUserKey = getCurrentUserKey();

    if (cartData.userKey === currentUserKey) {
      localStorage.setItem(
        `cart_${cartData.userKey}`,
        JSON.stringify(cartData.items)
      );
    }
  }, [cartData]);

  // Update cart
  const setCart = (newCart) => {
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

  // Add product only once
  const addToCart = (product) => {
    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) => String(item.id) === String(product.id)
      );

      // If product already exists, do not increase quantity
      if (existingProduct) {
        return previousCart;
      }

      // Save the quantity selected on Product Details page
      return [
        ...previousCart,
        {
          ...product,
          quantity: Math.max(1, Number(product.quantity) || 1),
        },
      ];
    });
  };

  // Remove product completely
  const removeFromCart = (productId) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) => String(item.id) !== String(productId)
      )
    );
  };

  // Increase or decrease quantity
  const updateQuantity = (productId, action) => {
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
