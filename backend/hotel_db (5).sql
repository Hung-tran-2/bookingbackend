-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 11, 2025 at 02:35 PM
-- Server version: 5.7.40
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hotel_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
CREATE TABLE IF NOT EXISTS `bookings` (
  `booking_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID đơn đặt',
  `user_id` int(11) NOT NULL COMMENT 'Khách đặt',
  `checkin_date` date NOT NULL,
  `checkout_date` date NOT NULL,
  `source` text,
  `status` enum('pending','confirmed','cancelled','checked_in','checked_out') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`booking_id`),
  KEY `fk_bookings_customer` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COMMENT='Đơn đặt phòng';

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `user_id`, `checkin_date`, `checkout_date`, `source`, `status`, `created_at`) VALUES
(3, 5, '2025-12-07', '2025-12-08', 'online', 'cancelled', '2025-12-07 10:41:30'),
(4, 5, '2025-12-07', '2025-12-08', 'online', 'cancelled', '2025-12-07 12:02:01'),
(5, 5, '2025-12-11', '2025-12-12', 'online', 'cancelled', '2025-12-08 12:15:44'),
(6, 5, '2025-12-18', '2025-12-20', 'online', 'checked_in', '2025-12-08 12:32:01'),
(7, 5, '2025-12-26', '2025-12-31', 'online', 'checked_in', '2025-12-08 12:57:06'),
(8, 5, '2025-12-10', '2025-12-11', 'online', 'cancelled', '2025-12-09 14:36:18'),
(9, 5, '2025-12-11', '2025-12-12', 'online', 'cancelled', '2025-12-10 00:28:49'),
(10, 15, '2025-12-10', '2025-12-11', 'online', 'cancelled', '2025-12-10 00:49:59'),
(11, 15, '2025-12-11', '2025-12-12', 'online', 'cancelled', '2025-12-10 01:15:10'),
(12, 15, '2025-12-10', '2025-12-12', 'online', 'cancelled', '2025-12-10 02:41:23'),
(15, 15, '2025-12-11', '2025-12-12', 'online', 'confirmed', '2025-12-11 01:12:41');

-- --------------------------------------------------------

--
-- Table structure for table `booking_rooms`
--

DROP TABLE IF EXISTS `booking_rooms`;
CREATE TABLE IF NOT EXISTS `booking_rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `price_per_night` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_br_booking` (`booking_id`),
  KEY `fk_br_room` (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COMMENT='Chi tiết phòng đặt';

--
-- Dumping data for table `booking_rooms`
--

INSERT INTO `booking_rooms` (`id`, `booking_id`, `room_id`, `price_per_night`) VALUES
(3, 3, 6, '200000.00'),
(4, 4, 5, '500000.00'),
(5, 5, 1, '200000.00'),
(6, 6, 1, '200000.00'),
(7, 7, 1, '200000.00'),
(8, 8, 3, '200000.00'),
(9, 9, 4, '200000.00'),
(10, 10, 8, '500000.00'),
(11, 11, 8, '500000.00'),
(12, 12, 6, '200000.00'),
(15, 15, 2, '1000000.00');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
CREATE TABLE IF NOT EXISTS `invoices` (
  `invoice_id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `payment_id` int(11) NOT NULL,
  `room_charge` decimal(12,2) DEFAULT '0.00',
  `service_charge` decimal(12,2) DEFAULT '0.00',
  `total_amount` decimal(12,2) GENERATED ALWAYS AS ((`room_charge` + `service_charge`)) STORED,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`invoice_id`),
  UNIQUE KEY `booking_id` (`booking_id`),
  KEY `fk_invoices_payment` (`payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Hóa đơn';

-- --------------------------------------------------------

--
-- Table structure for table `otp_logs`
--

DROP TABLE IF EXISTS `otp_logs`;
CREATE TABLE IF NOT EXISTS `otp_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `otp_code` varchar(10) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `otp_logs`
--

INSERT INTO `otp_logs` (`id`, `email`, `otp_code`, `created_at`) VALUES
(1, 'nguyen123@gmail.com', '450814', '2025-11-29 09:39:19'),
(2, 'nguye123n@gmail.com', '989303', '2025-11-29 09:44:38'),
(3, 'nhunguyent68@gmail.com', '358146', '2025-11-29 09:46:18'),
(4, 'nguyen@gmail.com', '971621', '2025-11-29 18:22:29');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
  `payment_id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','vnpay','momo','zalopay') DEFAULT 'cash' COMMENT 'Phương thức thanh toán',
  `payment_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày thanh toán',
  `transaction_id` varchar(100) DEFAULT NULL COMMENT 'Mã giao dịch VNPay/Momo',
  `status` enum('pending','completed','failed','refunded') DEFAULT 'pending' COMMENT 'Trạng thái thanh toán',
  `notes` text COMMENT 'Ghi chú',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `fk_payments_booking` (`booking_id`),
  KEY `idx_status` (`status`),
  KEY `idx_payment_date` (`payment_date`),
  KEY `idx_payment_method` (`payment_method`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COMMENT='Thanh toán';

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `booking_id`, `amount`, `payment_method`, `payment_date`, `transaction_id`, `status`, `notes`, `created_at`) VALUES
(65, 7, '1060000.00', 'vnpay', '2025-12-10 20:09:35', '15333131', 'completed', NULL, '2025-12-10 13:08:58'),
(69, 15, '1000000.00', 'vnpay', '2025-12-11 21:05:53', NULL, 'completed', NULL, '2025-12-11 01:13:02'),
(70, 15, '1000000.00', 'vnpay', '2025-12-11 08:22:39', '15333889', 'completed', NULL, '2025-12-11 01:22:12');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE IF NOT EXISTS `rooms` (
  `room_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID phòng',
  `room_number` varchar(20) NOT NULL COMMENT 'Số phòng',
  `room_type_id` int(11) NOT NULL COMMENT 'Loại phòng',
  `status` enum('available','booked','occupied','cleaning','maintenance') DEFAULT 'available' COMMENT 'Trạng thái phòng',
  `image` text COMMENT 'hình ảnh',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `room_number` (`room_number`),
  KEY `fk_rooms_type` (`room_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COMMENT='Danh sách phòng';

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`room_id`, `room_number`, `room_type_id`, `status`, `image`, `created_at`) VALUES
(1, '101', 1, 'booked', '/uploads/1764080690563-664358435.webp', '2025-11-25 14:24:50'),
(2, '104', 2, 'booked', '/uploads/1764080910610-397958369.webp', '2025-11-25 14:28:30'),
(3, '103', 1, 'available', '/uploads/1764309120471-639991853.avif', '2025-11-28 05:52:00'),
(4, '105', 1, 'available', '/uploads/1764309139037-97929171.avif', '2025-11-28 05:52:19'),
(5, '201', 3, 'available', '/uploads/1764309167836-467530585.avif', '2025-11-28 05:52:47'),
(6, '202', 1, 'booked', '/uploads/1764309191646-404264216.avif', '2025-11-28 05:53:11'),
(7, '102', 1, 'available', '/uploads/1764856492180-14348360.avif', '2025-11-28 06:44:59'),
(8, '205', 4, 'booked', '/uploads/1765334814381-513039269.avif', '2025-12-10 00:46:37');

-- --------------------------------------------------------

--
-- Table structure for table `room_types`
--

DROP TABLE IF EXISTS `room_types`;
CREATE TABLE IF NOT EXISTS `room_types` (
  `room_type_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID loại phòng',
  `name` varchar(100) NOT NULL COMMENT 'Tên loại phòng',
  `capacity` int(11) NOT NULL COMMENT 'Số người',
  `base_price` decimal(10,2) NOT NULL COMMENT 'Giá phòng',
  `description` text COMMENT 'Mô tả',
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`room_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='Bảng loại phòng';

--
-- Dumping data for table `room_types`
--

INSERT INTO `room_types` (`room_type_id`, `name`, `capacity`, `base_price`, `description`, `is_active`, `created_at`) VALUES
(1, 'Phòng Thường', 2, '200000.00', 'Một giường', 1, '2025-11-25 14:11:13'),
(2, 'Phòng lớn', 10, '1000000.00', '', 1, '2025-11-26 01:06:41'),
(3, 'Phòng Thường 2', 4, '500000.00', '2 Giường', 1, '2025-11-28 05:49:59'),
(4, 'demo', 3, '500000.00', 'demo', 1, '2025-12-09 12:46:15');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `service_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `unit` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='Dịch vụ';

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`service_id`, `name`, `price`, `unit`, `created_at`) VALUES
(1, 'nước ngọt', '10000.00', 'Chai', '2025-12-04 14:24:09'),
(2, 'Cơm', '25000.00', 'Dĩa', '2025-12-04 14:24:34'),
(3, 'Giặt ủi', '14000.00', 'kg', '2025-12-10 01:10:18');

-- --------------------------------------------------------

--
-- Table structure for table `service_usage`
--

DROP TABLE IF EXISTS `service_usage`;
CREATE TABLE IF NOT EXISTS `service_usage` (
  `usage_id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT '1',
  `total_price` decimal(10,2) NOT NULL,
  `usage_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`usage_id`),
  KEY `fk_su_booking` (`booking_id`),
  KEY `fk_su_service` (`service_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COMMENT='Sử dụng dịch vụ';

--
-- Dumping data for table `service_usage`
--

INSERT INTO `service_usage` (`usage_id`, `booking_id`, `service_id`, `quantity`, `total_price`, `usage_time`) VALUES
(2, 7, 1, 1, '10000.00', '2025-12-09 20:14:27'),
(3, 7, 2, 2, '50000.00', '2025-12-09 20:33:24'),
(6, 11, 2, 1, '25000.00', '2025-12-10 08:15:40');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID khách',
  `full_name` varchar(150) NOT NULL COMMENT 'Họ tên',
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `id_card` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` enum('user','staff','admin') NOT NULL DEFAULT 'user',
  `password` varchar(255) NOT NULL DEFAULT '' COMMENT 'Mật khẩu (hash)',
  `is_verified` tinyint(1) DEFAULT '0',
  `otp_code` varchar(10) DEFAULT NULL,
  `otp_expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `phone`, `email`, `id_card`, `created_at`, `role`, `password`, `is_verified`, `otp_code`, `otp_expires_at`) VALUES
(3, 'admin', '123456789', 'admin@gmail.com', NULL, '2025-11-25 14:12:13', 'admin', '$2b$10$8T37vJNGkNBPcTfFLrpGUuWm.uugdn/rmg.36nPXGlkxvW4TK1.S.', 1, NULL, NULL),
(5, 'Admin User', '0909000000', 'admin@example.com', NULL, '2025-11-27 11:30:57', 'admin', '$2b$10$IsltggBBz6Env3P45UGXrenV.kgLQX6C8/Vw/.qhDVklM5dbu6ZQG', 1, NULL, NULL),
(13, 'SV Nguyễn Thị C', NULL, 'nguye123n@gmail.com', NULL, '2025-11-29 02:44:38', 'user', '$2b$10$i84SDxgaBp6wDKJwyUgWxOtTWE7Rs8HHTrSOtiYhbkuDM2OP7nyni', 1, NULL, NULL),
(14, 'trần như nguyên ', NULL, 'nhunguyent68@gmail.com', NULL, '2025-11-29 02:46:18', 'user', '$2b$10$pSi4YatcweWbST1FnptowOHvCkU/ALAOI3p8UVcB9DC2ET7xI0rfe', 1, NULL, NULL),
(15, 'SV Nguyễn Thị b', NULL, 'nguyen@gmail.com', NULL, '2025-11-29 11:22:29', 'user', '$2b$10$4O6Q1r1H2tIEA5cNyrKOn.e9sfrq58bXRE19Qngfdhql3Du56Q.jK', 1, NULL, NULL),
(16, 'SV Nguyễn Thị c', '0388065951', 'user@gmail.com', '123456789012', '2025-12-10 12:13:46', 'user', '$2b$10$qYpVFHBqScTozYXYdJqAi.DbM5A0qLvScgfiW3FaajK53OOGx0k1K', 1, NULL, NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `fk_bookings_customer` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `booking_rooms`
--
ALTER TABLE `booking_rooms`
  ADD CONSTRAINT `fk_br_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_br_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`);

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `fk_invoices_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_invoices_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`payment_id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payments_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE;

--
-- Constraints for table `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `fk_rooms_type` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`room_type_id`) ON UPDATE CASCADE;

--
-- Constraints for table `service_usage`
--
ALTER TABLE `service_usage`
  ADD CONSTRAINT `fk_su_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_su_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
