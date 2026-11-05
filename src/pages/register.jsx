import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authcontext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // Check whether email already exists
      const usersResponse = await axios.get(`${API_URL}/users`);

      const existingUser = usersResponse.data.find(
        (user) =>
          user.email?.toLowerCase() === email.trim().toLowerCase()
      );

      if (existingUser) {
        setError("This email is already registered.");
        return;
      }

      // Create new user
      const response = await axios.post(`${API_URL}/users`, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      const newUser = response.data;

      // Automatically login the new user
      login({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      });

      // Go to Home page
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        "Unable to create account. Please check if JSON Server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-[#F4EFE5] px-5 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-sm bg-white shadow-xl md:grid-cols-2">

        {/* BRAND SECTION */}
        <div className="flex flex-col items-center justify-center bg-[#30251E] px-10 py-16 text-center text-[#F4EFE5]">
          <h1 className="text-4xl font-medium tracking-[8px]">
            TIVARO
          </h1>

          <div className="my-7 h-[2px] w-14 bg-[#A17D49]"></div>

          <h2 className="font-serif text-3xl">
            Time is Everything.
          </h2>

          <p className="mt-5 max-w-xs text-sm leading-8 text-[#D5C8B5]">
            Discover timeless elegance and experience luxury
            through our exclusive watch collection.
          </p>

          <span className="mt-12 text-xs tracking-[4px] text-[#A17D49]">
            EST. 2026
          </span>
        </div>

        {/* REGISTER FORM */}
        <div className="px-8 py-12 sm:px-12">
          <h2 className="font-serif text-3xl text-[#30251E]">
            Create Account
          </h2>

          <p className="mt-3 text-sm text-[#8A7B6A]">
            Join TIVARO and discover timeless style.
          </p>

          <form onSubmit={handleSubmit} className="mt-7">

            <label className="mb-2 block text-sm text-[#30251E]">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#D8CFC2] bg-[#FCFAF7] p-3 text-sm outline-none focus:border-[#A17D49]"
              required
            />

            <label className="mb-2 mt-5 block text-sm text-[#30251E]">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#D8CFC2] bg-[#FCFAF7] p-3 text-sm outline-none focus:border-[#A17D49]"
              required
            />

            <label className="mb-2 mt-5 block text-sm text-[#30251E]">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#D8CFC2] bg-[#FCFAF7] p-3 text-sm outline-none focus:border-[#A17D49]"
              required
            />

            <label className="mb-2 mt-5 block text-sm text-[#30251E]">
              Confirm Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-[#D8CFC2] bg-[#FCFAF7] p-3 text-sm outline-none focus:border-[#A17D49]"
              required
            />

            <label className="mt-4 flex items-center gap-2 text-xs text-[#6F6256]">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              Show password
            </label>

            {error && (
              <p className="mt-4 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 w-full bg-[#30251E] py-4 text-xs font-semibold tracking-[2px] text-[#F4EFE5] transition hover:bg-[#A17D49] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#75695D]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#A17D49] hover:underline"
            >
              Login
            </Link>
          </p>

          <Link
            to="/"
            className="mt-6 block text-center text-xs text-[#75695D] hover:text-[#A17D49]"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;