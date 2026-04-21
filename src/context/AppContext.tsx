import React, { createContext, useContext, useMemo, useState } from "react";
import { tours as initialTours, bookings as initialBookings } from "../data/mockData";
import type { Booking, Tour, UserRole } from "../types/models";

type AppContextValue = {
  bookings: Booking[];
  currentRole: UserRole;
  selectedTour: Tour | null;
  tours: Tour[];
  loginAsAdmin: () => void;
  loginAsUser: () => void;
  logout: () => void;
  selectTour: (tour: Tour) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("guest");
  const [selectedTour, setSelectedTour] = useState<Tour | null>(initialTours[0] ?? null);

  const value = useMemo<AppContextValue>(
    () => ({
      bookings: initialBookings,
      currentRole,
      selectedTour,
      tours: initialTours,
      loginAsAdmin: () => setCurrentRole("admin"),
      loginAsUser: () => setCurrentRole("user"),
      logout: () => setCurrentRole("guest"),
      selectTour: (tour) => setSelectedTour(tour),
    }),
    [currentRole, selectedTour]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
