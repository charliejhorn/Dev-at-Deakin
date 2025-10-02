require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");
const auth = require("./middleware/auth");
const apiRoutes = require("./routes");

// firestore admin will be initialized lazily by modules that require db access

const app = express();
const PORT = process.env.PORT || 4000;

// security and parsing middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// basic security headers
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    next();
});

// api routes
app.use("/api", apiRoutes);

// centralized error handling
app.use(errorHandler);

// start server
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`server is running on http://localhost:${PORT}`);
});
