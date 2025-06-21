import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://192.168.108.79:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        const meRes = await fetch(
          `http://192.168.108.79:8000/api/auth/me?token=${data.access_token}`,
          { method: "POST" }
        );
        const meData = await meRes.json();

        if (!meRes.ok || !meData.role) {
          setError("Gagal mengambil data user.");
          setIsLoading(false);
          return;
        }

        const role = meData.role;
        if (role === "super_admin") {
          navigate("/superadmin");
        } else if (role === "admin_faskes") {
          navigate("/");
        } else if (role === "user_mobile") {
          window.location.href = "https://play.google.com/store/apps/details?id=com.sadar.mobile";
        } else {
          setError("Role tidak dikenali.");
        }
      } else {
        setError(data.message || "Login gagal. Cek email/password.");
      }
    } catch (err) {
      setError("Network error. Silakan coba lagi.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{ backgroundColor: "#FFF" }}
    >
      <div className="flex-1 relative">
        <img
          src="/assets/dontol.png"
          alt="gambar exca"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
          <div className="flex items-center space-x-2">
            <div className="w-50 h-full relative">
              <img
                src="/assets/sadar.png"
                alt="Triangle Logo"
                className="w-full h-full"
              />
            </div>
          </div>
          
          <div className="text-white hidden md:block">
            <h3 className="text-3xl font-bold mb-2">Welcome to</h3>
            <h1 className="text-7xl font-bold">SADAR</h1>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20 z-10">
          <div className="w-full h-full border-4 border-white rounded-full"></div>
          <div className="absolute bottom-8 right-8 w-32 h-32 border-2 border-white rounded-full"></div>
        </div>
      </div>

      <div className="w-96 p-8 flex flex-col justify-center relative">
        <div className="mb-8">
          <h3 className="text-black text-3xl font-bold mb-1">Welcome</h3>
          <h3 className="text-black text-3xl font-bold">Back</h3>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={16} className="text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
              style={{ borderColor: email ? "#E30030" : undefined }}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors pr-12"
                style={{ borderColor: password ? "#E30030" : undefined }}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-red-500 border-gray-600 rounded focus:ring-red-500 focus:ring-2 bg-transparent"
                style={{ accentColor: "#E30030" }}
                disabled={isLoading}
              />
              <span className="text-black text-sm">Remember me</span>
            </label>
            <button 
              type="button"
              className="text-black text-sm hover:text-red-500 transition-colors"
              disabled={isLoading}
            >
              Forgot Password
            </button>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            style={{ backgroundColor: "#E30030" }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </div>

        <div
          className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ backgroundColor: "#E30030" }}
        ></div>
        <div
          className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ backgroundColor: "#E30030" }}
        ></div>
        <div
          className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full opacity-30 pointer-events-none"
          style={{ backgroundColor: "#E30030" }}
        ></div>
      </div>
    </div>
  );
}