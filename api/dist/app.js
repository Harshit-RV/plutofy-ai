"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clerkClient = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const agent_route_1 = __importDefault(require("./routes/agent.route"));
const completion_route_1 = __importDefault(require("./routes/completion.route"));
const config_1 = __importDefault(require("./config"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_2 = require("@clerk/express");
const backend_1 = require("@clerk/backend");
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Connect to MongoDB
mongoose_1.default.connect(config_1.default.mongoURI);
exports.clerkClient = (0, backend_1.createClerkClient)({
    secretKey: config_1.default.clerkSecretKey,
    publishableKey: config_1.default.clerkPublishableKey,
});
app.use((0, express_2.clerkMiddleware)({ clerkClient: exports.clerkClient }));
// Routes
// app.use('/', homeRoutes);
app.use('/agent', agent_route_1.default);
app.use('/v1/completion', completion_route_1.default);
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(401).send('Unauthenticated!');
});
// Start the server
app.listen(8080, () => {
    console.log(`Server running on port 8080`);
});
