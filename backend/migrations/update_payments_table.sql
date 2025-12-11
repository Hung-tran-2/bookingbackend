-- =====================================================
-- SAFE MIGRATION: ALTER Payments Table for VNPay
-- Sử dụng ALTER TABLE để giữ nguyên dữ liệu
-- =====================================================

-- Step 1: Backup payments table trước khi thay đổi
CREATE TABLE IF NOT EXISTS `payments_backup_20251206` LIKE `payments`;
INSERT INTO `payments_backup_20251206` SELECT * FROM `payments`;

-- Step 2: Đổi tên cột 'method' thành 'payment_method' và cập nhật ENUM
ALTER TABLE `payments` 
  CHANGE COLUMN `method` `payment_method` ENUM('cash','vnpay','momo','zalopay') DEFAULT 'cash' COMMENT 'Phương thức thanh toán';

-- Step 3: Đổi tên cột 'payment_time' thành 'payment_date'
ALTER TABLE `payments` 
  CHANGE COLUMN `payment_time` `payment_date` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày thanh toán';

-- Step 4: Đổi tên cột 'transaction_code' thành 'transaction_id' và đổi kiểu
ALTER TABLE `payments` 
  CHANGE COLUMN `transaction_code` `transaction_id` VARCHAR(100) DEFAULT NULL COMMENT 'Mã giao dịch VNPay/Momo';

-- Step 5: Đổi cột 'status' từ TINYINT sang ENUM
ALTER TABLE `payments` 
  CHANGE COLUMN `status` `status` ENUM('pending','completed','failed','refunded') DEFAULT 'pending' COMMENT 'Trạng thái thanh toán';

-- Step 6: Thêm cột 'notes' nếu chưa có
ALTER TABLE `payments` 
  ADD COLUMN IF NOT EXISTS `notes` TEXT NULL COMMENT 'Ghi chú' AFTER `status`;

-- Step 7: Thêm cột 'created_at' nếu chưa có
ALTER TABLE `payments` 
  ADD COLUMN IF NOT EXISTS `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP AFTER `notes`;

-- Step 8: Thêm indexes để tăng performance
ALTER TABLE `payments` 
  ADD INDEX IF NOT EXISTS `idx_status` (`status`),
  ADD INDEX IF NOT EXISTS `idx_payment_date` (`payment_date`),
  ADD INDEX IF NOT EXISTS `idx_payment_method` (`payment_method`);

-- Step 9: Kiểm tra kết quả
DESCRIBE `payments`;

-- Step 10: Hiển thị dữ liệu đã migrate
SELECT COUNT(*) as total_payments FROM `payments`;

-- Step 11: Thông báo thành công
SELECT 'Migration completed successfully! Payments table updated for VNPay integration.' AS Status;
SELECT 'Old data preserved. Backup table: payments_backup_20251206' AS Backup_Info;
