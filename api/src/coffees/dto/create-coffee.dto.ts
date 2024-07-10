import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCoffeeDto {
  @ApiProperty({ description: 'The name of a coffee. Fabiana' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'The brand of a coffee. Fabiana' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ description: 'The flavors of a coffee. Fabiana' })
  @IsString({ each: true })
  readonly flavors: string[];
}
