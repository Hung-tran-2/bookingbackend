const { Sequelize } = require('sequelize');
require('dotenv').config();

// Kết nối database
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false, // Tắt log SQL queries
        timezone: '+07:00'
    }
);

module.exports = { sequelize };
