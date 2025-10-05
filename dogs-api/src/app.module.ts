import { Module } from '@nestjs/common';
import { BreedsModule } from './breeds/breeds.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [BreedsModule, FavoritesModule],
})
export class AppModule {}
