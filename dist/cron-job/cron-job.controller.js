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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = exports.CronJobController = void 0;
const common_1 = require("@nestjs/common");
const cron_job_service_1 = require("./cron-job.service");
let CronJobController = class CronJobController {
    constructor(cronJobService) {
        this.cronJobService = cronJobService;
    }
    async createCronJob(createCronJobDto) {
        try {
            return await this.cronJobService.createCronJob(createCronJobDto);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to create cron job');
        }
    }
    async updateCronJob(id, updateCronJobDto) {
        try {
            const updatedJob = await this.cronJobService.updateCronJob(id, updateCronJobDto);
            if (!updatedJob) {
                throw new common_1.NotFoundException(`CronJob with ID ${id} not found`);
            }
            return updatedJob;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update cron job');
        }
    }
    async deleteCronJob(id) {
        try {
            const deletedJob = await this.cronJobService.deleteCronJob(id);
            if (!deletedJob) {
                throw new common_1.NotFoundException(`CronJob with ID ${id} not found`);
            }
            return deletedJob;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to delete cron job');
        }
    }
    async getAllCronJobs() {
        try {
            return await this.cronJobService.getAllCronJobs();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to fetch cron jobs');
        }
    }
    async getAllWebhooks() {
        try {
            return await this.cronJobService.getAllWebhooks();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to fetch webhooks');
        }
    }
};
exports.CronJobController = CronJobController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CronJobController.prototype, "createCronJob", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CronJobController.prototype, "updateCronJob", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CronJobController.prototype, "deleteCronJob", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronJobController.prototype, "getAllCronJobs", null);
__decorate([
    (0, common_1.Get)('webhooks'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronJobController.prototype, "getAllWebhooks", null);
exports.CronJobController = CronJobController = __decorate([
    (0, common_1.Controller)('cron-job'),
    __metadata("design:paramtypes", [cron_job_service_1.CronJobService])
], CronJobController);
let WebhookController = class WebhookController {
    constructor(cronJobService) {
        this.cronJobService = cronJobService;
    }
    async handleWebhook(id, data) {
        try {
            const cronJob = await this.cronJobService.findCronJobById(id);
            if (!cronJob) {
                throw new common_1.NotFoundException(`CronJob with ID ${id} not found`);
            }
            return await this.cronJobService.createWebhook(id, data, cronJob.startDate);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            else {
                throw new common_1.InternalServerErrorException('Failed to handle webhook');
            }
        }
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Post)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "handleWebhook", null);
exports.WebhookController = WebhookController = __decorate([
    (0, common_1.Controller)('webhook'),
    __metadata("design:paramtypes", [cron_job_service_1.CronJobService])
], WebhookController);
//# sourceMappingURL=cron-job.controller.js.map