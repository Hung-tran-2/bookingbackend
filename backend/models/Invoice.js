const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Invoice = sequelize.define('Invoice', {
    invoice_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'bookings',
            key: 'booking_id'
        }
    },
    payment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'payments',
            key: 'payment_id'
        }
    },
    room_charge: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0.00
    },
    service_charge: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0.00
    },
    total_amount: {
        type: DataTypes.VIRTUAL,
        get() {
            const roomCharge = parseFloat(this.getDataValue('room_charge')) || 0;
            const serviceCharge = parseFloat(this.getDataValue('service_charge')) || 0;
            return (roomCharge + serviceCharge).toFixed(2);
        }
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'invoices',
    timestamps: false,
    comment: 'Hóa đơn'
});

module.exports = Invoice;
