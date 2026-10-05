import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../common/zod-validation.pipe.js";
import { AssistantService } from "./assistant.service.js";

const ChatSchema = z.object({ message: z.string().trim().min(1).max(4000) });

@Controller("assistant")
export class AssistantController {
  constructor(private readonly assistant: AssistantService) {}

  @Post()
  @HttpCode(200)
  chat(@Body(new ZodValidationPipe(ChatSchema)) { message }: z.infer<typeof ChatSchema>) {
    return this.assistant.chat(message);
  }
}
