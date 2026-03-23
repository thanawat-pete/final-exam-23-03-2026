import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "light",
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },
  toggleTheme: () => {
    const newTheme = localStorage.getItem("theme") === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    set({ theme: newTheme });
  },
}));

// Initialize theme on load
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

export default useThemeStore;
