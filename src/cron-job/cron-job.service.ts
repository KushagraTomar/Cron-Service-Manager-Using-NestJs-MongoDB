import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CronJob } from '../schemas/cron-job.schema';
import { Webhook } from '../schemas/webhook.schema';
import * as cron from 'node-cron';
import axios from 'axios';

@Injectable()
export class CronJobService {
  // Logger instance for logging messages
  private readonly logger = new Logger(CronJobService.name);
  // Map to store active cron jobs
  private readonly cronJobs = new Map<string, any>(); // To store active cron jobs

  // Constructor to inject Mongoose models for CronJob and Webhook
  constructor(
    @InjectModel(CronJob.name) private cronJobModel: Model<CronJob>,
    @InjectModel(Webhook.name) private webhookModel: Model<Webhook>,
  ) {
    // Initialize cron jobs on service creation
    this.initializeCronJobs().catch((error) => {
      this.logger.error('Failed to initialize cron jobs', error.message);
    });
  }
  // Method to initialize and schedule all existing cron jobs from the database
  async initializeCronJobs() {
    this.logger.log('Initializing cron jobs');
    try {
      // Fetch all cron jobs from the database
      const jobs = await this.cronJobModel.find().exec();
      // Schedule each cron job
      jobs.forEach((job) => this.scheduleCronJob(job));
    } catch (error) {
      // Log error and throw an exception if initialization fails
      throw new InternalServerErrorException('Failed to initialize cron jobs');
    }
  }

  // Method to schedule a single cron job
  scheduleCronJob(job: CronJob) {
    // Stop and delete any existing cron job with the same ID
    if (this.cronJobs.has(job._id.toString())) {
      this.cronJobs.get(job._id.toString()).stop();
      this.cronJobs.delete(job._id.toString());
    }
    // Schedule the new cron job using the specified schedule
    const task = cron.schedule(job.schedule, async () => {
      this.logger.log(`Triggering job: ${job.name}`);

      try {
        // Make an HTTP GET request to the specified link
        const response = await axios.get(job.link);
        response.data.forEach((item: any) => {
          const { userId, id, title, body } = item;
          // Log the fetched data
          this.logger.log(`
            UserId: ${userId}
            Id: ${id}
            Title: ${title}
            Body: ${body}`);
        });

        // Update the job's history with the response
        job.history.push({ triggeredAt: new Date(), response: 'Data fetched' });
        await job.save();
      } catch (error) {
        // Log error and throw an exception if fetching data fails
        throw new InternalServerErrorException('Failed to fetch data');
      }
    });
    // Store the scheduled task in the map
    this.cronJobs.set(job._id.toString(), task);
    this.logger.log(
      `Scheduled job: ${job.name} with schedule: ${job.schedule}`,
    );
  }

  // Method to create a new cron job
  async createCronJob(createCronJobDto: any): Promise<CronJob> {
    this.logger.log('Creating cron job');
    // Create and save the new cron job
    try {
      const createdCronJob = new this.cronJobModel({
        ...createCronJobDto,
        history: [{ triggeredAt: new Date(), response: 'Job created' }],
      });
      const savedJob = await createdCronJob.save();
      // Schedule the new cron job
      this.scheduleCronJob(savedJob);
      return savedJob;
    } catch (error) {
      // Log error and throw an exception if creation fails
      throw new InternalServerErrorException('Failed to create cron job');
    }
  }

  // Method to update an existing cron job
  async updateCronJob(id: string, updateCronJobDto: any): Promise<CronJob> {
    this.logger.log(`Updating cron job with ID: ${id}`);
    try {
      // Find and update the cron job in the database
      const updatedJob = await this.cronJobModel.findByIdAndUpdate(
        id,
        updateCronJobDto,
        {
          new: true,
        },
      );
      if (!updatedJob) {
        throw new InternalServerErrorException(
          `CronJob with ID ${id} not found`,
        );
      }
      updatedJob.history.push({
        triggeredAt: new Date(),
        response: 'Job updated',
      });
      // Reschedule the updated cron job
      this.scheduleCronJob(updatedJob);
      return updatedJob;
    } catch (error) {
      // Log error and throw an exception if update fails
      throw new InternalServerErrorException(
        `Failed to update cron job with ID: ${id}`,
      );
    }
  }

