import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// Define the CronJob schema as a Mongoose schema
@Schema()
export class CronJob extends Document {
  // Define the 'name' property as a required string
  @Prop({ required: true })
  name: string;

  // Define the 'link' property as a required string
  @Prop({ required: true })
  link: string;

  // Define the 'apiKey' property as a required string
  @Prop({ required: true })
  apiKey: string;

  // Define the 'schedule' property as a required string
  @Prop({ required: true })
  schedule: string;

  // Define the 'startDate' property as a required date
  @Prop({ required: true })
  startDate: Date;

  // Define the 'history' property as an array of objects with 'triggeredAt' and 'response' fields
  @Prop({ type: [{ triggeredAt: Date, response: MongooseSchema.Types.Mixed }] })
  history: { triggeredAt: Date; response: any }[];
}

// Create and export the Mongoose schema for the CronJob class
export const CronJobSchema = SchemaFactory.createForClass(CronJob);
