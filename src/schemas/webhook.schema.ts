import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// Define the Webhook schema as a Mongoose schema
@Schema()
export class Webhook extends Document {
  // Define the 'data' property with a mixed type to store any type of data
  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  data: any;
}
// Create and export the Mongoose schema for the Webhook class
export const WebhookSchema = SchemaFactory.createForClass(Webhook);
