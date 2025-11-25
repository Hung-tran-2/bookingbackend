const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Room = sequelize.define('Room', {
    room_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    room_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        comment: 'Số phòng'
    },
    room_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'room_types',
            key: 'room_type_id'
        }
    },
    status: {
        type: DataTypes.ENUM('available', 'booked', 'occupied', 'cleaning', 'maintenance'),
        defaultValue: 'available'
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'rooms',
    timestamps: false,
});

module.exports = Room;
