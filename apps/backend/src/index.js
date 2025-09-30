require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
// cookie parsing removed: auth will use header tokens only
const morgan = require("morgan");
const { initFirebase } = require("./lib/firebase");
const errorHandler = require("./middleware/errorHandler");
const auth = require("./middleware/auth");
const apiRoutes = require("./routes");
const { addClient, heartbeatInterval } = require("./lib/sse");

// firestore admin will be initialized lazily by modules that require db access

const app = express();
const PORT = process.env.PORT || 4000;

// security and parsing middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
// cookieParser removed; tokens are expected in Authorization headers
app.use(morgan("dev"));

// basic security headers
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    next();
});

// api routes
app.use("/api", apiRoutes);

// sse endpoint
app.get("/api/events", auth(false), (req, res) => {
    res.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    });
    res.flushHeaders?.();
    const remove = addClient(res);
    const iv = heartbeatInterval(res);
    req.on("close", () => {
        clearInterval(iv);
        remove();
    });
});

// centralized error handling
app.use(errorHandler);

// start server
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`server is running on http://localhost:${PORT}`);
});
