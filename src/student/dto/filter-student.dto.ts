import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { toBoolean, toNumber } from '../../common/cast';
import { ContractType, WorkType } from '../../types';

export class FilterDto {
  // change(everyware) to arrays from single number to fix enum problem
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  courseCompletion;

  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  courseEngagement;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1, max: 5 }))
  @IsNumber()
  @IsOptional()
  projectDegree: number;

  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  teamProjectDegree;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1, max: 50000 }))
  @IsNumber()
  @IsOptional()
  expectedSalaryFrom = 0;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1, max: 50000 }))
  @IsNumber()
  @IsOptional()
  expectedSalaryTo = 50000;

  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  expectedContractType: ContractType;

  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  expectedTypeWork: WorkType;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  canTakeApprenticeship: boolean;

  @Transform(({ value }) => toNumber(value, { default: 0, min: 0, max: 255 }))
  @IsNumber()
  @IsOptional()
  monthsOfCommercialExp = 0;
}
