const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const RoomType = require('./RoomType');
const Room = require('./Room');
const Booking = require('./Booking');
const BookingRoom = require('./BookingRoom');
const Service = require('./Service');
const ServiceUsage = require('./ServiceUsage');
const Payment = require('./Payment');
const Invoice = require('./Invoice');

// Define associations

// User <-> Booking (One-to-Many)
User.hasMany(Booking, {
    foreignKey: 'user_id',
    as: 'bookings',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Booking.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// RoomType <-> Room (One-to-Many)
RoomType.hasMany(Room, {
    foreignKey: 'room_type_id',
    as: 'rooms',
    onUpdate: 'CASCADE'
});
Room.belongsTo(RoomType, {
    foreignKey: 'room_type_id',
    as: 'roomType'
});

// Booking <-> Room (Many-to-Many through BookingRoom)
Booking.belongsToMany(Room, {
    through: BookingRoom,
    foreignKey: 'booking_id',
    otherKey: 'room_id',
    as: 'rooms'
});
Room.belongsToMany(Booking, {
    through: BookingRoom,
    foreignKey: 'room_id',
    otherKey: 'booking_id',
    as: 'bookings'
});

// Direct associations for BookingRoom
BookingRoom.belongsTo(Booking, {
    foreignKey: 'booking_id',
    as: 'booking'
});
BookingRoom.belongsTo(Room, {
    foreignKey: 'room_id',
    as: 'room'
});

// Booking <-> Service (Many-to-Many through ServiceUsage)
Booking.belongsToMany(Service, {
    through: ServiceUsage,
    foreignKey: 'booking_id',
    otherKey: 'service_id',
    as: 'services'
});
Service.belongsToMany(Booking, {
    through: ServiceUsage,
    foreignKey: 'service_id',
    otherKey: 'booking_id',
    as: 'bookings'
});

// Direct associations for ServiceUsage
ServiceUsage.belongsTo(Booking, {
    foreignKey: 'booking_id',
    as: 'booking'
});
ServiceUsage.belongsTo(Service, {
    foreignKey: 'service_id',
    as: 'service'
});

// Booking <-> Payment (One-to-Many)
Booking.hasMany(Payment, {
    foreignKey: 'booking_id',
    as: 'payments',
    onDelete: 'CASCADE'
});
Payment.belongsTo(Booking, {
    foreignKey: 'booking_id',
    as: 'booking'
});

// Booking <-> Invoice (One-to-One)
Booking.hasOne(Invoice, {
    foreignKey: 'booking_id',
    as: 'invoice',
    onDelete: 'CASCADE'
});
Invoice.belongsTo(Booking, {
    foreignKey: 'booking_id',
    as: 'booking'
});

// Payment <-> Invoice (One-to-Many)
Payment.hasMany(Invoice, {
    foreignKey: 'payment_id',
    as: 'invoices',
    onDelete: 'CASCADE'
});
Invoice.belongsTo(Payment, {
    foreignKey: 'payment_id',
    as: 'payment'
});

// Export all models and sequelize instance
module.exports = {
    sequelize,
    User,
    RoomType,
    Room,
    Booking,
    BookingRoom,
    Service,
    ServiceUsage,
    Payment,
    Invoice
};
