import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AddFavoriteDto } from './dto/add-favorite.dto';

@Controller('api/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getFavorites(): string[] {
    return this.favoritesService.getFavorites();
  }

  @Post()
  addFavorite(@Body() addFavoriteDto: AddFavoriteDto): { message: string } {
    this.favoritesService.addFavorite(addFavoriteDto.breed);
    return { message: `Breed '${addFavoriteDto.breed}' added to favorites` };
  }

  @Delete(':breed')
  removeFavorite(@Param('breed') breed: string): { message: string } {
    this.favoritesService.removeFavorite(breed);
    return { message: `Breed '${breed}' removed from favorites` };
  }
}
