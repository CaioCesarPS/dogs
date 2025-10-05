import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { FavoritesModule } from '../src/favorites/favorites.module';
import { FavoritesService } from '../src/favorites/favorites.service';

describe('FavoritesController (e2e)', () => {
  let app: INestApplication;
  let favoritesService: FavoritesService;
  let getFavoritesSpy: jest.SpyInstance;
  let addFavoriteSpy: jest.SpyInstance;
  let removeFavoriteSpy: jest.SpyInstance;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FavoritesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    favoritesService = moduleFixture.get<FavoritesService>(FavoritesService);

    // Create spies
    getFavoritesSpy = jest.spyOn(favoritesService, 'getFavorites');
    addFavoriteSpy = jest.spyOn(favoritesService, 'addFavorite');
    removeFavoriteSpy = jest.spyOn(favoritesService, 'removeFavorite');

    await app.init();
  });

  afterEach(async () => {
    await app.close();
    getFavoritesSpy.mockRestore();
    addFavoriteSpy.mockRestore();
    removeFavoriteSpy.mockRestore();
  });

  describe('GET /api/favorites', () => {
    it('should return an array of favorite breeds', async () => {
      const mockFavorites = ['bulldog', 'retriever'];
      getFavoritesSpy.mockReturnValue(mockFavorites);

      const response = await request(app.getHttpServer())
        .get('/api/favorites')
        .expect(200);

      expect(response.body).toEqual(mockFavorites);
      expect(getFavoritesSpy).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no favorites', async () => {
      getFavoritesSpy.mockReturnValue([]);

      const response = await request(app.getHttpServer())
        .get('/api/favorites')
        .expect(200);

      expect(response.body).toEqual([]);
      expect(getFavoritesSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /api/favorites', () => {
    it('should add a new favorite breed', async () => {
      const breed = 'bulldog';
      addFavoriteSpy.mockImplementation(() => {});

      const response = await request(app.getHttpServer())
        .post('/api/favorites')
        .send({ breed })
        .expect(201);

      expect(response.body).toEqual({
        message: `Breed '${breed}' added to favorites`,
      });
      expect(addFavoriteSpy).toHaveBeenCalledWith(breed);
      expect(addFavoriteSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid request body', async () => {
      await request(app.getHttpServer())
        .post('/api/favorites')
        .send({})
        .expect(400);
    });

    it('should handle service errors', async () => {
      const breed = 'bulldog';
      addFavoriteSpy.mockImplementation(() => {
        throw new Error('Service error');
      });

      await request(app.getHttpServer())
        .post('/api/favorites')
        .send({ breed })
        .expect(500);

      expect(addFavoriteSpy).toHaveBeenCalledWith(breed);
    });
  });

  describe('DELETE /api/favorites/:breed', () => {
    it('should remove a favorite breed', async () => {
      const breed = 'bulldog';
      removeFavoriteSpy.mockImplementation(() => {});

      const response = await request(app.getHttpServer())
        .delete(`/api/favorites/${breed}`)
        .expect(200);

      expect(response.body).toEqual({
        message: `Breed '${breed}' removed from favorites`,
      });
      expect(removeFavoriteSpy).toHaveBeenCalledWith(breed);
      expect(removeFavoriteSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors', async () => {
      const breed = 'bulldog';
      removeFavoriteSpy.mockImplementation(() => {
        throw new Error('Service error');
      });

      await request(app.getHttpServer())
        .delete(`/api/favorites/${breed}`)
        .expect(500);

      expect(removeFavoriteSpy).toHaveBeenCalledWith(breed);
    });

    it('should handle breed with special characters', async () => {
      const breed = 'bull-dog';
      removeFavoriteSpy.mockImplementation(() => {});

      const response = await request(app.getHttpServer())
        .delete(`/api/favorites/${encodeURIComponent(breed)}`)
        .expect(200);

      expect(response.body).toEqual({
        message: `Breed '${breed}' removed from favorites`,
      });
      expect(removeFavoriteSpy).toHaveBeenCalledWith(breed);
    });
  });
});
