import { Injectable } from "@nestjs/common";
import { SocketParticipantService } from "./modules/participant/socket-participant-service";

@Injectable()
export class AppService {
  constructor(private readonly socketParticipantService: SocketParticipantService) {
  }

  getHello(): string {
    return "Hello World!";
  }

  validateParticipants(data: any) {
    this.socketParticipantService.authenticationParticipant(data);
  }
}
