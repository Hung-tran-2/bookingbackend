const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
    payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'bookings',
            key: 'booking_id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    payment_method: {
        type: DataTypes.ENUM('cash', 'vnpay', 'momo', 'zalopay'),
        defaultValue: 'cash',
        comment: 'Phương thức thanh toán'
    },
    payment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Ngày thanh toán'
    },
    transaction_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Mã giao dịch từ VNPay/Momo'
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending',
        comment: 'Trạng thái thanh toán'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Ghi chú'
    }
}, {
    tableName: 'payments',
    timestamps: false,
    comment: 'Thanh toán'
});

module.exports = Payment;
