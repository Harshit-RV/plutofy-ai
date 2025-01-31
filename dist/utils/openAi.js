"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponseFromOpenAI = getResponseFromOpenAI;
const openai_1 = __importDefault(require("openai"));
const zod_1 = require("openai/helpers/zod");
require("dotenv/config");
const config_1 = __importDefault(require("../config"));
const openai = new openai_1.default({
    apiKey: config_1.default.openAiApiKey,
});
async function getResponseFromOpenAI(props) {
    try {
        const completion = await openai.beta.chat.completions.parse({
            model: "gpt-4o-2024-08-06",
            messages: [
                {
                    role: "system",
                    content: props.instruction,
                },
                {
                    role: "user",
                    content: props.prompt,
                },
            ],
            response_format: (0, zod_1.zodResponseFormat)(props.schema, "schema"),
        });
        const res = completion.choices[0].message;
        return res;
    }
    catch (error) {
        console.error("Error getting data from Open AI:", error);
    }
}
