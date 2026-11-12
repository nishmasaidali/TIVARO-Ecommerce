
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

import { useAuth } from "./authcontext";
import axiosInstance from "../api/axiosinstance";

const WishlistContext = createContext();

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

  const userId =
    currentUser?.id != null
      ? String(currentUser.id)
      : null;

  const [wishlistData, setWishlistData] = useState({
    userId: null,
    items: [],
    loaded: false,
  });

  // Store each user's wishlist record ID
  const wishlistRecords = useRef({});

  // Keep backend updates in order
  const saveQueue = useRef(Promise.resolve());

  // Load wishlist from db.json
  useEffect(() => {
    let active = true;

    if (!userId) {
      setWishlistData({
        userId: null,
        items: [],
        loaded: true,
      });
      return;
    }

    setWishlistData({
      userId,
      items: [],
      loaded: false,
    });

    async function fetchWishlist() {
      try {
        const response = await axiosInstance.get("/wishlist", {
          params: { userId },
        });

        const savedWishlist = response.data[0] || null;

        if (!active) return;

        if (savedWishlist) {
          wishlistRecords.current[userId] = savedWishlist;
        }

        setWishlistData({
          userId,
          items: savedWishlist?.items || [],
          loaded: true,
        });
      } catch (error) {
        console.error("Error loading wishlist:", error);

        if (active) {
          setWishlistData({
            userId,
            items: [],
            loaded: true,
          });

          showToast(
            "Unable to load your wishlist.",
            "error"
          );
        }
      }
    }

    fetchWishlist();

    return () => {
      active = false;
    };
  }, [userId]);

  // Display only the logged-in user's wishlist
  const wishlist =
    userId &&
    wishlistData.userId === userId &&
    wishlistData.loaded
      ? wishlistData.items
      : [];

  // Save wishlist in db.json
  const saveWishlistToDB = (targetUserId, items) => {
    const operation = saveQueue.current.then(async () => {
      const savedWishlist =
        wishlistRecords.current[targetUserId];

      if (savedWishlist) {
        await axiosInstance.patch(
          `/wishlist/${savedWishlist.id}`,
          { items }
        );
      } else {
        const response = await axiosInstance.post(
          "/wishlist",
          {
            userId: targetUserId,
            items,
          }
        );

        wishlistRecords.current[targetUserId] =
          response.data;
      }
    });

    saveQueue.current = operation.catch((error) => {
      console.error("Error saving wishlist:", error);

      showToast(
        "Unable to save your wishlist. Please try again.",
        "error"
      );
    });

    return saveQueue.current;
  };

  // Update wishlist
  const setWishlist = (newWishlist) => {
    if (
      !userId ||
      wishlistData.userId !== userId ||
      !wishlistData.loaded
    ) {
      return;
    }

    const updatedWishlist =
      typeof newWishlist === "function"
        ? newWishlist(wishlistData.items)
        : newWishlist;

    setWishlistData((previous) => ({
      ...previous,
      items: updatedWishlist,
    }));

    saveWishlistToDB(userId, updatedWishlist);
  };

  // Add product to wishlist
  const addToWishlist = (product) => {
    if (!userId) {
      showToast(
        "Please login to add products to your wishlist.",
        "info"
      );
      return;
    }

    if (
      !wishlistData.loaded ||
      wishlistData.userId !== userId
    ) {
      showToast(
        "Please wait while your wishlist loads.",
        "info"
      );
      return;
    }

    const exists = wishlist.some(
      (item) => String(item.id) === String(product.id)
    );

    if (exists) {
      showToast(
        "This product is already in your wishlist.",
        "info"
      );
      return;
    }

    const updatedWishlist = [
      ...wishlist,
      product,
    ];

    setWishlist(updatedWishlist);

    showToast(
      `${product.name || "Product"} added to your wishlist.`,
      "wishlist"
    );
  };

  // Remove product from wishlist
  const removeFromWishlist = (productId) => {
    if (!userId || wishlistData.userId !== userId) {
      return;
    }

    const updatedWishlist = wishlist.filter(
      (item) => String(item.id) !== String(productId)
    );

    setWishlist(updatedWishlist);

    showToast(
      "Product removed from your wishlist.",
      "info"
    );
  };

  // Check whether product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(
      (item) => String(item.id) === String(productId)
    );
  };

  // Clear wishlist
  const clearWishlist = () => {
    if (!userId || wishlistData.userId !== userId) {
      return;
    }

    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        isWishlistLoading: !wishlistData.loaded,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
