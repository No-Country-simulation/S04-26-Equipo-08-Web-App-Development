export function successResponse(res, data, message = "Operation successful", code = 200) {
  return res.status(code).json({
    ok: true,
    code,
    message,
    data,
  });
}

export function errorResponse(res, message, code = 500, details = null) {
  return res.status(code).json({
    ok: false,
    code,
    message,
    error: true,
    details: details,
  });
}

//module.exports = { successResponse, errorResponse };
