import { create } from "zustand";
import API from "../services/api";
import toast from "react-hot-toast";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,

  register: async (fullname, email, password) => {
    set({ loading: true });
    try {
      const response = await API.post("/auth/register", { fullname, email, password });
      if (response.data.success) {
        set({ user: response.data.user, isAuthenticated: true });
        localStorage.setItem("taskflow_has_session", "true");
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await API.post("/auth/login", { email, password });
      if (response.data.success) {
        set({ user: response.data.user, isAuthenticated: true });
        localStorage.setItem("taskflow_has_session", "true");
        toast.success("Logged in successfully!");
      }
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await API.post("/auth/logout");
      set({ user: null, isAuthenticated: false });
      localStorage.removeItem("taskflow_has_session");
      toast.success("Logged out successfully");
    } catch (_) {
      set({ user: null, isAuthenticated: false });
      localStorage.removeItem("taskflow_has_session");
      toast.success("Logged out successfully");
    }
  },

  checkAuth: async () => {
    if (!localStorage.getItem("taskflow_has_session")) return;
    
    set({ loading: true });
    try {
      const response = await API.get("/auth/me");
      if (response.data.success) {
        set({ user: response.data.user, isAuthenticated: true });
      } else {
        localStorage.removeItem("taskflow_has_session");
        set({ user: null, isAuthenticated: false });
      }
    } catch (_) {
      localStorage.removeItem("taskflow_has_session");
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAuthStore;
