"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CronJobService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronJobService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cron_job_schema_1 = require("../schemas/cron-job.schema");
const webhook_schema_1 = require("../schemas/webhook.schema");
const cron = require("node-cron");
const axios_1 = require("axios");
let CronJobService = CronJobService_1 = class CronJobService {
    constructor(cronJobModel, webhookModel) {
        this.cronJobModel = cronJobModel;
        this.webhookModel = webhookModel;
        this.logger = new common_1.Logger(CronJobService_1.name);
        this.cronJobs = new Map();
        this.initializeCronJobs().catch((error) => {
            this.logger.error('Failed to initialize cron jobs', error.message);
        });
    }
    async initializeCronJobs() {
        this.logger.log('Initializing cron jobs');
        try {
            const jobs = await this.cronJobModel.find().exec();
            jobs.forEach((job) => this.scheduleCronJob(job));
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to initialize cron jobs');
        }
    }
    scheduleCronJob(job) {
        if (this.cronJobs.has(job._id.toString())) {
            this.cronJobs.get(job._id.toString()).stop();
            this.cronJobs.delete(job._id.toString());
        }
        const task = cron.schedule(job.schedule, async () => {
            this.logger.log(`Triggering job: ${job.name}`);
            try {
                const response = await axios_1.default.get(job.link);
                response.data.forEach((item) => {
                    const { userId, id, title, body } = item;
                    this.logger.log(`
            UserId: ${userId}
            Id: ${id}
            Title: ${title}
            Body: ${body}`);
                });
                job.history.push({ triggeredAt: new Date(), response: 'Data fetched' });
                await job.save();
            }
            catch (error) {
                throw new common_1.InternalServerErrorException('Failed to fetch data');
            }
        });
        this.cronJobs.set(job._id.toString(), task);
        this.logger.log(`Scheduled job: ${job.name} with schedule: ${job.schedule}`);
    }
    async createCronJob(createCronJobDto) {
        this.logger.log('Creating cron job');
        try {
            const createdCronJob = new this.cronJobModel({
                ...createCronJobDto,
                history: [{ triggeredAt: new Date(), response: 'Job created' }],
            });
            const savedJob = await createdCronJob.save();
            this.scheduleCronJob(savedJob);
            return savedJob;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to create cron job');
        }
    }
    async updateCronJob(id, updateCronJobDto) {
        this.logger.log(`Updating cron job with ID: ${id}`);
        try {
            const updatedJob = await this.cronJobModel.findByIdAndUpdate(id, updateCronJobDto, {
                new: true,
            });
            if (!updatedJob) {
                throw new common_1.InternalServerErrorException(`CronJob with ID ${id} not found`);
            }
            updatedJob.history.push({
                triggeredAt: new Date(),
                response: 'Job updated',
            });
            this.scheduleCronJob(updatedJob);
            return updatedJob;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to update cron job with ID: ${id}`);
        }
    }
    async deleteCronJob(id) {
        this.logger.log(`Deleting cron job with ID: ${id}`);
        try {
            const deletedJob = await this.cronJobModel.findByIdAndDelete(id);
            if (!deletedJob) {
                throw new common_1.InternalServerErrorException(`CronJob with ID ${id} not found`);
            }
            const task = this.cronJobs.get(id);
            if (task) {
                task.stop();
                this.cronJobs.delete(id);
            }
            return deletedJob;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to delete cron job with ID: ${id}`);
        }
    }
    async getAllCronJobs() {
        this.logger.log('Retrieving all cron jobs');
        try {
            return await this.cronJobModel.find().exec();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve cron jobs');
        }
    }
    async getAllWebhooks() {
        this.logger.log('Retrieving all webhooks');
        try {
            return await this.webhookModel.find().exec();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to retrieve webhooks');
        }
    }
    async findCronJobById(id) {
        this.logger.log(`Finding cron job with ID: ${id}`);
        try {
            return await this.cronJobModel.findById(id).exec();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to find cron job with ID: ${id}`);
        }
    }
    async createWebhook(cronJobId, data, cronJobCreationDate) {
        this.logger.log(`Creating webhook for cron job ID: ${cronJobId}`);
        try {
            const webhookData = Object.entries(data).map(([key, value]) => ({
                _id: new mongoose_2.Types.ObjectId(),
                [key]: value,
                cronJobCreationDate: cronJobCreationDate,
            }));
            const webhook = new this.webhookModel({
                data: webhookData,
            });
            return webhook.save();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Failed to create webhook for cron job ID: ${cronJobId}`);
        }
    }
};
exports.CronJobService = CronJobService;
exports.CronJobService = CronJobService = CronJobService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cron_job_schema_1.CronJob.name)),
    __param(1, (0, mongoose_1.InjectModel)(webhook_schema_1.Webhook.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CronJobService);
//# sourceMappingURL=cron-job.service.js.map