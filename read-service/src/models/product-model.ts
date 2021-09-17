import { Schema, model } from 'mongoose'

export interface Product {
  _id: string
  name: string
  price: string
  branch: string
  color: string
  createdAt: Date
  updatedAt: Date
}

const schema = new Schema<Product>(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    branch: { type: String, required: true },
    color: { type: String, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

const ProductModel = model<Product>('Product', schema)
export default ProductModel
