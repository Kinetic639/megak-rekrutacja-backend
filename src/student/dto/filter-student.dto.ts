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

  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  projectDegree;

  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  teamProjectDegree;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1, max: 50000 }))
  @IsNumber()
  @IsOptional()
  expectedSalaryFrom;

  @Transform(({ value }) => toNumber(value, { default: 1, min: 1, max: 50000 }))
  @IsNumber()
  @IsOptional()
  expectedSalaryTo;

  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  expectedContractType;

  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  expectedTypeWork;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  canTakeApprenticeship: boolean;

  @Transform(({ value }) => toNumber(value, { default: 0, min: 0, max: 255 }))
  @IsNumber()
  @IsOptional()
  monthsOfCommercialExp;
}
