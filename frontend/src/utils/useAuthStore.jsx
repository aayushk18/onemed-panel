import { create } from 'zustand'
import { axiosInstance } from './axios';
import toast from 'react-hot-toast';



const UserAdmin = { userType: 'admin' }


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set) => ({

    authUser: null,
    userType: null,

    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckAuth: true,

    checkAuth: async () => {

        try {
            const res = await axiosInstance.get('/user/auth/check')

            set({ userType: res.data.userType });
            set({ authUser: res.data });








        } catch (error) {
            set({ setUser: null })

            console.log("Error in checkAuth", error);

        } finally {
            set({ isCheckAuth: false })
        }
    },

    logout: async () => {
        try {
            console.log("logiing out");

            await axiosInstance.post('/user/auth/logout');
            set({ authUser: null });
            set({ userType: null });

            toast.success("Logged out Successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    login: async (data) => {

        set({ isLoggingIn: true })
        try {
            console.log(data);
            const res = await axiosInstance.post("/user/auth/login", data)
            set({ userType: res.data.userType });
            set({ setUser: res.data });

            toast.success("Account Logged In Successfully")

        } catch (error) {
            toast.error(error.response.data.message)

        } finally {
            set({ isLoggingIn: false })
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put('/user/auth/update-profile', data)
            set({ setUser: res.data })
            toast.success("Profile Upadted Successfully")
        } catch (error) {
            console.log("Error in update profile", error);
            toast.error(error.response.data.message)

        } finally {
            set({ isUpdatingProfile: false })
        }

    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {


            const res = await axiosInstance.post("/user/auth/signup", data)
            set({ userType: res.data.userType });
            set({ setUser: res.data });

            toast.success("Account Signed Up Successfully")

        } catch (error) {
            toast.error(error.response.data.message)

        } finally {
            set({ isSigningUp: false })
        }
    }




}))