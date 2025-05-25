"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeColors = {
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  accent: string;
  accentHover: string;
  background: string;
  text: string;
  textMuted: string;
};

const defaultTheme: ThemeColors = {
  primary: "#059669", // emerald-600
  primaryHover: "#047857", // emerald-700
  secondary: "#18181b", // zinc-900
  secondaryHover: "#27272a", // zinc-800
  accent: "#2a4027", // custom green
  accentHover: "#347a4d", // custom green hover
  background: "#ffffff",
  text: "#1f2937", // gray-800
  textMuted: "#4b5563", // gray-600
};

interface ThemeContextType {
  colors: ThemeColors;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: defaultTheme,
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colors, setColors] = useState(defaultTheme);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ colors, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
