import { Schema, model } from 'mongoose'

interface Product {
  name: string
  price: string
  branch: string
  color: string
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

const schema = new Schema<Product>(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    branch: { type: String, required: true },
    color: { type: String, required: true },
    deleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

const ProductModel = model<Product>('Product', schema)
export default ProductModel
