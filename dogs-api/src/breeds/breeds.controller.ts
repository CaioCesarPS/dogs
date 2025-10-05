import { Controller, Get, Param } from '@nestjs/common';
import { BreedsService } from './breeds.service';

@Controller('api/breeds')
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}

  @Get()
  async getAllBreeds(): Promise<string[] | undefined> {
    return await this.breedsService.getAllBreeds();
  }

  @Get(':breed/images/:quantity')
  async getBreedImages(
    @Param('breed') breed: string,
    @Param('quantity') quantity: number,
  ): Promise<string[]> {
    return await this.breedsService.getBreedImages(breed, quantity);
  }
}
