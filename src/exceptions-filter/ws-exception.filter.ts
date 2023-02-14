import { Catch, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch( exception: WsException, host: ArgumentsHost) {
    //const ctx = host.switchToHttp();
    const ctx = host.switchToWs();
    const client = ctx.getClient();
    // const response = ctx.getResponse();
    //const request = ctx.getRequest();

    // console.log("initMessage", exception.initMessage());
    // console.log("name", exception.name);
    // console.log("stack: ", exception.stack);

    client.emit({
      type: exception.name,
      timestamp: new Date().toISOString(),
      message: exception.getError()
    });
  }

//   const status =
//     exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
//
//   response.status(status).json({
//                                  statusCode: status,
//                                  timestamp: new Date().toISOString(),
//   path: request.url,
//   message: exception?.message,
// });
// }
}