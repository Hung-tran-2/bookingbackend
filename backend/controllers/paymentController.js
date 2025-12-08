// controllers/paymentController.js
const { Payment, Booking } = require('../models');
const { sequelize } = require('../config/database');   // ✅ LẤY sequelize TỪ config
const {
  successResponse,
  errorResponse,
  paginationResponse,      // ✅ THÊM paginationResponse
} = require('../utils/responseFormatter');
const { QueryTypes } = require('sequelize');           // ✅ Dùng cho raw query

/**
 * ✅ Lấy toàn bộ payment (cho màn Payments)
 * GET /payments?page=&limit=
 */
const getAllPayments = async (req, res) => {
  try {
    const page  = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Payment.findAndCountAll({
      limit,
      offset,
      order: [['payment_time', 'DESC']],
    });

    // dùng chung formatter như các chỗ khác
    res.json(paginationResponse(rows, page, limit, count));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse('Error fetching payments', error.message));
  }
};

/**
 * Get payments for a booking
 */
const getBookingPayments = async (req, res) => {
  try {
    const { booking_id } = req.params;

    const payments = await Payment.findAll({
      where: { booking_id },
      order: [['payment_time', 'DESC']],
    });

    res.json(successResponse(payments));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse('Error fetching payments', error.message));
  }
};

/**
 * Create payment
 */
const createPayment = async (req, res) => {
  try {
    const { booking_id, amount, method, transaction_code } = req.body;

    if (!booking_id || !amount) {
      return res
        .status(400)
        .json(errorResponse('Booking ID and amount are required'));
    }

    // Check if booking exists
    const booking = await Booking.findByPk(booking_id);
    if (!booking) {
      return res.status(404).json(errorResponse('Booking not found'));
    }

    const payment = await Payment.create({
      booking_id,
      amount,
      method: method || 'cash',
      transaction_code,
      status: true,
    });

    res
      .status(201)
      .json(successResponse(payment, 'Payment created successfully'));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse('Error creating payment', error.message));
  }
};

/**
 * Get payment by ID
 */
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Booking,
          as: 'booking',
        },
      ],
    });

    if (!payment) {
      return res.status(404).json(errorResponse('Payment not found'));
    }

    res.json(successResponse(payment));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse('Error fetching payment', error.message));
  }
};

/**
 * Delete payment
 */
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json(errorResponse('Payment not found'));
    }

    await payment.destroy();
    res.json(successResponse(null, 'Payment deleted successfully'));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse('Error deleting payment', error.message));
  }
};

/**
 * ✅ Thống kê thanh toán theo tháng & quý trong 1 năm
 * GET /payments/stats?year=2025
 */
const getPaymentStats = async (req, res) => {
  try {
    const year = parseInt(req.query.year, 10) || new Date().getFullYear();

    // ----- THỐNG KÊ THEO THÁNG -----
    const monthly = await sequelize.query(
      `
      SELECT 
        MONTH(payment_time) AS month,
        SUM(amount) AS total
      FROM payments
      WHERE YEAR(payment_time) = :year
        AND status = 1
      GROUP BY MONTH(payment_time)
      ORDER BY month
      `,
      {
        replacements: { year },
        type: QueryTypes.SELECT,
      }
    );

    // ----- THỐNG KÊ THEO QUÝ -----
    const quarterly = await sequelize.query(
      `
      SELECT 
        QUARTER(payment_time) AS quarter,
        SUM(amount) AS total
      FROM payments
      WHERE YEAR(payment_time) = :year
        AND status = 1
      GROUP BY QUARTER(payment_time)
      ORDER BY quarter
      `,
      {
        replacements: { year },
        type: QueryTypes.SELECT,
      }
    );

    // Chuẩn hóa dữ liệu quý Q1-Q4
    const quarters = [1, 2, 3, 4].map((q) => {
      const found = quarterly.find((i) => i.quarter === q);
      return {
        quarter: `Q${q}`,
        total: found ? Number(found.total) : 0,
      };
    });

    res.json(
      successResponse({
        year,
        months: monthly.map((m) => ({
          month: m.month,
          total: Number(m.total),
        })),
        quarters,
      })
    );
  } catch (error) {
    res
      .status(500)
      .json(
        errorResponse('Error fetching payment statistics', error.message)
      );
  }
};

module.exports = {
  getAllPayments,       // ✅ dùng cho GET /payments
  getBookingPayments,
  createPayment,
  getPaymentById,
  deletePayment,
  getPaymentStats,      // ✅ dùng cho GET /payments/stats
};
