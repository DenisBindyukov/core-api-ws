import {Module} from "@nestjs/common";
import {SocketAdminService} from "./socket-admin-service";

@Module(
    {
        imports: [],
        providers: [SocketAdminService],
        exports: []
    }
)

export class SocketAdminModule {}