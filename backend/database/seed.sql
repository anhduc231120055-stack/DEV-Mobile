INSERT INTO admins (username, email, password, role) VALUES
('ADN Super Admin', 'admin@adntravel.vn', 'admin123', 'admin'),
('Operations Admin', 'ops@adntravel.vn', 'ops12345', 'admin');

INSERT INTO users (name, email, phone, password, role) VALUES
('Admin', 'admin@gmail.com', '0900000001', '123456', 'ADMIN'),
('Nhan vien', 'staff@gmail.com', '0900000002', '123456', 'STAFF'),
('Nguyen Van A', 'user1@gmail.com', '0900000003', '123456', 'USER'),
('Tran Van B', 'user2@gmail.com', '0900000004', '123456', 'USER');

INSERT INTO tours (title, description, price, location, duration, max_people, created_by) VALUES
('Tour Da Nang 3N2D', 'Du lich Da Nang - Hoi An, tham quan Ba Na Hills', 2000000, 'Da Nang', 3, 20, 1),
('Tour Phu Quoc 4N3D', 'Nghi duong Phu Quoc, tam bien va kham pha dao', 5000000, 'Phu Quoc', 4, 15, 1),
('Tour Da Lat 2N1D', 'Check-in Da Lat, san may va thuong thuc dac san', 1500000, 'Da Lat', 2, 25, 2);

INSERT INTO bookings (user_id, tour_id, travel_date, number_of_people, total_price, status) VALUES
(3, 1, '2026-05-01', 2, 4000000, 'PENDING'),
(4, 2, '2026-06-10', 3, 15000000, 'CONFIRMED');

INSERT INTO booking_customers (booking_id, full_name, gender, date_of_birth) VALUES
(1, 'Nguyen Van A', 'MALE', '1995-01-01'),
(1, 'Le Thi B', 'FEMALE', '1997-05-10');

INSERT INTO booking_customers (booking_id, full_name, gender, date_of_birth, passport) VALUES
(2, 'Tran Van B', 'MALE', '1990-02-02', 'P123456'),
(2, 'Pham Thi C', 'FEMALE', '1992-03-03', 'P654321'),
(2, 'Hoang Van D', 'MALE', '1988-04-04', 'P999999');

INSERT INTO payments (booking_id, amount, method, status, paid_at) VALUES
(1, 4000000, 'MOMO', 'PENDING', NULL),
(2, 15000000, 'VNPAY', 'SUCCESS', NOW());

INSERT INTO reviews (user_id, tour_id, rating, comment) VALUES
(3, 1, 5, 'Tour rat tot, huong dan vien nhiet tinh'),
(4, 2, 4, 'Dich vu on, se quay lai lan sau');
