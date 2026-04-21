# Digital Voyager React Native

Frontend mobile React Native được dựng lại từ bộ giao diện HTML rời trong repo nguồn.

## Cấu trúc chính

- `src/navigation`: điều hướng `auth`, `user`, `admin`
- `src/screens/auth`: đăng nhập, đăng ký
- `src/screens/user`: trang chủ, danh sách tour, chi tiết tour, thanh toán, lịch sử, liên hệ, tài khoản
- `src/screens/admin`: dashboard, tour, booking, tài khoản, review, thống kê
- `src/components/common`: header, screen wrapper, section, info card
- `src/components/tour`: component card cho tour
- `src/context`: state dùng cho session, tours, bookings và admin data
- `src/data`: dữ liệu mẫu còn giữ lại cho một số phần demo
- `src/services`: API client, auth, bookings, tours, admin và session storage

## Mapping từ folder giao diện nguồn

- `ng_nh_p_user` -> `src/screens/auth/LoginScreen.tsx`
- `ng_k_user` -> `src/screens/auth/RegisterScreen.tsx`
- `trang_ch_user` -> `src/screens/user/HomeScreen.tsx`
- `danh_s_ch_tour_user` -> `src/screens/user/ToursScreen.tsx`
- `chi_ti_t_tour_user` -> `src/screens/user/TourDetailScreen.tsx`
- `thanh_to_n_user` -> `src/screens/user/CheckoutScreen.tsx`
- `l_ch_s_t_tour_user` -> `src/screens/user/BookingHistoryScreen.tsx`
- `li_n_h_user` -> `src/screens/user/ContactScreen.tsx`
- Các folder `dashboard_admin_*`, `qu_n_l_*`, `th_ng_k_*` -> `src/screens/admin/*`

## Luồng đã nối

- `Login` -> `Register`
- `Login` -> `User App`
- `Login` -> `Admin App`
- `Home` -> `Tours`
- `Home/Tours` -> `TourDetail`
- `TourDetail` -> `Checkout`
- `Bookings` -> `BookingDetail`
- `Admin Bookings` -> `AdminBookingDetail`
- `Admin Dashboard` -> toàn bộ màn quản trị

## Chạy app

```bash
cd react-native-app
npm install
npm start
```

Tạo file `.env` từ `.env.example` trước khi chạy app.

## Cấu hình API

- App ưu tiên đọc `EXPO_PUBLIC_API_BASE_URL` từ file `.env`
- Ví dụ:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.24:3000/api
```

- Nếu không có biến env này:
  - Android emulator sẽ fallback về `http://10.0.2.2:3000/api`
  - Các môi trường khác sẽ fallback về `http://localhost:3000/api`

## Ghi chú

- Project dùng Expo.
- Navigation dùng `@react-navigation`.
- Frontend đã được nối với backend API trong repo.
- Session đăng nhập hiện được persist cục bộ để mở lại app không bị mất phiên ngay.
