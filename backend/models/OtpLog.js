const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OtpLog = sequelize.define('OtpLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    otp_code: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'otp_logs',
    timestamps: false
});

module.exports = OtpLog;
