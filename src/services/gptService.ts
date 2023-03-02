import {Configuration, OpenAIApi} from "openai";
import config from "../config";

/**
 *    @class
 *    Creates a new instance of the GptService.
 */
class GptService {
    readonly openAi;

    constructor() {
        this.openAi = new OpenAIApi(new Configuration({apiKey: config.openAiKey}));
    }

    public async askGpt(query: string) {
        const response = await this.openAi.createCompletion({
            model: "text-davinci-003",
            prompt: query,
            max_tokens: 2048,
            temperature: 1.0
        });
        const gptResponse = response.data.choices[0];
        return gptResponse.text;
    }
}
export default GptService;