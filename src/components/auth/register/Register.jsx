import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";

export default function Register() {
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

        {/* <div className="flex items-center space-x-2">
            <div className="w-50 h-full relative">
              <img
                src="/assets/sadar.png"
                alt="Triangle Logo"
                className="w-full h-full"
              />
            </div>
            <span className="text-white text-xl font-bold">SADAR</span>
          </div> */}

        <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
          <div className="flex items-center space-x-2">
            <div className="w-50 h-full relative">
              <img
                src="/assets/sadar.png"
                alt="Triangle Logo"
                className="w-full h-full"
              />
            </div>
            {/* <span className="text-white text-xl font-bold">SADAR</span> */}
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
          <h3 className="text-black text-3xl font-bold mb-1">Create your</h3>
          <h3 className="text-black text-3xl font-bold">account!</h3>
        </div>

        {/* disini mulai form na */}
        <div className="space-y-3">
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
              style={{ borderColor: username ? "#E30030" : undefined }}
            />
          </div>

          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
              style={{ borderColor: email ? "#E30030" : undefined }}
            />
          </div>

          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
              style={{ borderColor: phone ? "#E30030" : undefined }}
            />
          </div>

          <div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors"
                style={{ borderColor: password ? "#E30030" : undefined }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95 mt-4"
            style={{ backgroundColor: "#E30030" }}
          >
            Sign Up
          </button>

          <div className="text-center">
            <span className="text-black">Already have an account? </span>
            <button
              className="text-red-500 hover:text-red-700 transition-colors"
              onClick={() => (window.location.href = "/login")}
            >
              Log In
            </button>
          </div>
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
