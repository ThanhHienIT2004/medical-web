import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RegimenService } from './regimen.service';
import { CreateRegimenDto } from './dto/regimen.dto';

@ApiTags('Regimens')
@Controller('regimens')
export class RegimenController {
  constructor(private readonly regimenService: RegimenService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách tất cả phác đồ' })
  async findAll() {
    return this.regimenService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết phác đồ' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.regimenService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo phác đồ mới' })
  async create(@Body() dto: CreateRegimenDto) {
    return this.regimenService.create(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa phác đồ' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.regimenService.delete(id);
  }
}
