import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { BuqueTripulanteService } from '../services/buque-tripulante.service';
import { CreateBuqueTripulanteDto } from '../dto/create-buque-tripulante.dto';
import { UpdateBuqueTripulanteDto } from '../dto/update-buque-tripulante.dto';

@Controller('buque-tripulante')
export class BuqueTripulanteController {
  constructor(private readonly buqueTripulanteService: BuqueTripulanteService) {}

  @Post()
  create(@Body() createBuqueTripulanteDto: CreateBuqueTripulanteDto) {
    return this.buqueTripulanteService.create(createBuqueTripulanteDto);
  }

  @Get()
  findAll() {
    return this.buqueTripulanteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buqueTripulanteService.findOne(id);
  }

  @Get('buque/:id_buque')
  findByBuque(@Param('id_buque') id_buque: string) {
    return this.buqueTripulanteService.findByBuque(id_buque);
  }

  @Get('tripulante/:id_tripulante')
  findByTripulante(@Param('id_tripulante') id_tripulante: string) {
    return this.buqueTripulanteService.findByTripulante(id_tripulante);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateBuqueTripulanteDto: UpdateBuqueTripulanteDto
  ) {
    return this.buqueTripulanteService.update(id, updateBuqueTripulanteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buqueTripulanteService.remove(id);
  }

  @Delete('asignacion')
  @HttpCode(HttpStatus.OK)
  removeByBuqueAndTripulante(
    @Query('id_buque') id_buque: string,
    @Query('id_tripulante') id_tripulante: string
  ) {
    return this.buqueTripulanteService.removeByBuqueAndTripulante(id_buque, id_tripulante);
  }
}
