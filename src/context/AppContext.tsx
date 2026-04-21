import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { bookings as mockBookings } from "../data/mockData";
import { fetchAdminMe, fetchUserMe, loginAdmin, loginUser, registerUser } from "../services/auth";
import {
  deleteAdminUser,
  fetchAdminBookings,
  fetchAdminDashboard,
  fetchAdminUsers,
  updateAdminBookingStatus,
  updateAdminUserRole,
} from "../services/admin";
import { cancelBooking, createBooking, createPayment, fetchMyBookings, type PaymentMethod } from "../services/bookings";
import {
  createTour,
  deleteTour,
  fetchTours,
  type TourWritePayload,
  updateTour,
} from "../services/tours";
import { clearPersistedSession, loadPersistedSession, persistSession } from "../services/sessionStorage";
import type { ApiError } from "../services/api";
import type {
  AdminDashboardStats,
  AdminUser,
  AuthStatus,
  AppUser,
  Booking,
  BookingStatus,
  Tour,
  UserRole,
} from "../types/models";

type Credentials = {
  email: string;
  password: string;
};

type RegisterInput = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type CheckoutInput = {
  tourId: string;
  travelDate: string;
  numberOfPeople: number;
  paymentMethod: PaymentMethod;
};

function normalizePersistedRole(role: UserRole): "user" | "admin" {
  return role === "admin" ? "admin" : "user";
}

type AppContextValue = {
  adminBookings: Booking[];
  adminError: string | null;
  adminStats: AdminDashboardStats | null;
  adminUsers: AdminUser[];
  authError: string | null;
  authStatus: AuthStatus;
  bookingError: string | null;
  bookings: Booking[];
  currentRole: UserRole;
  currentUser: AppUser | null;
  isAdminLoading: boolean;
  isBookingsLoading: boolean;
  isCheckoutSubmitting: boolean;
  isSessionBootstrapping: boolean;
  isTourSubmitting: boolean;
  isToursLoading: boolean;
  selectedTour: Tour | null;
  token: string | null;
  tourError: string | null;
  tours: Tour[];
  cancelMyBooking: (bookingId: string) => Promise<void>;
  createCheckout: (payload: CheckoutInput) => Promise<void>;
  createTourByAdmin: (payload: TourWritePayload) => Promise<void>;
  deleteUserByAdmin: (userId: string) => Promise<void>;
  deleteTourByAdmin: (tourId: string) => Promise<void>;
  login: (mode: "user" | "admin", credentials: Credentials) => Promise<void>;
  logout: () => void;
  refreshAdminData: () => Promise<void>;
  refreshBookings: () => Promise<void>;
  refreshTours: () => Promise<void>;
  register: (payload: RegisterInput) => Promise<void>;
  selectTour: (tour: Tour) => void;
  updateBookingStatusByAdmin: (bookingId: string, status: BookingStatus) => Promise<void>;
  updateTourByAdmin: (tourId: string, payload: TourWritePayload) => Promise<void>;
  updateUserRoleByAdmin: (userId: string, role: "USER" | "STAFF") => Promise<void>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as ApiError).message);
  }

  return "Co loi xay ra. Vui long thu lai.";
}

