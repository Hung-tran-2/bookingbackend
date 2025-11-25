const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hotel Booking API',
            version: '1.0.0',
            description: 'API documentation for Hotel Booking Management System',
            contact: {
                name: 'API Support',
                email: 'support@hotelbooking.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token obtained from login/register'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        user_id: {
                            type: 'integer',
                            description: 'User ID'
                        },
                        full_name: {
                            type: 'string',
                            description: 'Full name of the user'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address'
                        },
                        phone: {
                            type: 'string',
                            description: 'Phone number'
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'staff', 'admin'],
                            description: 'User role'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                RoomType: {
                    type: 'object',
                    properties: {
                        room_type_id: {
                            type: 'integer'
                        },
                        name: {
                            type: 'string',
                            description: 'Room type name'
                        },
                        capacity: {
                            type: 'integer',
                            description: 'Maximum number of guests'
                        },
                        price: {
                            type: 'number',
                            format: 'decimal',
                            description: 'Price per night'
                        },
                        description: {
                            type: 'string'
                        },
                        is_active: {
                            type: 'boolean'
                        }
                    }
                },
                Room: {
                    type: 'object',
                    properties: {
                        room_id: {
                            type: 'integer'
                        },
                        room_number: {
                            type: 'string',
                            description: 'Room number'
                        },
                        room_type_id: {
                            type: 'integer'
                        },
                        status: {
                            type: 'string',
                            enum: ['available', 'occupied', 'maintenance', 'reserved'],
                            description: 'Room status'
                        },
                        image: {
                            type: 'string',
                            description: 'Room image URL'
                        }
                    }
                },
                Booking: {
                    type: 'object',
                    properties: {
                        booking_id: {
                            type: 'integer'
                        },
                        user_id: {
                            type: 'integer'
                        },
                        checkin_date: {
                            type: 'string',
                            format: 'date',
                            description: 'Check-in date (YYYY-MM-DD)'
                        },
                        checkout_date: {
                            type: 'string',
                            format: 'date',
                            description: 'Check-out date (YYYY-MM-DD)'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out'],
                            description: 'Booking status'
                        },
                        source: {
                            type: 'string',
                            enum: ['website', 'phone', 'walk_in'],
                            description: 'Booking source'
                        }
                    }
                },
                Service: {
                    type: 'object',
                    properties: {
                        service_id: {
                            type: 'integer'
                        },
                        name: {
                            type: 'string',
                            description: 'Service name'
                        },
                        price: {
                            type: 'number',
                            format: 'decimal',
                            description: 'Service price'
                        },
                        unit: {
                            type: 'string',
                            description: 'Unit of measurement'
                        }
                    }
                },
                Payment: {
                    type: 'object',
                    properties: {
                        payment_id: {
                            type: 'integer'
                        },
                        booking_id: {
                            type: 'integer'
                        },
                        amount: {
                            type: 'number',
                            format: 'decimal',
                            description: 'Payment amount'
                        },
                        method: {
                            type: 'string',
                            enum: ['cash', 'momo', 'vnpay'],
                            description: 'Payment method'
                        },
                        status: {
                            type: 'boolean',
                            description: 'Payment status (true = paid, false = pending)'
                        },
                        transaction_code: {
                            type: 'string',
                            description: 'Transaction code from payment gateway'
                        },
                        payment_time: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Invoice: {
                    type: 'object',
                    properties: {
                        invoice_id: {
                            type: 'integer'
                        },
                        booking_id: {
                            type: 'integer'
                        },
                        room_charge: {
                            type: 'number',
                            format: 'decimal',
                            description: 'Total room charges'
                        },
                        service_charge: {
                            type: 'number',
                            format: 'decimal',
                            description: 'Total service charges'
                        },
                        total_amount: {
                            type: 'number',
                            format: 'decimal',
                            description: 'Total invoice amount'
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            description: 'Error message'
                        },
                        error: {
                            type: 'object',
                            description: 'Error details'
                        }
                    }
                },
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            description: 'Success message'
                        },
                        data: {
                            type: 'object',
                            description: 'Response data'
                        }
                    }
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        page: {
                            type: 'integer',
                            description: 'Current page number'
                        },
                        limit: {
                            type: 'integer',
                            description: 'Items per page'
                        },
                        total: {
                            type: 'integer',
                            description: 'Total number of items'
                        },
                        totalPages: {
                            type: 'integer',
                            description: 'Total number of pages'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Authentication',
                description: 'Authentication and user profile management'
            },
            {
                name: 'Users',
                description: 'User management operations'
            },
            {
                name: 'Room Types',
                description: 'Room type management'
            },
            {
                name: 'Rooms',
                description: 'Room management and availability'
            },
            {
                name: 'Bookings',
                description: 'Booking management'
            },
            {
                name: 'Services',
                description: 'Service management'
            },
            {
                name: 'Service Usage',
                description: 'Service usage tracking for bookings'
            },
            {
                name: 'Payments',
                description: 'Payment processing'
            },
            {
                name: 'Invoices',
                description: 'Invoice generation and management'
            }
        ]
    },
    apis: ['./routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
