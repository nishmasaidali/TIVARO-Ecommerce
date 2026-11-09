
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/authcontext";
import axiosInstance from "../api/axiosinstance";

function showToast(message, type = "success", title = "Notification") {
  window.dispatchEvent(
    new CustomEvent("tivaro-toast", {
      detail: { message, type, title },
    })
  );
}

function Profile() {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  // Fetch logged-in user's details
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", currentUser?.id],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/users/${currentUser.id}`
      );
      return response.data;
    },
    enabled: !!currentUser?.id,
  });

  // Fill form with fetched details
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        pincode: user.pincode || "",
      });
    }
  }, [user]);

  // Update user details
  const updateProfile = useMutation({
    mutationFn: async (updatedData) => {
      const response = await axiosInstance.patch(
        `/users/${currentUser.id}`,
        updatedData
      );

      return response.data;
    },

    onSuccess: (updatedUser) => {
      // Update cached user details immediately
      queryClient.setQueryData(
        ["user", currentUser.id],
        updatedUser
      );

      // Refresh user details wherever this query is used
      queryClient.invalidateQueries({
        queryKey: ["user", currentUser.id],
      });

      showToast(
        "Your profile details have been updated successfully.",
        "success",
        "Profile Updated"
      );
    },

    onError: () => {
      showToast(
        "Unable to update your profile. Please try again.",
        "error",
        "Update Failed"
      );
    },
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateProfile.mutate(formData);
  }

  if (!currentUser) {
    return (
      <p className="py-20 text-center">
        Please login to view your profile.
      </p>
    );
  }

  if (isLoading) {
    return (
      <p className="py-20 text-center">
        Loading profile...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="py-20 text-center">
        Unable to load profile.
      </p>
    );
  }

  const fields = [
    { name: "name", label: "Full Name", type: "text" },
    { name: "email", label: "Email Address", type: "email" },
    { name: "phone", label: "Phone Number", type: "tel" },
    { name: "address", label: "Delivery Address", type: "text" },
    { name: "city", label: "City", type: "text" },
    { name: "pincode", label: "PIN Code", type: "text" },
  ];

  return (
    <div className="min-h-screen bg-[#F4EFE5] px-5 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 font-serif text-4xl text-[#30251E]">
          My Profile
        </h1>

        <p className="mb-8 text-sm text-[#766657]">
          Manage your personal information and delivery details.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 border border-[#D9CBB7] bg-[#E5D8C5] p-6 md:p-10"
        >
          <div className="grid gap-5 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="mb-2 block text-sm text-[#30251E]">
                  {field.label}
                </label>

                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#D9CBB7] bg-[#F4EFE5] px-4 py-3 text-sm text-[#30251E] outline-none focus:border-[#A17D49]"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="bg-[#30251E] px-8 py-3 text-sm text-white transition hover:bg-[#A17D49] disabled:opacity-50"
          >
            {updateProfile.isPending
              ? "Saving..."
              : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
