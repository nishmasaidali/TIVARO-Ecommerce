
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosinstance";

const AdminUsers = () => {
  const queryClient = useQueryClient();

  // Fetch users
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users");
      return response.data;
    },
  });

  // Block or unblock user
  const userMutation = useMutation({
    mutationFn: async ({ id, blocked }) => {
      return axiosInstance.patch(`/users/${id}`, {
        blocked,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["adminUsers"],
      });
    },
  });

  // Handle block and unblock
  const handleToggleBlock = (user) => {
    const action = user.blocked ? "unblock" : "block";

    const confirmAction = window.confirm(
      `Are you sure you want to ${action} this user?`
    );

    if (confirmAction) {
      userMutation.mutate({
        id: user.id,
        blocked: !user.blocked,
      });
    }
  };

  if (isLoading) {
    return <p className="text-[#766657]">Loading users...</p>;
  }

  if (isError) {
    return <p className="text-red-600">Failed to load users.</p>;
  }

  return (
    <div>
      {/* Page Heading */}
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-semibold text-[#30251E]">
          User Management
        </h2>

        <p className="text-sm text-[#766657] mt-2">
          View and manage registered customers.
        </p>
      </div>

      {/* Total Users */}
      <div className="bg-white p-5 rounded-xl border border-[#D9CBB7] mb-6">
        <p className="text-sm text-[#766657]">Total Registered Users</p>

        <h3 className="text-3xl font-semibold text-[#30251E] mt-2">
          {users.length}
        </h3>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-[#D9CBB7] overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F4EFE5]">
            <tr>
              <th className="px-5 py-4">ID</th>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Phone</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-[#766657]">
                  No registered users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-[#E5D8C5] hover:bg-[#FAF8F4]"
                >
                  <td className="px-5 py-4">{user.id}</td>
                  <td className="px-5 py-4">{user.name || "N/A"}</td>
                  <td className="px-5 py-4">{user.email || "N/A"}</td>
                  <td className="px-5 py-4">{user.phone || "N/A"}</td>

                  {/* User Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        user.blocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.blocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleBlock(user)}
                      disabled={userMutation.isPending}
                      className={`font-medium hover:underline disabled:opacity-50 ${
                        user.blocked
                          ? "text-green-700"
                          : "text-red-600"
                      }`}
                    >
                      {user.blocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Error Message */}
      {userMutation.isError && (
        <p className="text-red-600 text-sm mt-4">
          Failed to update user status. Please try again.
        </p>
      )}

      {userMutation.isPending && (
        <p className="text-[#766657] text-sm mt-4">
          Updating user status...
        </p>
      )}
    </div>
  );
};

export default AdminUsers;
