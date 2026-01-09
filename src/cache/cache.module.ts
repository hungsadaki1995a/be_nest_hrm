import { Module, Global, OnModuleInit } from '@nestjs/common';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule implements OnModuleInit {
  constructor(private cacheService: CacheService) {}

  onModuleInit() {
    this.cacheService.startCleanup();
  }
}
