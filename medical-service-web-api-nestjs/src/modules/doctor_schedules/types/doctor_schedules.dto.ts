import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export enum ShiftType {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  OVERTIME = 'OVERTIME',
}

export enum Days {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

registerEnumType(ShiftType, { name: 'ShiftType' });
registerEnumType(Days, { name: 'Days' });

@InputType()
export class CreateDoctorScheduleInput {
  @Field(() => String)
  @MinLength(1, { message: 'ID bác sĩ không được để trống' })
  doctor_id!: string;

  @Field(() => Days)
  @IsEnum(Days, { message: 'Ngày làm không hợp lệ' })
  day!: Days;

  @Field(() => ShiftType)
  @IsEnum(ShiftType, { message: 'Ca làm không hợp lệ' })
  shift!: ShiftType;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  is_available?: boolean;

  @Field(() => String)
  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @Field(() => Number, { nullable: false })
  @IsInt({ message: 'Số tuần phải là số nguyên' })
  @Min(1, { message: 'Số tuần phải từ 1 đến 52' })
  @Max(52, { message: 'Số tuần phải từ 1 đến 52' })
  week_count!: number;
}
