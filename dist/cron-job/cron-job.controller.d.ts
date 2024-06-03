import { CronJobService } from './cron-job.service';
import { CronJob } from '../schemas/cron-job.schema';
import { Webhook } from '../schemas/webhook.schema';
export declare class CronJobController {
    private readonly cronJobService;
    constructor(cronJobService: CronJobService);
    createCronJob(createCronJobDto: any): Promise<CronJob>;
    updateCronJob(id: string, updateCronJobDto: any): Promise<CronJob>;
    deleteCronJob(id: string): Promise<CronJob>;
    getAllCronJobs(): Promise<CronJob[]>;
    getAllWebhooks(): Promise<Webhook[]>;
}
export declare class WebhookController {
    private readonly cronJobService;
    constructor(cronJobService: CronJobService);
    handleWebhook(id: string, data: any): Promise<Webhook>;
}
