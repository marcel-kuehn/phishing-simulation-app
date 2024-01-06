import { Controller, Get } from '@nestjs/common';
import { StatusMessages } from '../constants';

@Controller('health')
export class HealthController {
  @Get('')
  getHealth() {
    return { status: StatusMessages.OK };
  }
}
