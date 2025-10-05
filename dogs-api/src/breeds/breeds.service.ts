import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import type { Cache } from 'cache-manager';

interface DogApiResponse {
  message: Record<string, string[]>;
  status: string;
}

interface DogApiImagesResponse {
  message: string[];
  status: string;
}

@Injectable()
export class BreedsService {
  private readonly DOG_API_BASE = 'https://dog.ceo/api';

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getAllBreeds(): Promise<string[] | undefined> {
    try {
      const isCached = await this.cacheManager.get('breeds');
      const TTLCache = 300000; // 5 minutes

      if (isCached) {
        return await this.cacheManager.get<string[]>('breeds');
      }

      const response: AxiosResponse<DogApiResponse> = await axios.get(
        `${this.DOG_API_BASE}/breeds/list/all`,
      );

      const breeds = response.data.message;

      // Convert the object keys to a simple array
      const breedList: string[] = Object.keys(breeds);

      await this.cacheManager.set('breeds', breedList, TTLCache);

      return breedList;
    } catch {
      throw new HttpException(
        'Failed to fetch breeds from external API',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getBreedImages(breed: string, quantity: number): Promise<string[]> {
    try {
      // Create a unique cache key combining breed and quantity
      const cacheKey = `breed_images_${breed}_${quantity}`;
      const TTLCache = 600000; // 10 minutes

      const cachedImages = await this.cacheManager.get<string[]>(cacheKey);

      if (cachedImages) {
        return cachedImages;
      }

      const response: AxiosResponse<DogApiImagesResponse> = await axios.get(
        `${this.DOG_API_BASE}/breed/${breed}/images/random/${quantity}`,
      );

      const images = response.data.message;

      await this.cacheManager.set(cacheKey, images, TTLCache);

      return images;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        throw new HttpException(
          `Breed '${breed}' not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        'Failed to fetch breed images from external API',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
