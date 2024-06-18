import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('healthcheck')
@Controller()
export class AppController {
  @ApiOperation({ summary: 'ヘルスチェック' })
  @ApiOkResponse({
    description: '成功',
  })
  @Get('/health')
  healthCheck() {
    return 'Hello World!';
  }
}
