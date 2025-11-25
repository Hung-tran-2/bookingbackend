const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RoomType = sequelize.define('RoomType', {
    room_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID loại phòng'
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Tên loại phòng'
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Số người',
        validate: {
            min: 1
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Giá phòng',
        validate: {
            min: 0
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Mô tả'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'room_types',
    timestamps: false,
    comment: 'Bảng loại phòng'
});

module.exports = RoomType;
