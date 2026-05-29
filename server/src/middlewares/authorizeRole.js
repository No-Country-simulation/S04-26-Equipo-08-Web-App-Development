export function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        code: 401,
        message: "Authentication required",
        error: true,
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        ok: false,
        code: 403,
        message: `Role '${req.user.role}' is not allowed. Required: ${allowedRoles.join(" or ")}`,
        error: true,
      });
    }

    next();
  };
}
