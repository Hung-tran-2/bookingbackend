const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Room = sequelize.define('Room', {
    room_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID phòng'
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
        comment: 'Loại phòng',
        references: {
            model: 'room_types',
            key: 'room_type_id'
        }
    },
    status: {
        type: DataTypes.ENUM('available', 'booked', 'maintenance'),
        defaultValue: 'available',
        comment: 'Trạng thái'
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'hình ảnh'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'rooms',
    timestamps: false,
    comment: 'Danh sách phòng'
});

module.exports = Room;