  // Method to delete an existing cron job
  async deleteCronJob(id: string): Promise<CronJob> {
    this.logger.log(`Deleting cron job with ID: ${id}`);
    try {
      // Find and delete the cron job from the database
      const deletedJob = await this.cronJobModel.findByIdAndDelete(id);
      if (!deletedJob) {
        throw new InternalServerErrorException(
          `CronJob with ID ${id} not found`,
        );
      }
      // Stop and delete the scheduled task
      const task = this.cronJobs.get(id);
      if (task) {
        task.stop();
        this.cronJobs.delete(id);
      }
      return deletedJob;
    } catch (error) {
      // Log error and throw an exception if deletion fails
      throw new InternalServerErrorException(
        `Failed to delete cron job with ID: ${id}`,
      );
    }
  }

  // Method to retrieve single cron job from the database
  async getCronJob(id: string): Promise<CronJob> {
    this.logger.log(`Retrieving the cron job with ID: ${id}`);
    try {
      return await this.cronJobModel.findById(id).exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve cron jobs');
    }
  }

  // Method to retrieve all cron jobs from the database
  async getAllCronJobs(): Promise<CronJob[]> {
    this.logger.log('Retrieving all cron jobs');
    try {
      return await this.cronJobModel.find().exec();
    } catch (error) {
      // Log error and throw an exception if retrieval fails
      throw new InternalServerErrorException('Failed to retrieve cron jobs');
    }
  }


  // Method to retrieve all webhooks from the database
  async getAllWebhooks(): Promise<Webhook[]> {
    this.logger.log('Retrieving all webhooks');
    try {
      return await this.webhookModel.find().exec();
    } catch (error) {
      // Log error and throw an exception if retrieval fails
      throw new InternalServerErrorException('Failed to retrieve webhooks');
    }
  }

// Method to retrive a single webhooks from the database
async getWebhook(id: string): Promise<Webhook> {
  this.logger.log('Retriving a single webhook');
  try {
    const getWebhook = await this.webhookModel.findById(id).exec();
    if (!getWebhook) {
      throw new InternalServerErrorException(
        `Webhook with ID ${id} not found`,
      );
    }
    return getWebhook;
  } catch (error) {
    throw new InternalServerErrorException('Failed to retrieve webhooks');
  }
}

  // Method to find a cron job by its ID
  async findCronJobById(id: string): Promise<CronJob> {
    this.logger.log(`Finding cron job with ID: ${id}`);
    try {
      return await this.cronJobModel.findById(id).exec();
    } catch (error) {
      // Log error and throw an exception if finding fails
      throw new InternalServerErrorException(
        `Failed to find cron job with ID: ${id}`,
      );
    }
  }

  // Method to create a webhook for a cron job
  async createWebhook(
    cronJobId: string,
    data: any,
    cronJobCreationDate: Date,
  ): Promise<Webhook> {
    this.logger.log(`Creating webhook for cron job ID: ${cronJobId}`);
    try {
      // Format webhook data and save it to the database
      const webhookData = Object.entries(data).map(([key, value]) => ({
        _id: new Types.ObjectId(),
        [key]: value,
        cronJobCreationDate: cronJobCreationDate,
      }));

      const webhook = new this.webhookModel({
        data: webhookData,
      });
      return webhook.save();
    } catch (error) {
      // Log error and throw an exception if creation fails
      throw new InternalServerErrorException(
        `Failed to create webhook for cron job ID: ${cronJobId}`,
      );
    }
  }
}
