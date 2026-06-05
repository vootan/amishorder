import { Document, Model, Schema, model, Types } from 'mongoose';

export interface IPricingRecord {
  _id?: Types.ObjectId;
  price: number;
  startDate: Date;
  endDate?: Date | null;
  createdBy?: Types.ObjectId | string;
  createdAt?: Date;
}

export interface IInventoryItem extends Document {
  name: string;
  description?: string;
  unit?: string;
  isDeleted: boolean;
  deletedAt?: Date | null;
  pricing: IPricingRecord[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IInventoryItemModel extends Model<IInventoryItem> {}

const PricingSchema = new Schema<IPricingRecord>(
  {
    price: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    createdAt: { type: Date, default: Date.now },
  },
);

const InventorySchema = new Schema<IInventoryItem>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    unit: { type: String, default: null },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
    pricing: { type: [PricingSchema], default: [] },
  },
  { timestamps: true },
);

export const InventoryItem = model<IInventoryItem, IInventoryItemModel>(
  'InventoryItem',
  InventorySchema,
);
