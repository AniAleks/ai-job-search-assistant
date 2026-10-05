import Anthropic from "@anthropic-ai/sdk";
import { type ArgumentsHost, Catch, type ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";
import type { Response } from "express";

/** Maps Anthropic SDK errors to sensible HTTP responses instead of a generic 500. */
@Catch(Anthropic.AnthropicError)
export class AnthropicExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AnthropicExceptionFilter.name);

  catch(error: InstanceType<typeof Anthropic.AnthropicError>, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const { status, message } = describe(error);
    this.logger.error(`Claude API error: ${error.message}`);
    res.status(status).json({ statusCode: status, message });
  }
}

function describe(error: InstanceType<typeof Anthropic.AnthropicError>): { status: number; message: string } {
  if (error instanceof Anthropic.RateLimitError) {
    return { status: HttpStatus.SERVICE_UNAVAILABLE, message: "The AI service is busy; try again shortly" };
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return { status: HttpStatus.BAD_GATEWAY, message: "Could not reach the AI service" };
  }
  if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "The AI service is not configured correctly (check ANTHROPIC_API_KEY)",
    };
  }
  return { status: HttpStatus.BAD_GATEWAY, message: "The AI service returned an error" };
}
