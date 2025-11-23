import { IsString, IsOptional, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCatalogDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    category?: string;

    @IsString()
    @IsOptional()
    brand?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    imageUrls?: string[];

    @IsOptional()
    specifications?: any;

    @IsNumber()
    @IsOptional()
    defaultPrice?: number;
}
