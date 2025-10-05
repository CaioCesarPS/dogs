import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { BreedsModule } from '../src/breeds/breeds.module';
import { BreedsService } from '../src/breeds/breeds.service';

describe('BreedsController (e2e)', () => {
  let app: INestApplication;
  let breedsService: BreedsService;
  let getAllBreedsSpy: jest.SpyInstance;
  let getBreedImagesSpy: jest.SpyInstance;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BreedsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    breedsService = moduleFixture.get<BreedsService>(BreedsService);

    // Create spies
    getAllBreedsSpy = jest.spyOn(breedsService, 'getAllBreeds');
    getBreedImagesSpy = jest.spyOn(breedsService, 'getBreedImages');

    await app.init();
  });

  afterEach(async () => {
    await app.close();
    getAllBreedsSpy.mockRestore();
    getBreedImagesSpy.mockRestore();
  });

  describe('GET /api/breeds', () => {
    it('should return an array of breed names', async () => {
      const mockBreeds = ['bulldog', 'retriever', 'husky'];
      getAllBreedsSpy.mockResolvedValue(mockBreeds);

      const response = await request(app.getHttpServer())
        .get('/api/breeds')
        .expect(200);

      expect(response.body).toEqual(mockBreeds);
      expect(getAllBreedsSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors', async () => {
      getAllBreedsSpy.mockRejectedValue(new Error('Service unavailable'));

      await request(app.getHttpServer()).get('/api/breeds').expect(500);

      expect(getAllBreedsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/breeds/:breed/images', () => {
    it('should return an array of image URLs for a valid breed', async () => {
      const breed = 'bulldog';
      const mockImages = [
        'https://images.dog.ceo/breeds/bulldog-boston/n02096585_1.jpg',
        'https://images.dog.ceo/breeds/bulldog-boston/n02096585_2.jpg',
        'https://images.dog.ceo/breeds/bulldog-boston/n02096585_3.jpg',
      ];
      getBreedImagesSpy.mockResolvedValue(mockImages);

      const response = await request(app.getHttpServer())
        .get(`/api/breeds/${breed}/images`)
        .expect(200);

      expect(response.body).toEqual(mockImages);
      expect(getBreedImagesSpy).toHaveBeenCalledWith(breed);
      expect(getBreedImagesSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle breed not found error', async () => {
      const breed = 'invalidbreed';
      getBreedImagesSpy.mockRejectedValue(new Error('Breed not found'));

      await request(app.getHttpServer())
        .get(`/api/breeds/${breed}/images`)
        .expect(500);

      expect(getBreedImagesSpy).toHaveBeenCalledWith(breed);
      expect(getBreedImagesSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors', async () => {
      const breed = 'bulldog';
      getBreedImagesSpy.mockRejectedValue(new Error('Service unavailable'));

      await request(app.getHttpServer())
        .get(`/api/breeds/${breed}/images`)
        .expect(500);

      expect(getBreedImagesSpy).toHaveBeenCalledWith(breed);
      expect(getBreedImagesSpy).toHaveBeenCalledTimes(1);
    });
  });
});
