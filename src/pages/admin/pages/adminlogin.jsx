
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../../context/adminauthcontext";

const AdminLogin = () => {
  const navigate = useNavigate();

  const { loginAdmin } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await loginAdmin(email, password);

      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE5] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#30251E]">
            TIVARO
          </h1>

          <p className="text-sm tracking-[3px] text-[#A17D49] mt-2">
            ADMIN PANEL
          </p>

          <h2 className="text-xl font-semibold text-[#30251E] mt-6">
            Admin Login
          </h2>

          <p className="text-sm text-[#766657] mt-2">
            Sign in to manage your store
          </p>
        </div>

        <form onSubmit={handleLogin}>

          <div className="mb-5">
            <label className="block text-sm font-medium text-[#30251E] mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
              className="w-full border border-[#D9CBB7] rounded-lg px-4 py-3 outline-none focus:border-[#A17D49]"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-[#30251E] mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full border border-[#D9CBB7] rounded-lg px-4 py-3 outline-none focus:border-[#A17D49]"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#30251E] text-white py-3 rounded-lg hover:bg-[#A17D49] transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-xs text-[#766657] mt-6">
          TIVARO · THE VINTAGE COLLECTION
        </p>

      </div>
    </div>
  );
};

export default AdminLogin;
