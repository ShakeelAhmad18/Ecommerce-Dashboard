import { useState, useEffect, useCallback } from "react";

const useTheme = () => {
  // Get initial theme from localStorage or prefer-color-scheme
  const getInitialTheme = useCallback(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme;

      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  }, []);

  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme class to document element
  const applyTheme = useCallback((newTheme) => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      root.classList.remove(newTheme === "dark" ? "light" : "dark");
      root.classList.add(newTheme);
      localStorage.setItem("theme", newTheme);
    }
  }, []);

  // Toggle between dark and light theme
  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    applyTheme(newTheme);
  }, [theme, applyTheme]);

  // Initialize theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Watch for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      const newTheme = e.matches ? "dark" : "light";
      setTheme(newTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return {
    isDarkMode: theme === "dark",
    theme,
    toggleTheme,
  };
};

export default useTheme;