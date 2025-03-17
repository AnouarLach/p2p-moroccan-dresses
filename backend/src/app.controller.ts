import { Controller, Get } from '@nestjs/common';

@Controller('jurken')
export class AppController {
  @Get()
  getJurken() {
    return [{ id: 1, naam: 'Kaftan groen', prijs: 50 }];
  }
}
