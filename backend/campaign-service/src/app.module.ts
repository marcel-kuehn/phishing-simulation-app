import { Module } from '@nestjs/common';
import { CampaignsModule } from './campaigns/campaigns.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ValidateMongoId } from './app.pipes';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CampaignsModule, AuthModule, HealthModule, UsersModule],
  providers: [ValidateMongoId],
})
export class AppModule {}
