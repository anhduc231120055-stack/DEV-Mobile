export type UserRole = "guest" | "user" | "admin";

export type AuthStatus = "idle" | "loading" | "authenticated" | "error";

export type AppUser = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
};

export type Category = {
  id: string;
  label: string;
  emoji: string;
};

export type ItineraryItem = {
  time: string;
  title: string;
  description: string;
};

export type TourStatus = "Active" | "Draft" | "Closed";

export type Tour = {
  id: string;
  title: string;
  description?: string;
  location: string;
  duration: string;
  durationDays?: number | null;
  price: string;
  priceValue?: number | null;
  rating: string;
  tagline: string;
  image: string;
  imageUrl?: string | null;
  status?: TourStatus;
  gallery: string[];
  highlights: string[];
  itinerary: ItineraryItem[];
};

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "Đã xác nhận"
  | "Chờ thanh toán"
  | "Hoàn tất";

export type Booking = {
  id: string;
  tourId: string;
  customerName: string;
  total: string;
  status: BookingStatus;
  travelDate: string;
  tourTitle?: string;
  location?: string;
  image?: string | null;
  duration?: string;
  numberOfPeople?: number;
};

export type PaymentRecord = {
  id: string;
  amount: string;
  method: string;
  status: string;
  paidAt?: string;
};

export type BookingCustomer = {
  id: string;
  fullName?: string;
  gender?: string;
  birthDate?: string;
  phone?: string;
  email?: string;
};

export type BookingDetail = Booking & {
  userEmail?: string;
  userPhone?: string;
  meetingPoint?: string;
  transport?: string;
  customers?: BookingCustomer[];
  payments?: PaymentRecord[];
  latestPayment?: PaymentRecord | null;
};

export type AdminUserRole = "USER" | "STAFF" | "ADMIN";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: AdminUserRole;
  totalBookings: number;
  createdAt?: string;
};

export type AdminDashboardStats = {
  totalTours: number;
  activeTours: number;
  totalUsers: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  totalRevenue: string;
};
