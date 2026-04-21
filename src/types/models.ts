export type UserRole = "guest" | "user" | "admin";

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

export type Tour = {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  rating: string;
  tagline: string;
  image: string;
  gallery: string[];
  highlights: string[];
  itinerary: ItineraryItem[];
};

export type Booking = {
  id: string;
  tourId: string;
  customerName: string;
  total: string;
  status: "Đã xác nhận" | "Chờ thanh toán" | "Hoàn tất";
  travelDate: string;
};
