import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TreatmentPlanService } from './treatment-plan.service';
import { CreateTreatmentPlanDto, UpdateTreatmentPlanDto } from './dto/treatment-plan.dto';

@ApiTags('Treatment Plans')
@Controller('treatment-plans')
export class TreatmentPlanController {
  constructor(private readonly planService: TreatmentPlanService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách tất cả phác đồ điều trị' })
  async findAll() {
    return this.planService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết phác đồ điều trị' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.planService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo phác đồ điều trị mới' })
  async create(@Body() dto: CreateTreatmentPlanDto) {
    return this.planService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật phác đồ điều trị' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTreatmentPlanDto) {
    return this.planService.update({ ...dto, id });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa phác đồ điều trị' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.planService.delete(id);
  }
}
