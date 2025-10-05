import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FavoritesService {
  private readonly favoritesFile = path.join(process.cwd(), 'favorites.json');
  private favorites: string[] = [];

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    try {
      if (fs.existsSync(this.favoritesFile)) {
        const data = fs.readFileSync(this.favoritesFile, 'utf8');
        this.favorites = JSON.parse(data) as string[];
      }
    } catch {
      // If file doesn't exist or is corrupted, start with empty array
      this.favorites = [];
    }
  }

  private saveFavorites(): void {
    try {
      fs.writeFileSync(
        this.favoritesFile,
        JSON.stringify(this.favorites, null, 2),
      );
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  getFavorites(): string[] {
    return [...this.favorites];
  }

  addFavorite(breed: string): void {
    if (!breed || breed.trim() === '') {
      throw new BadRequestException('Breed name cannot be empty');
    }

    const normalizedBreed = breed.toLowerCase().trim();

    if (!this.favorites.includes(normalizedBreed)) {
      this.favorites.push(normalizedBreed);
      this.saveFavorites();
    }
  }

  removeFavorite(breed: string): void {
    if (!breed || breed.trim() === '') {
      throw new BadRequestException('Breed name cannot be empty');
    }

    const normalizedBreed = breed.toLowerCase().trim();
    const index = this.favorites.indexOf(normalizedBreed);

    if (index > -1) {
      this.favorites.splice(index, 1);
      this.saveFavorites();
    }
  }
}
