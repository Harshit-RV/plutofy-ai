"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponse = void 0;
const generateDynamicZodSchema_1 = require("./generateDynamicZodSchema");
const openAi_1 = require("./openAi");
const getResponse = async (props) => {
    const dynamicSchema = (0, generateDynamicZodSchema_1.generateDynamicZodSchema)(props.fields);
    const res = await (0, openAi_1.getResponseFromOpenAI)({
        schema: dynamicSchema,
        instruction: props.instruction,
        prompt: props.prompt,
    });
    console.log(res?.parsed);
    return res?.parsed;
};
exports.getResponse = getResponse;
