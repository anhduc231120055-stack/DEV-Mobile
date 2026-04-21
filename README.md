# Digital Voyager React Native

Frontend mobile React Native được dựng lại từ bộ giao diện HTML rời trong repo nguồn.

## Cấu trúc chính

- `src/navigation`: điều hướng `auth`, `user`, `admin`
- `src/screens/auth`: đăng nhập, đăng ký
- `src/screens/user`: trang chủ, danh sách tour, chi tiết tour, thanh toán, lịch sử, liên hệ, tài khoản
- `src/screens/admin`: dashboard, tour, booking, tài khoản, review, thống kê
- `src/components/common`: header, screen wrapper, section, info card
- `src/components/tour`: component card cho tour
- `src/context`: state tạm cho role, tour đang chọn, dữ liệu mẫu
- `src/data`: dữ liệu giả để nối toàn bộ flow

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
- `Bottom Tabs` -> `Bookings`, `Contact`, `Profile`
- `Admin Dashboard` -> toàn bộ màn quản trị

## Chạy app

```bash
cd react-native-app
npm install
npm start
```

## Ghi chú

- Project dùng Expo.
- Navigation dùng `@react-navigation`.
- Dữ liệu hiện là mock data để nối giao diện; chưa có API/backend thật.
