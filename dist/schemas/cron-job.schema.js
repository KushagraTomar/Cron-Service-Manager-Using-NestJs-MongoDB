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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronJobSchema = exports.CronJob = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CronJob = class CronJob extends mongoose_2.Document {
};
exports.CronJob = CronJob;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CronJob.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CronJob.prototype, "link", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CronJob.prototype, "apiKey", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CronJob.prototype, "schedule", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], CronJob.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ triggeredAt: Date, response: mongoose_2.Schema.Types.Mixed }] }),
    __metadata("design:type", Array)
], CronJob.prototype, "history", void 0);
exports.CronJob = CronJob = __decorate([
    (0, mongoose_1.Schema)()
], CronJob);
exports.CronJobSchema = mongoose_1.SchemaFactory.createForClass(CronJob);
//# sourceMappingURL=cron-job.schema.js.map