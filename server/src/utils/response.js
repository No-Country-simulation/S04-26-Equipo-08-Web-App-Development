function successResponse(res, data, message = "Operation successful") {
  return res.status(200).json({
    code: 200,
    message: message,
    data: data,
  });
}

function errorResponse(res, message, code) {
  return res.status(code).json({
    code: code,
    message: message,
    error: true,
  });
}

module.exports = { successResponse, errorResponse };
