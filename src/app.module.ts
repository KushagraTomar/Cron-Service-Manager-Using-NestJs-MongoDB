import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CronJobModule } from './cron-job/cron-job.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    MongooseModule.forRoot(
      // Configure Mongoose to connect to MongoDB using the provided connection string
      'mongodb+srv://new_user_1:new_user_1@cluster0.k7wenfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    // Configure ThrottlerModule for rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60, // Time-to-live for each request in seconds
        limit: 10, // Maximum number of requests within the TTL
      },
    ]),
    // Import the CronJobModule to include its controllers and providers in the AppModule
    CronJobModule,
  ],
})
export class AppModule {}
