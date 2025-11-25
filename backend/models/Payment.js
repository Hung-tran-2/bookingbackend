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
    method: {
        type: DataTypes.ENUM('cash', 'momo', 'vnpay'),
        defaultValue: 'cash'
    },
    payment_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    transaction_code: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    tableName: 'payments',
    timestamps: false,
    comment: 'Thanh toán'
});

module.exports = Payment;
