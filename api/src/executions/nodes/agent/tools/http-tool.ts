import { tool } from "@langchain/core/tools";
import { z as z4 } from "zod4";
import axios from "axios"

const httpTool = tool(
  async (input: any) => {
    const res = await axios.get(input)
    return res.data;
  },
  {
    name: "httpTool",
    description: "Call to make get requests to websites. If you ever have a website URL, you can make a call to this tool and get content of that URL.",
    schema: z4.string().describe("URL of the website."),
  }
);

export default httpTool;