const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID khách'
    },
    full_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        comment: 'Họ tên'
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    id_card: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Mật khẩu (hash)'
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    role: {
        type: DataTypes.ENUM('user', 'staff', 'admin'),
        allowNull: false,
        defaultValue: 'user'
    },
    otp_code: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    otp_expires_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = User;
