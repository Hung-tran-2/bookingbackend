const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BookingRoom = sequelize.define('BookingRoom', {
    id: {
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
    room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'rooms',
            key: 'room_id'
        }
    },
    price_per_night: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    }
}, {
    tableName: 'booking_rooms',
    timestamps: false,
    comment: 'Chi tiết phòng đặt'
});

module.exports = BookingRoom;
