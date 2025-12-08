const { RoomType } = require("../models");
const { Room } = require("../models");
const {
  successResponse,
  errorResponse,
  paginationResponse,
} = require("../utils/responseFormatter");

/**
 * Get all room types
 * Lấy danh sách tất cả loại phòng có phân trang
 */
const getAllRoomTypes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await RoomType.findAndCountAll({
      limit,
      offset,
      order: [["room_type_id", "ASC"]],
    });

    res.json(paginationResponse(rows, page, limit, count));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse("Error fetching room types", error.message));
  }
};

/**
 * Get active room types only
 * Chỉ lấy loại phòng đang hoạt động
 */
const getActiveRoomTypes = async (req, res) => {
  try {
    const roomTypes = await RoomType.findAll({
      where: { is_active: true }, //chỉ lấy loại phòng cho phép đặt
      order: [["base_price", "ASC"]], // sắp xếp giá tăng dần
    });

    res.json(successResponse(roomTypes));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse("Error fetching active room types", error.message));
  }
};

/**
 * Get room type by ID
 * Lấy chi tiết 1 loại phòng + ds phòng thuộc loại đó
 */
const getRoomTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    const roomType = await RoomType.findByPk(id, {
      include: [
        {
          model: Room,
          as: "rooms",
          attributes: ["room_id", "room_number", "status"],
        },
      ],
    });

    if (!roomType) {
      return res.status(404).json(errorResponse("Room type not found"));
    }

    res.json(successResponse(roomType));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse("Error fetching room type", error.message));
  }
};

/**
 * Create new room type
 * Tạo một loại phòng mới
 */
const createRoomType = async (req, res) => {
  try {
    const { name, capacity, base_price, description, is_active } = req.body;

    if (!name || !capacity || !base_price) {
      return res.status(400).json(errorResponse("Missing required fields"));
    }
  // (tuỳ chọn) check trùng trước cho message thân thiện
    const exist = await RoomType.findOne({ where: { name } }); //tránh trùng tên
    if (exist) {
      return res
        .status(400)
        .json(errorResponse("Room type name already exists"));
    }

    const roomType = await RoomType.create({
      name,
      capacity,
      base_price,
      description,
      is_active,
    });

    res.status(201).json(successResponse(roomType, "Created successfully"));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse("Error creating room type", error.message));
  }
};

/**
 * Update room type
 * Cập nhật loại phòng
 */
const updateRoomType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity, base_price, description, is_active } = req.body;

    const roomType = await RoomType.findByPk(id);

    if (!roomType) {
      return res.status(404).json(errorResponse("Room type not found"));
    }

    await roomType.update({
      name: name ?? roomType.name,
      capacity: capacity ?? roomType.capacity,
      base_price: base_price ?? roomType.base_price,
      description: description ?? roomType.description,
      is_active: is_active ?? roomType.is_active,
    });

    res.json(successResponse(roomType, "Updated successfully"));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse("Error updating room type", error.message));
  }
};

/**
 * Delete room type
 */
// Nếu tồn tại rooms thì không được xóa
const deleteRoomType = async (req, res) => {
  try {
    const { id } = req.params;

    const roomType = await RoomType.findByPk(id);
    if (!roomType) {
      return res.status(404).json(errorResponse("Room type not found"));
    }

    // Kiểm tra phòng đang dùng loại này
    const roomsUsing = await Room.count({ where: { room_type_id: id } }); //Nếu có phòng đang dùng → không xóa
    if (roomsUsing > 0) {
      return res
        .status(400)
        .json(
          errorResponse("Cannot delete: There are rooms using this room type")
        );
    }

    await roomType.destroy();

    res.json(successResponse(null, "Deleted successfully"));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse("Error deleting room type", error.message));
  }
};

module.exports = {
  getAllRoomTypes,
  getActiveRoomTypes,
  getRoomTypeById,
  createRoomType,
  updateRoomType,
  deleteRoomType,
};
