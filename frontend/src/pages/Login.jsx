import { useState } from "react";
import { Mail, Lock, User, GraduationCap } from "lucide-react";
import logo from "../assets/onemed_pic.jpg"
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../utils/useAuthStore";

export default function Login() {

  const [userType, setUserType] = useState("student"); // JSX-friendly

  const navigate = useNavigate();

  const { login } = useAuthStore()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Login ID is required");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true
  }



  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm()

    if (success == true) {
      login(formData)
      console.log(formData);
    }

    console.log("Login Data:", formData);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="OneMed Tutor"
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Login to continue your learning
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setUserType("student")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${userType === "student"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              <GraduationCap className="w-4 h-4 inline mr-2" />
              Student
            </button>

            <button
              onClick={() => setUserType("tutor")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${userType === "tutor"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Tutor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>


            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Remember me
                </span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"

              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account? "
              <button
                onClick={() => navigate("/signup")}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
