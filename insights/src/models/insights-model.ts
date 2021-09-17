import { Schema, model } from 'mongoose'
import { Query } from '../';

export interface Insights {
  _id?: string
  eventName: string
  metadata: Query
  createdAt?: Date
  updatedAt?: Date
}

const schema = new Schema<Insights>(
  {
    eventName: { type: String, required: true },
    metadata: {
      userId: { type: String, required: true },
      docId: { type: String },
      name: { type: String },
      color: { type: String },
      branch: { type: String }
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

const InsightsModel = model<Insights>('Insights', schema)
export default InsightsModel
