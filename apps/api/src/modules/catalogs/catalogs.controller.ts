import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { AuthGuard } from '../../common/guards/auth.guard';
import { TenantId } from '../../common/decorators/tenant.decorator';

@Controller('catalogs')
@UseGuards(TenantGuard, AuthGuard)
export class CatalogsController {
    constructor(private readonly catalogsService: CatalogsService) { }

    @Post()
    create(
        @TenantId() tenantId: string,
        @Body() createCatalogDto: CreateCatalogDto,
    ) {
        return this.catalogsService.create(tenantId, createCatalogDto);
    }

    @Get()
    findAll(
        @TenantId() tenantId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('search') search?: string,
    ) {
        return this.catalogsService.findAll(tenantId, { page, limit, search });
    }

    @Get(':id')
    findOne(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.catalogsService.findOne(tenantId, id);
    }

    @Patch(':id')
    update(
        @TenantId() tenantId: string,
        @Param('id') id: string,
        @Body() updateCatalogDto: UpdateCatalogDto,
    ) {
        return this.catalogsService.update(tenantId, id, updateCatalogDto);
    }

    @Delete(':id')
    remove(@TenantId() tenantId: string, @Param('id') id: string) {
        return this.catalogsService.remove(tenantId, id);
    }
}
