import { Module } from '@nestjs/common';
import { BreedsController } from './breeds.controller';
import { BreedsService } from './breeds.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  controllers: [BreedsController],
  providers: [BreedsService],
})
export class BreedsModule {}
