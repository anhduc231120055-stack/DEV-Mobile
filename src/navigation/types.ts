export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Tours: { query?: string } | undefined;
  Bookings: undefined;
  Contact: undefined;
  Profile: undefined;
};

export type UserStackParamList = {
  MainTabs: undefined;
  TourDetail: undefined;
  Checkout: undefined;
  BookingDetail: { bookingId: string };
};

export type AdminStackParamList = {
  AdminDashboard: undefined;
  AdminTours: undefined;
  AdminBookings: undefined;
  AdminBookingDetail: { bookingId: string };
  AdminAccounts: undefined;
  AdminAccountDetail: { accountId: string };
  AdminReviews: undefined;
  AdminStats: undefined;
};
