const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
    booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID đơn đặt'
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Khách đặt',
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    checkin_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    checkout_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isAfterCheckin(value) {
                if (value <= this.checkin_date) {
                    throw new Error('Checkout date must be after checkin date');
                }
            }
        }
    },
    source: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out'),
        defaultValue: 'pending'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'bookings',
    timestamps: false,
    comment: 'Đơn đặt phòng'
});

module.exports = Booking;
