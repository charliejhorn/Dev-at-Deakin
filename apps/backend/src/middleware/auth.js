const jwt = require("jsonwebtoken");

// verify access token and attach req.user
module.exports = function auth(required = true) {
    return (req, res, next) => {
        try {
            const hdr = req.get("authorization");
            const token = hdr?.startsWith("Bearer ") ? hdr.slice(7) : null;
            if (!token) {
                if (!required) return next();
                return res.status(401).json({ error: "unauthorized" });
            }
            const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            req.user = payload;
            next();
        } catch (e) {
            return res.status(401).json({ error: "unauthorized" });
        }
    };
};
