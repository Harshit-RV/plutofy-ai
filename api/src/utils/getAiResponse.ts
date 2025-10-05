import { OutputStructure } from "../models/Agent.model";
import { generateDynamicObjectZodV3Schema } from "./generateDynamicZodV3Schema";
import { getResponseFromOpenAI } from "./openAi";

interface ReponseProps {
  fields: OutputStructure[],
  instruction: string,
  prompt: string,
}

export const getResponse = async (props: ReponseProps) => {
  const dynamicSchema = generateDynamicObjectZodV3Schema(props.fields);


  const res = await getResponseFromOpenAI({
    schema: dynamicSchema,
    instruction: props.instruction,
    prompt: props.prompt,
  });

  console.log(res);
  return res?.parsed;
}