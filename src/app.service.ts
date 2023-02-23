import { Injectable } from "@nestjs/common";
import { SocketParticipantService } from "./modules/participant/socket-participant-service";
import { SocketAdminService } from "./modules/admin/socket-admin-service";

@Injectable()
export class AppService {
  constructor(
    private readonly socketParticipantService: SocketParticipantService,
    private readonly SocketAdminService: SocketAdminService
  ) {
  }

  getHello(): string {
    return "Hello World!";
  }

  validateParticipants(data: {participantId: string}) {
    this.socketParticipantService.authenticationParticipant(data);
  }

  sendStatusByQuiz(data: { quizId: string, status: boolean }) {
    this.socketParticipantService.sendStatusQuiz(data);
    return !data.status
  }
}
