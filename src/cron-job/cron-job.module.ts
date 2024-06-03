import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobService } from './cron-job.service';
import { CronJobController, WebhookController } from './cron-job.controller';
import { CronJob, CronJobSchema } from '../schemas/cron-job.schema';
import { Webhook, WebhookSchema } from '../schemas/webhook.schema';

// Define a module to encapsulate cron job-related functionality
@Module({
  // Import necessary modules, including Mongoose schemas and ScheduleModule
  imports: [
    // Import the MongooseModule and register the CronJob schema
    MongooseModule.forFeature([{ name: CronJob.name, schema: CronJobSchema }]),
    // Import the MongooseModule and register the Webhook schema
    MongooseModule.forFeature([{ name: Webhook.name, schema: WebhookSchema }]),
    // Import the ScheduleModule to enable scheduling functionality
    ScheduleModule.forRoot(),
  ],
  // Specify the providers (services) for this module
  providers: [CronJobService],
  // Specify the controllers for this module
  controllers: [CronJobController, WebhookController],
})
// Export the module class
export class CronJobModule {}
