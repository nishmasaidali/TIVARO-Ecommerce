
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { useAuth } from "./authcontext";

const WishlistContext = createContext();

// Get unique key for each user
function getUserKey(user) {
  if (!user) return null;

  return user.id
    ? String(user.id)
    : user.email
      ? String(user.email).trim().toLowerCase()
      : null;
}

// Read saved wishlist
function getSavedWishlist(user, userKey) {
  if (!userKey) return [];

  try {
    const idKey = `wishlist_${userKey}`;
    const savedData = localStorage.getItem(idKey);

    if (savedData !== null) {
      const products = JSON.parse(savedData);
      return Array.isArray(products) ? products : [];
    }

    // Migrate old email-based wishlist if ID storage does not exist
    if (user?.email) {
      const emailKey = `wishlist_${user.email.trim().toLowerCase()}`;
      const emailData = localStorage.getItem(emailKey);

      if (emailData !== null) {
        const products = JSON.parse(emailData);
        const validProducts = Array.isArray(products) ? products : [];

        localStorage.setItem(idKey, JSON.stringify(validProducts));

        return validProducts;
      }
    }

    return [];
  } catch (error) {
    console.error("Wishlist loading error:", error);
    return [];
  }
}

// Toast message
function showToast(message, type = "wishlist") {
  window.dispatchEvent(
    new CustomEvent("tivaro-toast", {
      detail: { message, type },
    })
  );
}

export function WishlistProvider({ children }) {
  const { currentUser } = useAuth();

  const userKey = getUserKey(currentUser);

  const [wishlistData, setWishlistData] = useState({
    userKey: null,
    items: [],
  });

  // Load wishlist whenever the logged-in user changes
  useEffect(() => {
    if (!userKey) {
      setWishlistData({
        userKey: null,
        items: [],
      });
      return;
    }

    const savedProducts = getSavedWishlist(currentUser, userKey);

    setWishlistData({
      userKey,
      items: savedProducts,
    });
  }, [userKey]);

  // Display only the wishlist belonging to the current user
  const wishlist =
    userKey && wishlistData.userKey === userKey
      ? wishlistData.items
      : [];

  // Add product
  const addToWishlist = (product) => {
    if (!userKey || wishlistData.userKey !== userKey) {
      showToast("Please login to add products to your wishlist.", "info");
      return;
    }

    const exists = wishlistData.items.some(
      (item) => String(item.id) === String(product.id)
    );

    if (exists) {
      showToast("This product is already in your wishlist.", "info");
      return;
    }

    const updatedWishlist = [...wishlistData.items, product];

    // Save immediately
    localStorage.setItem(
      `wishlist_${userKey}`,
      JSON.stringify(updatedWishlist)
    );

    setWishlistData({
      userKey,
      items: updatedWishlist,
    });

    showToast(
      `${product.name || "Product"} added to your wishlist.`,
      "wishlist"
    );
  };

  // Remove product
  const removeFromWishlist = (productId) => {
    if (!userKey || wishlistData.userKey !== userKey) return;

    const updatedWishlist = wishlistData.items.filter(
      (item) => String(item.id) !== String(productId)
    );

    localStorage.setItem(
      `wishlist_${userKey}`,
      JSON.stringify(updatedWishlist)
    );

    setWishlistData({
      userKey,
      items: updatedWishlist,
    });

    showToast("Product removed from your wishlist.", "info");
  };

  // Check whether product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(
      (item) => String(item.id) === String(productId)
    );
  };

  // Clear wishlist only when explicitly requested
  const clearWishlist = () => {
    if (!userKey || wishlistData.userKey !== userKey) return;

    localStorage.setItem(
      `wishlist_${userKey}`,
      JSON.stringify([])
    );

    setWishlistData({
      userKey,
      items: [],
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
