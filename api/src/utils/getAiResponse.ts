import { OutputStructure } from "../models/Agent.model";
import { generateDynamicObjectZodSchema } from "./generateDynamicZodSchema";
import { getResponseFromOpenAI } from "./openAi";

interface ReponseProps {
  fields: OutputStructure[],
  instruction: string,
  prompt: string,
}

export const getResponse = async (props: ReponseProps) => {
  const dynamicSchema = generateDynamicObjectZodSchema(props.fields);

  const res = await getResponseFromOpenAI({
    schema: dynamicSchema,
    instruction: props.instruction,
    prompt: props.prompt,
  });

  console.log(res?.parsed);
  return res?.parsed;
}