// controllers/roomController.js
const fs = require("fs");
const path = require("path");
const { Room, RoomType, Booking } = require("../models");
const {
  successResponse,
  errorResponse,
  paginationResponse,
} = require("../utils/responseFormatter");
const { Op } = require("sequelize");

// Dùng chung cho mọi chỗ liên quan status
const VALID_STATUS = [
  "available",
  "booked",
  "occupied",
  "cleaning",
  "maintenance",
];

/**
 * Get all rooms with pagination
 */
/**
 * Get all rooms with pagination + filter by status (optional)
 */
const getAllRooms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // dùng hàm lọc status
    const where = filterRoomByStatus(req.query);

    const { count, rows } = await Room.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: RoomType,
          as: "roomType",
          attributes: ["room_type_id", "name", "base_price", "capacity"],
        },
      ],
      order: [["room_number", "DESC"]],
    });

    res.json(paginationResponse(rows, page, limit, count));
  } catch (error) {
    res.status(500).json(
      errorResponse("Error fetching rooms", error.message)
    );
  }
};
const filterRoomByStatus = (query) => {
  const where = {};
  const { status } = query;

  if (status && VALID_STATUS.includes(status)) {
    where.status = status; // => chỉ lấy phòng có { status: 'booked' }
  }

  return where;
};



/**
 * Get available rooms by date range
 * (hiện mới lọc status = 'available', sau thêm logic ngày booking sau)
 */
const getAvailableRooms = async (req, res) => {
  try {
    const { checkin_date, checkout_date } = req.query;

    if (!checkin_date || !checkout_date) {
      return res
        .status(400)
        .json(errorResponse("Checkin and checkout dates are required"));
    }

    const allRooms = await Room.findAll({
      where: { status: "available" },
      include: [
        {
          model: RoomType,
          as: "roomType",
        },
      ],
    });

    res.json(successResponse(allRooms));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse("Error fetching available rooms", error.message));
  }
};

/**
 * Lấy chi tiết 1 phòng kèm thông tin loại phòng
 */
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id, {
      include: [
        {
          model: RoomType,
          as: "roomType",
        },
      ],
    });

    if (!room) {
      return res.status(404).json(errorResponse("Room not found"));
    }

    res.json(successResponse(room));
  } catch (error) {
    res.status(500).json(errorResponse("Error fetching room", error.message));
  }
};

/**
 * Create new room (có upload ảnh)
 */
const createRoom = async (req, res) => {
<<<<<<< HEAD
  try {
    const { room_number, room_type_id, status } = req.body;

    if (!room_number || !room_type_id) {
      return res
        .status(400)
        .json(errorResponse("Room number and room type are required"));
=======
    try {
        const { room_number, room_type_id, status } = req.body;

        if (!room_number || !room_type_id) {
            return res.status(400).json(errorResponse('Room number and room type are required'));
        }

        // Get image path from uploaded file
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const room = await Room.create({
            room_number,
            room_type_id,
            status: status || 'available',
            image: imagePath
        });

        res.status(201).json(successResponse(room, 'Room created successfully'));
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json(errorResponse('Room number already exists'));
        }
        res.status(500).json(errorResponse('Error creating room', error.message));
>>>>>>> 11923ed3277ffd570a2d36fe7015645dcee4c27a
    }

    // file do multer xử lý gắn vào req.file
    const imageFile = req.file ? req.file.filename : null;

    const finalStatus = VALID_STATUS.includes(status) ? status : "available";

    const room = await Room.create({
      room_number,
      room_type_id,
      status: finalStatus,
      image: imageFile,
    });

    res.status(201).json(successResponse(room, "Room created successfully"));
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json(errorResponse("Room number already exists"));
    }

    res.status(500).json(errorResponse("Error creating room", error.message));
  }
};

/**
 * Update room (có thể đổi ảnh)
 */
const updateRoom = async (req, res) => {
<<<<<<< HEAD
  try {
    const { id } = req.params;
    const { room_number, room_type_id, status } = req.body;

    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json(errorResponse("Room not found"));
=======
    try {
        const { id } = req.params;
        const { room_number, room_type_id, status } = req.body;

        const room = await Room.findByPk(id);
        if (!room) {
            return res.status(404).json(errorResponse('Room not found'));
        }

        // Get new image path if file was uploaded
        const imagePath = req.file ? `/uploads/${req.file.filename}` : room.image;

        await room.update({
            room_number: room_number || room.room_number,
            room_type_id: room_type_id || room.room_type_id,
            status: status || room.status,
            image: imagePath
        });

        res.json(successResponse(room, 'Room updated successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error updating room', error.message));
>>>>>>> 11923ed3277ffd570a2d36fe7015645dcee4c27a
    }

    // nếu có upload file mới -> thay ảnh, không thì giữ ảnh cũ
    let imageFile = room.image;

    if (req.file) {
      //  XÓA ẢNH CŨ NẾU TỒN TẠI
      if (room.image) {
        // chỉnh lại đường dẫn cho đúng cấu trúc project của bạn
        const oldImagePath = path.join(
          process.cwd(), // thư mục root của project
          "uploads",
          "rooms",
          room.image
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // ✅ 2. GÁN ẢNH MỚI
      imageFile = req.file.filename;
    }

    const finalStatus = VALID_STATUS.includes(status) ? status : room.status;

    await room.update({
      room_number: room_number ?? room.room_number,
      room_type_id: room_type_id ?? room.room_type_id,
      status: finalStatus,
      image: imageFile,
    });

    res.json(successResponse(room, "Room updated successfully"));
  } catch (error) {
    res.status(500).json(errorResponse("Error updating room", error.message));
  }
};

/**
 * Update room status (chỉ đổi trạng thái)
 */
const updateRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !VALID_STATUS.includes(status)) {
      return res.status(400).json(errorResponse("Invalid status"));
    }

    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json(errorResponse("Room not found"));
    }

    await room.update({ status });

    res.json(successResponse(room, "Room status updated successfully"));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse("Error updating room status", error.message));
  }
};

/**
 * Delete room
 * Chỉ xóa phòng chưa có booking
 */
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findByPk(id);
    if (!room) {
      return res.status(404).json(errorResponse("Room not found"));
    }

    const bookingCount = await Booking.count({ where: { room_id: id } });
    if (bookingCount > 0) {
      return res
        .status(400)
        .json(errorResponse("Cannot delete: room already has bookings"));
    }

    await room.destroy();
    res.json(successResponse(null, "Room deleted successfully"));
  } catch (error) {
    res.status(500).json(errorResponse("Error deleting room", error.message));
  }
};

module.exports = {
  getAllRooms,
  getAvailableRooms,
  getRoomById,
  createRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom,
};
