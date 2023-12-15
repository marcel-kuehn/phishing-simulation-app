import { Module } from '@nestjs/common';
import { CampaignsModule } from './campaigns/campaigns.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ValidateMongoId } from './app.pipes';

@Module({
  imports: [CampaignsModule, AuthModule, HealthModule],
  providers: [ValidateMongoId],
})
export class AppModule {}
