import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios"

const httpTool = tool(
  async (input: any) => {
    const res = await axios.get(input)
    return res.data;
  },
  {
    name: "httpTool",
    description: "Call to make get requests to websites. If you ever have a website URL, you can make a call to this tool and get content of that URL.",
    schema: z.string().describe("URL of the website."),
  }
);

export default httpTool;