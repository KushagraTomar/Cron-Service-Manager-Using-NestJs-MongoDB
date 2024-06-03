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
import { Document, Schema as MongooseSchema } from 'mongoose';
export declare class CronJob extends Document {
    name: string;
    link: string;
    apiKey: string;
    schedule: string;
    startDate: Date;
    history: {
        triggeredAt: Date;
        response: any;
    }[];
}
export declare const CronJobSchema: MongooseSchema<CronJob, import("mongoose").Model<CronJob, any, any, any, Document<unknown, any, CronJob> & CronJob & Required<{
    _id: unknown;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CronJob, Document<unknown, {}, import("mongoose").FlatRecord<CronJob>> & import("mongoose").FlatRecord<CronJob> & Required<{
    _id: unknown;
}>>;
