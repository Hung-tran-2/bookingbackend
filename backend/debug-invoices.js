const { Payment, Booking, User, BookingRoom, ServiceUsage, Room } = require('./models');

async function debugInvoices() {
    try {
        const count = await Payment.count();
        console.log('Total Payments in DB:', count);

        const { count: queryCount, rows } = await Payment.findAndCountAll({
            include: [
                {
                    model: Booking,
                    as: 'booking',
                    include: [
                        { model: User, as: 'user', attributes: ['user_id', 'full_name', 'email', 'phone'] },
                        {
                            model: BookingRoom,
                            as: 'bookingRooms',
                            include: [{ model: Room, as: 'room' }]
                        },
                        {
                            model: ServiceUsage,
                            as: 'serviceUsages'
                        }
                    ]
                }
            ],
            limit: 10,
            offset: 0,
            order: [['payment_date', 'DESC']]
        });

        console.log('Query returned count:', queryCount);
        console.log('Query returned rows:', rows.length);
        if (rows.length > 0) {
            console.log('First row:', JSON.stringify(rows[0], null, 2));
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

debugInvoices();
