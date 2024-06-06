// Import necessary decorators and exceptions from NestJS
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CronJobService } from './cron-job.service';
import { CronJob } from '../schemas/cron-job.schema';
import { Webhook } from '../schemas/webhook.schema';

// Define a controller for cron job related endpoints
@Controller('cron-job')
export class CronJobController {
  // Inject the CronJobService into the controller
  constructor(private readonly cronJobService: CronJobService) {}
  // Define a POST endpoint to create a new cron job
  @Post()
  async createCronJob(@Body() createCronJobDto: any): Promise<CronJob> {
    try {
      // Call the service method to create a cron job
      return await this.cronJobService.createCronJob(createCronJobDto);
    } catch (error) {
      // Handle any errors that occur
      throw new InternalServerErrorException('Failed to create cron job');
    }
  }

  // Define a PUT endpoint to update an existing cron job by ID
  @Put(':id')
  async updateCronJob(
    @Param('id') id: string, // Extract the ID from the route
    @Body() updateCronJobDto: any, // Extract the body of the request
  ): Promise<CronJob> {
    try {
      // Call the service method to update the cron job
      const updatedJob = await this.cronJobService.updateCronJob(
        id,
        updateCronJobDto,
      );
      if (!updatedJob) {
        // Throw a 404 error if the job is not found
        throw new NotFoundException(`CronJob with ID ${id} not found`);
      }
      // Return the updated job
      return updatedJob;
    } catch (error) {
      // Handle any errors that occur
      throw new InternalServerErrorException('Failed to update cron job');
    }
  }

  // Define a DELETE endpoint to delete a cron job by ID
  @Delete(':id')
  async deleteCronJob(@Param('id') id: string): Promise<CronJob> {
    try {
      // Call the service method to delete the cron job
      const deletedJob = await this.cronJobService.deleteCronJob(id);
      if (!deletedJob) {
        // Throw a 404 error if the job is not found
        throw new NotFoundException(`CronJob with ID ${id} not found`);
      }
      // Return the deleted job
      return deletedJob;
    } catch (error) {
      // Handle any errors that occur
      throw new InternalServerErrorException('Failed to delete cron job');
    }
  }

  // Define a Get endpoint to retrive a single cron job
  // @Get(':id')
  // async getCronJob(@Param('id') id: string): Promise<CronJob> {
  //   try {
  //     const getCronJob = await this.cronJobService.getCronJob(id);
  //     if (!getCronJob) {
  //       throw new NotFoundException(`CronJob with ID ${id} not found`);
  //     }
  //     return getCronJob;
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to fetch cron jobs');
  //   }
  // }

  // Define a GET endpoint to retrieve all cron jobs
  @Get()
  async getAllCronJobs(): Promise<CronJob[]> {
    try {
      // Call the service method to get all cron jobs
      return await this.cronJobService.getAllCronJobs();
    } catch (error) {
      // Handle any errors that occur
      throw new InternalServerErrorException('Failed to fetch cron jobs');
    }
  }
}

// Define a controller for webhook related endpoints
@Controller('webhook')
export class WebhookController {
  // Inject the CronJobService into the controller
  constructor(private readonly cronJobService: CronJobService) {}

  // Define a GET endpoint to retrieve a single webhooks
  @Get(':id')
  async getWebhook(@Param('id') id: string): Promise<Webhook> {
    try {
      return await this.cronJobService.getWebhook(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch webhooks');
    }
  }

  // Define a GET endpoint to retrieve all webhooks
  @Get('webhooks')
  async getAllWebhooks(): Promise<Webhook[]> {
    try {
      // Call the service method to get all webhooks
      return await this.cronJobService.getAllWebhooks();
    } catch (error) {
      // Handle any errors that occur
      throw new InternalServerErrorException('Failed to fetch webhooks');
    }
  }

  // Define a POST endpoint to handle webhooks for a specific cron job
  @Post(':id')
  async handleWebhook(
    @Param('id') id: string, // Extract the ID from the route
    @Body() data: any, // Extract the body of the request
  ): Promise<Webhook> {
    try {
      // Call the service method to find the cron job by ID
      const cronJob = await this.cronJobService.findCronJobById(id);

      if (!cronJob) {
        // Throw a 404 error if the job is not found
        throw new NotFoundException(`CronJob with ID ${id} not found`);
      }
      // Call the service method to create a webhook
      return await this.cronJobService.createWebhook(
        id,
        data,
        cronJob.startDate,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Re-throw NotFoundException to return a 404 response
        throw error;
      } else {
        // Handle any other errors that occur
        throw new InternalServerErrorException('Failed to handle webhook');
      }
    }
  }
}
