import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto';
import { PaymentsService } from './payments.service';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(
    @Payload() data: PaymentsCreateChargeDto,
    @Ctx() context: RmqContext,
  ) {
    // const channel = context.getChannelRef();
    // const originalMsg = context.getMessage();
    // // send acknowledgement back manually
    // channel.ack(originalMsg);

    return this.paymentsService.createCharge(data);
  }
}
