import { apiRequest } from "./api";
import type { AdminDashboardStats, AdminUser, Booking } from "../types/models";

type DashboardResponse = {
  stats: {
    tours: { total: number; active: number };
    users: { total: number };
    bookings: {
      total: number;
      pending: number;
      confirmed: number;
      cancelled: number;
      completed: number;
    };
    revenue: { total: number };
  };
};

type UsersResponse = {
  users: Array<{
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: "USER" | "STAFF" | "ADMIN";
    total_bookings: number;
    created_at?: string;
  }>;
};

type AdminBookingsResponse = {
  bookings: Array<{
    id: number;
    user_name?: string;
    tour_id: number;
    tour_title?: string;
    location?: string;
    image_url?: string | null;
    travel_date: string;
    number_of_people?: number;
    total_price: number;
    status: Booking["status"];
  }>;
};

function formatCurrency(value?: number | null) {
  return `${new Intl.NumberFormat("vi-VN").format(value || 0)}d`;
}

function mapAdminBooking(booking: AdminBookingsResponse["bookings"][number]): Booking {
  return {
    id: String(booking.id),
    customerName: booking.user_name || "Khach hang",
    tourId: String(booking.tour_id),
    tourTitle: booking.tour_title,
    location: booking.location,
    image: booking.image_url ?? null,
    travelDate: booking.travel_date,
    total: formatCurrency(booking.total_price),
    status: booking.status,
    numberOfPeople: booking.number_of_people,
  };
}

export async function fetchAdminDashboard(token: string): Promise<AdminDashboardStats> {
  const payload = await apiRequest<DashboardResponse>("/stats/dashboard", {
    method: "GET",
    token,
  });

  return {
    totalTours: payload.stats.tours.total,
    activeTours: payload.stats.tours.active,
    totalUsers: payload.stats.users.total,
    totalBookings: payload.stats.bookings.total,
    pendingBookings: payload.stats.bookings.pending,
    confirmedBookings: payload.stats.bookings.confirmed,
    cancelledBookings: payload.stats.bookings.cancelled,
    completedBookings: payload.stats.bookings.completed,
    totalRevenue: formatCurrency(payload.stats.revenue.total),
  };
}

export async function fetchAdminUsers(token: string): Promise<AdminUser[]> {
  const payload = await apiRequest<UsersResponse>("/users", {
    method: "GET",
    token,
  });

  return payload.users.map((user) => ({
    id: String(user.id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    totalBookings: Number(user.total_bookings || 0),
    createdAt: user.created_at,
  }));
}

export async function updateAdminUserRole(token: string, userId: string, role: "USER" | "STAFF") {
  await apiRequest<{ message: string }>(`/users/${userId}/role`, {
    method: "PUT",
    token,
    data: { role },
  });
}

export async function deleteAdminUser(token: string, userId: string) {
  await apiRequest<{ message: string }>(`/users/${userId}`, {
    method: "DELETE",
    token,
  });
}

export async function fetchAdminBookings(token: string): Promise<Booking[]> {
  const payload = await apiRequest<AdminBookingsResponse>("/bookings", {
    method: "GET",
    token,
  });

  return payload.bookings.map(mapAdminBooking);
}

export async function updateAdminBookingStatus(token: string, bookingId: string, status: Booking["status"]) {
  await apiRequest<{ message: string }>(`/bookings/${bookingId}/status`, {
    method: "PUT",
    token,
    data: { status },
  });
}
