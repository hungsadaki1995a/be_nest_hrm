import { CACHE_TIME_LIMIT } from '@/constants/auth.constant';
import { Injectable } from '@nestjs/common';

interface CacheItem<T> {
  value: T;
  expiresAt: number;
}

@Injectable()
export class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private cleanupInterval?: NodeJS.Timeout;

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    // Check expiration
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  set(key: string, value: any, ttlSeconds: number): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  deletePattern(pattern: string): void {
    const regex = new RegExp(pattern.replace('*', '.*'));

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  startCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(
      () => {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
          if (now > item.expiresAt) {
            this.cache.delete(key);
          }
        }
      },
      CACHE_TIME_LIMIT * 1000,
    );
  }

  onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}
