/**
 * Format success response
 */
const successResponse = (data, message = 'Success') => {
    return {
        success: true,
        message,
        data
    };
};

/**
 * Format error response
 */
const errorResponse = (message = 'Error', error = null) => {
    return {
        success: false,
        message,
        error
    };
};

/**
 * Format pagination response
 */
const paginationResponse = (data, page, limit, total) => {
    return {
        success: true,
        data,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

module.exports = {
    successResponse,
    errorResponse,
    paginationResponse
};
