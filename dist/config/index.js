"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
exports.default = {
    mongoURI: process.env.MONGO_URI || '',
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
    clerkSecretKey: process.env.CLERK_SECRET_KEY || '',
    herokuApiKey: process.env.HEROKU_API_KEY || '',
    openAiApiKey: process.env.OPENAI_API_KEY || ''
};
