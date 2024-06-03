/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { Model } from 'mongoose';
import { CronJob } from '../schemas/cron-job.schema';
import { Webhook } from '../schemas/webhook.schema';
export declare class CronJobService {
    private cronJobModel;
    private webhookModel;
    private readonly logger;
    private readonly cronJobs;
    constructor(cronJobModel: Model<CronJob>, webhookModel: Model<Webhook>);
    initializeCronJobs(): Promise<void>;
    scheduleCronJob(job: CronJob): void;
    createCronJob(createCronJobDto: any): Promise<CronJob>;
    updateCronJob(id: string, updateCronJobDto: any): Promise<CronJob>;
    deleteCronJob(id: string): Promise<CronJob>;
    getAllCronJobs(): Promise<CronJob[]>;
    getAllWebhooks(): Promise<Webhook[]>;
    findCronJobById(id: string): Promise<CronJob>;
    createWebhook(cronJobId: string, data: any, cronJobCreationDate: Date): Promise<Webhook>;
}