function normalizeMockBookings(): Booking[] {
  return mockBookings.map((booking) => ({
    ...booking,
    status: booking.status.includes("x") ? "CONFIRMED" : booking.status.includes("Ho") ? "COMPLETED" : "PENDING",
  }));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("idle");
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>("guest");
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSessionBootstrapping, setIsSessionBootstrapping] = useState(true);
  const [tours, setTours] = useState<Tour[]>([]);
  const [tourError, setTourError] = useState<string | null>(null);
  const [isToursLoading, setIsToursLoading] = useState(false);
  const [isTourSubmitting, setIsTourSubmitting] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(normalizeMockBookings());
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isBookingsLoading, setIsBookingsLoading] = useState(false);
  const [isCheckoutSubmitting, setIsCheckoutSubmitting] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminDashboardStats | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [adminBookings, setAdminBookings] = useState<Booking[]>([]);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  async function refreshTours() {
    setIsToursLoading(true);
    setTourError(null);

    try {
      const nextTours = await fetchTours();
      setTours(nextTours);
      setSelectedTour((currentSelected) => {
        if (!currentSelected) {
          return nextTours[0] ?? null;
        }

        return nextTours.find((tour) => tour.id === currentSelected.id) ?? nextTours[0] ?? null;
      });
    } catch (error) {
      setTourError(getErrorMessage(error));
    } finally {
      setIsToursLoading(false);
    }
  }

  async function refreshBookings() {
    if (!token || currentRole !== "user") {
      setBookings(normalizeMockBookings());
      return;
    }

    setIsBookingsLoading(true);
    setBookingError(null);

    try {
      const nextBookings = await fetchMyBookings(token);
      setBookings(nextBookings);
    } catch (error) {
      setBookingError(getErrorMessage(error));
    } finally {
      setIsBookingsLoading(false);
    }
  }

  async function refreshAdminData() {
    if (!token || currentRole !== "admin") {
      setAdminStats(null);
      setAdminUsers([]);
      setAdminBookings([]);
      return;
    }

    setIsAdminLoading(true);
    setAdminError(null);

    try {
      const [stats, users, bookingsData] = await Promise.all([
        fetchAdminDashboard(token),
        fetchAdminUsers(token),
        fetchAdminBookings(token),
      ]);
      setAdminStats(stats);
      setAdminUsers(users);
      setAdminBookings(bookingsData);
    } catch (error) {
      setAdminError(getErrorMessage(error));
    } finally {
      setIsAdminLoading(false);
    }
  }

  useEffect(() => {
    void refreshTours();
  }, []);

  useEffect(() => {
    void refreshBookings();
    void refreshAdminData();
  }, [token, currentRole]);

  useEffect(() => {
    async function bootstrapSession() {
      const persistedSession = await loadPersistedSession();

      if (!persistedSession) {
        setIsSessionBootstrapping(false);
        return;
      }

      try {
        const restoredUser =
          persistedSession.role === "admin"
            ? await fetchAdminMe(persistedSession.token)
            : await fetchUserMe(persistedSession.token);

        setCurrentUser(restoredUser);
        setCurrentRole(restoredUser.role);
        setToken(persistedSession.token);
        setAuthStatus("authenticated");
      } catch {
        await clearPersistedSession();
        setCurrentRole("guest");
        setCurrentUser(null);
        setToken(null);
        setAuthStatus("idle");
      } finally {
        setIsSessionBootstrapping(false);
      }
    }

    void bootstrapSession();
  }, []);

  async function login(mode: "user" | "admin", credentials: Credentials) {
    setAuthStatus("loading");
    setAuthError(null);

    try {
      const session =
        mode === "admin"
          ? await loginAdmin(credentials.email, credentials.password)
          : await loginUser(credentials.email, credentials.password);

      setCurrentUser(session.user);
      setCurrentRole(session.user.role);
      setToken(session.token);
      setAuthStatus("authenticated");
      await persistSession({
        token: session.token,
        role: normalizePersistedRole(session.user.role),
      });
    } catch (error) {
      setAuthStatus("error");
      setAuthError(getErrorMessage(error));
      throw error;
    }
  }

  async function register(payload: RegisterInput) {
    setAuthStatus("loading");
    setAuthError(null);

    try {
      const session = await registerUser(payload);
      setCurrentUser(session.user);
      setCurrentRole(session.user.role);
      setToken(session.token);
      setAuthStatus("authenticated");
      await persistSession({
        token: session.token,
        role: normalizePersistedRole(session.user.role),
      });
    } catch (error) {
      setAuthStatus("error");
      setAuthError(getErrorMessage(error));
      throw error;
    }
  }

  async function createCheckout(payload: CheckoutInput) {
    if (!token) {
      throw new Error("Ban can dang nhap de dat tour.");
    }

    setIsCheckoutSubmitting(true);
    setBookingError(null);

    try {
      const booking = await createBooking({
        token,
        tourId: payload.tourId,
        travelDate: payload.travelDate,
        numberOfPeople: payload.numberOfPeople,
      });

      await createPayment({
        token,
        bookingId: booking.id,
        method: payload.paymentMethod,
      });

      await refreshBookings();
    } catch (error) {
      setBookingError(getErrorMessage(error));
      throw error;
    } finally {
      setIsCheckoutSubmitting(false);
    }
  }

  async function createTourByAdmin(payload: TourWritePayload) {
    if (!token || currentRole !== "admin") {
      throw new Error("Ban can dang nhap admin.");
    }

    setIsTourSubmitting(true);
    setTourError(null);

    try {
      await createTour(token, payload);
      await refreshTours();
      await refreshAdminData();
    } catch (error) {
      setTourError(getErrorMessage(error));
      throw error;
    } finally {
      setIsTourSubmitting(false);
    }
  }

  async function updateTourByAdmin(tourId: string, payload: TourWritePayload) {
    if (!token || currentRole !== "admin") {
      throw new Error("Ban can dang nhap admin.");
    }

    setIsTourSubmitting(true);
    setTourError(null);

    try {
      await updateTour(token, tourId, payload);
      await refreshTours();
      await refreshAdminData();
    } catch (error) {
      setTourError(getErrorMessage(error));
      throw error;
    } finally {
      setIsTourSubmitting(false);
    }
  }

  async function deleteTourByAdmin(tourId: string) {
    if (!token || currentRole !== "admin") {
      throw new Error("Ban can dang nhap admin.");
    }

    setIsTourSubmitting(true);
    setTourError(null);

    try {
      await deleteTour(token, tourId);
      await refreshTours();
      await refreshAdminData();
    } catch (error) {
      setTourError(getErrorMessage(error));
      throw error;
    } finally {
      setIsTourSubmitting(false);
    }
  }

  async function cancelMyBooking(bookingId: string) {
    if (!token) {
      throw new Error("Ban can dang nhap de huy booking.");
    }

    setBookingError(null);

    try {
      await cancelBooking(token, bookingId);
      await refreshBookings();
    } catch (error) {
      setBookingError(getErrorMessage(error));
      throw error;
    }
  }

  async function updateBookingStatusByAdmin(bookingId: string, status: BookingStatus) {
    if (!token) {
      throw new Error("Ban can dang nhap admin.");
    }

    await updateAdminBookingStatus(token, bookingId, status);
    await refreshAdminData();
  }

  async function updateUserRoleByAdmin(userId: string, role: "USER" | "STAFF") {
    if (!token) {
      throw new Error("Ban can dang nhap admin.");
    }

    await updateAdminUserRole(token, userId, role);
    await refreshAdminData();
  }

  async function deleteUserByAdmin(userId: string) {
    if (!token) {
      throw new Error("Ban can dang nhap admin.");
    }

    await deleteAdminUser(token, userId);
    await refreshAdminData();
  }

  function logout() {
    void clearPersistedSession();
    setCurrentRole("guest");
    setCurrentUser(null);
    setToken(null);
    setAuthStatus("idle");
    setAuthError(null);
    setBookingError(null);
    setAdminError(null);
    setBookings(normalizeMockBookings());
    setAdminStats(null);
    setAdminUsers([]);
    setAdminBookings([]);
    setIsTourSubmitting(false);
  }

  const value = useMemo<AppContextValue>(
    () => ({
      adminBookings,
      adminError,
      adminStats,
      adminUsers,
      authError,
      authStatus,
      bookingError,
      bookings,
      currentRole,
      currentUser,
      isAdminLoading,
      isBookingsLoading,
      isCheckoutSubmitting,
      isSessionBootstrapping,
      isTourSubmitting,
      isToursLoading,
      selectedTour,
      token,
      tourError,
      tours,
      cancelMyBooking,
      createCheckout,
      createTourByAdmin,
      deleteUserByAdmin,
      deleteTourByAdmin,
      login,
      logout,
      refreshAdminData,
      refreshBookings,
      refreshTours,
      register,
      selectTour: (tour) => setSelectedTour(tour),
      updateBookingStatusByAdmin,
      updateTourByAdmin,
      updateUserRoleByAdmin,
    }),
    [
      adminBookings,
      adminError,
      adminStats,
      adminUsers,
      authError,
      authStatus,
      bookingError,
      bookings,
      currentRole,
      currentUser,
      isAdminLoading,
      isBookingsLoading,
      isCheckoutSubmitting,
      isSessionBootstrapping,
      isTourSubmitting,
      isToursLoading,
      selectedTour,
      token,
      tourError,
      tours,
    ]
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
