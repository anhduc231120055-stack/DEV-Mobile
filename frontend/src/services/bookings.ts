import { apiRequest } from "./api";
import type { Booking, BookingCustomer, BookingDetail, BookingStatus, PaymentRecord } from "../types/models";

type ApiBooking = {
  id: number;
  tour_id: number;
  travel_date: string;
  number_of_people?: number;
  total_price: number;
  status: BookingStatus;
  user_name?: string;
  tour_title?: string;
  location?: string;
  image_url?: string | null;
  duration?: number | null;
  duration_text?: string | null;
};

type MyBookingsResponse = {
  bookings: ApiBooking[];
};

type CreateBookingResponse = {
  booking: ApiBooking;
};

type CreatePaymentResponse = {
  payment: {
    id: number;
    booking_id: number;
    amount: number;
    method: string;
    status: string;
    paid_at: string;
  };
};

export type PaymentMethod = "BANK_TRANSFER" | "MOMO" | "VNPAY" | "CASH";

type CreateBookingInput = {
  token: string;
  tourId: string;
  travelDate: string;
  numberOfPeople: number;
};

type CreatePaymentInput = {
  token: string;
  bookingId: string;
  method: PaymentMethod;
};

type ApiPayment = {
  id: number;
  amount: number;
  method: string;
  status: string;
  paid_at?: string;
};

type ApiBookingCustomer = {
  id?: number;
  full_name?: string;
  name?: string;
  gender?: string;
  birth_date?: string;
  phone?: string;
  email?: string;
};

type ApiBookingDetail = ApiBooking & {
  user_email?: string;
  user_phone?: string;
  transport?: string;
  meeting_point?: string;
  payment?: ApiPayment | null;
  payments?: ApiPayment[];
  customers?: ApiBookingCustomer[];
};

type BookingDetailResponse = {
  booking: ApiBookingDetail;
};

type PaymentsByBookingResponse = {
  payments: ApiPayment[];
};

function formatCurrency(value?: number | null) {
  if (value === undefined || value === null) {
    return "Lien he";
  }

  return `${new Intl.NumberFormat("vi-VN").format(value)}d`;
}

function formatDuration(duration?: number | null, durationText?: string | null) {
  if (durationText) {
    return durationText;
  }

  if (duration) {
    const nights = Math.max(duration - 1, 0);
    return `${duration} ngay ${nights} dem`;
  }

  return "Dang cap nhat";
}

function mapBooking(booking: ApiBooking): Booking {
  return {
    id: String(booking.id),
    tourId: String(booking.tour_id),
    customerName: booking.user_name || "Ban",
    total: formatCurrency(booking.total_price),
    status: booking.status,
    travelDate: booking.travel_date,
    tourTitle: booking.tour_title,
    location: booking.location,
    image: booking.image_url ?? null,
    duration: formatDuration(booking.duration, booking.duration_text),
    numberOfPeople: booking.number_of_people,
  };
}

function mapPayment(payment: ApiPayment): PaymentRecord {
  return {
    id: String(payment.id),
    amount: formatCurrency(payment.amount),
    method: payment.method,
    status: payment.status,
    paidAt: payment.paid_at,
  };
}

function mapCustomer(customer: ApiBookingCustomer, index: number): BookingCustomer {
  return {
    id: String(customer.id ?? index + 1),
    fullName: customer.full_name || customer.name,
    gender: customer.gender,
    birthDate: customer.birth_date,
    phone: customer.phone,
    email: customer.email,
  };
}

function mapBookingDetail(booking: ApiBookingDetail): BookingDetail {
  const payments = booking.payments?.map(mapPayment) ?? [];
  const latestPayment = booking.payment ? mapPayment(booking.payment) : payments[0] ?? null;

  return {
    ...mapBooking(booking),
    userEmail: booking.user_email,
    userPhone: booking.user_phone,
    meetingPoint: booking.meeting_point,
    transport: booking.transport,
    customers: booking.customers?.map(mapCustomer),
    payments,
    latestPayment,
  };
}

export async function fetchMyBookings(token: string) {
  const payload = await apiRequest<MyBookingsResponse>("/bookings/my", {
    method: "GET",
    token,
  });

  return payload.bookings.map(mapBooking);
}

export async function createBooking(data: CreateBookingInput) {
  const payload = await apiRequest<CreateBookingResponse>("/bookings", {
    method: "POST",
    token: data.token,
    data: {
      tour_id: Number(data.tourId),
      travel_date: data.travelDate,
      number_of_people: data.numberOfPeople,
    },
  });

  return mapBooking(payload.booking);
}

export async function createPayment(data: CreatePaymentInput) {
  return apiRequest<CreatePaymentResponse>("/payments", {
    method: "POST",
    token: data.token,
    data: {
      booking_id: Number(data.bookingId),
      method: data.method,
    },
  });
}

export async function cancelBooking(token: string, bookingId: string) {
  await apiRequest<{ message: string }>(`/bookings/my/${bookingId}/cancel`, {
    method: "PUT",
    token,
  });
}

export async function fetchMyBookingDetail(token: string, bookingId: string) {
  const payload = await apiRequest<BookingDetailResponse>(`/bookings/my/${bookingId}`, {
    method: "GET",
    token,
  });

  return mapBookingDetail(payload.booking);
}

export async function fetchAdminBookingDetail(token: string, bookingId: string) {
  const payload = await apiRequest<BookingDetailResponse>(`/bookings/${bookingId}`, {
    method: "GET",
    token,
  });

  return mapBookingDetail(payload.booking);
}

export async function fetchPaymentsByBooking(token: string, bookingId: string) {
  const payload = await apiRequest<PaymentsByBookingResponse>(`/payments/booking/${bookingId}`, {
    method: "GET",
    token,
  });

  return payload.payments.map(mapPayment);
}
