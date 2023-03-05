import { Configuration, OpenAIApi } from "openai";
import config from "../config";

/**
 *    @class
 *    Creates a new instance of the OpenAiService.
 */
export default class OpenAiService {
  readonly openAi;

  constructor() {
    this.openAi = new OpenAIApi(
      new Configuration({ apiKey: config.openAiKey })
    );
  }

  async askGpt(query: string) {
    const response = await this.openAi.createCompletion({
      model: "text-davinci-003",
      prompt: query,
      max_tokens: 2048,
      temperature: 1.0,
    });
    const gptResponse = response.data.choices[0];
    return gptResponse.text;
  }

  async createImage(query: string) {
    const response = await this.openAi.createImage({
      prompt: query,
      size: "1024x1024",
    });
    const gptResponse = response.data.data[0];
    return gptResponse.url;
  }
}
