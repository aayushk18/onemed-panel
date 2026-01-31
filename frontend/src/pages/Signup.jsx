import { useState } from "react";
import { Mail, Lock, User, GraduationCap } from "lucide-react";
import logo from "../assets/onemed_pic.jpg";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../utils/useAuthStore";

export default function Signup() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const { signup } = useAuthStore()

    const validateForm = () => {
        if (!formData.firstName.trim()) return toast.error("First Name is required");
        if (!formData.lastName.trim()) return toast.error("Last Name is required");
        if (!formData.email.trim()) return toast.error("Login ID is required");
        if (!formData.password) return toast.error("Password is required");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

        return true
    }

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const success = validateForm()

        if (success == true) {
            signup(formData)
            console.log(formData);
        }

        console.log("Signup Data:", formData);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <img
                        src={logo}
                        alt="OneMed Tutor"
                        className="h-16 w-auto mx-auto mb-4"
                    />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Create Student Account
                    </h1>
                    <p className="text-gray-600">
                        Start your medical learning journey
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl shadow-md p-8">
                    {/* Student Badge */}
                    <div className="flex items-center justify-center gap-2 mb-6 text-blue-600 font-medium">
                        <GraduationCap className="w-5 h-5" />
                        Student Signup
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter first name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter last name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded"
                                required
                            />
                            I agree to the Terms & Conditions and Privacy Policy
                        </label>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <button
                                onClick={() => navigate("/login")}
                                className="text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
