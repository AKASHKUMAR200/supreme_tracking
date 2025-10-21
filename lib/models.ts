import mongoose, { Schema, Model } from 'mongoose';

// User Schema
export interface IUser {
  _id: string;
  name: string;
  mobile_number: string;
  password: string;
  role: 'user' | 'admin';
  created_at: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  mobile_number: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], required: true },
  created_at: { type: Date, default: Date.now },
});

// Order Schema
export interface IOrder {
  _id: string;
  user_id: string;
  product_name: string;
  current_stage: number;
  courier_id?: string;
  courier_link?: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

const OrderSchema = new Schema<IOrder>({
  user_id: { type: String, required: true, ref: 'User' },
  product_name: { type: String, required: true },
  current_stage: { type: Number, default: 1, min: 1, max: 5 },
  courier_id: { type: String },
  courier_link: { type: String },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

OrderSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

// Process Update Schema
export interface IProcessUpdate {
  _id: string;
  order_id: string;
  stage_number: number;
  status: 'pending' | 'in_progress' | 'completed';
  photo_url?: string;
  created_at: Date;
  updated_at: Date;
}

const ProcessUpdateSchema = new Schema<IProcessUpdate>({
  order_id: { type: String, required: true, ref: 'Order' },
  stage_number: { type: Number, required: true, min: 1, max: 5 },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  photo_url: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

ProcessUpdateSchema.index({ order_id: 1, stage_number: 1 }, { unique: true });

ProcessUpdateSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

// Bill Schema
export interface IBill {
  _id: string;
  order_id: string;
  bill_url: string;
  created_at: Date;
}

const BillSchema = new Schema<IBill>({
  order_id: { type: String, required: true, ref: 'Order' },
  bill_url: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

// Message Schema
export interface IMessage {
  _id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  attachment_url?: string;
  read: boolean;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
  sender_id: { type: String, required: true, ref: 'User' },
  receiver_id: { type: String, required: true, ref: 'User' },
  message_text: { type: String, required: true },
  attachment_url: { type: String },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

MessageSchema.index({ sender_id: 1, receiver_id: 1 });
MessageSchema.index({ timestamp: -1 });

// Export Models
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export const ProcessUpdate: Model<IProcessUpdate> = mongoose.models.ProcessUpdate || mongoose.model<IProcessUpdate>('ProcessUpdate', ProcessUpdateSchema);
export const Bill: Model<IBill> = mongoose.models.Bill || mongoose.model<IBill>('Bill', BillSchema);
export const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
