import { Body, Controller, forwardRef, Get, Inject, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { SocketParticipantService } from "./modules/participant/socket-participant-service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("validate-participants")
  validateParticipants(@Body() data: { participantId: string }) {
    return this.appService.validateParticipants(data);
  }

  @Post("quiz-management")
  quizManagement(@Body() data: { quizId: string, status: boolean }) {
    return this.appService.sendStatusByQuiz(data);
  }
}
