import { Request, Response } from 'express'
import Product from '../models/product-model'

const ProductController = {
  post: async (req: Request, res: Response): Promise<void> => {
    try {
      const doc = await new Product(req.body).save()
      res.status(200).json({ result: doc })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const { params, body } = req
      const updated = await Product.findOneAndUpdate({ _id: params.id }, body)
      res.status(200).json({ result: updated })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const { params } = req
      const deleted = await Product.findOneAndUpdate({ _id: params.id }, { deleted: true })
      res.status(200).json({ result: deleted })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },
}

export default ProductController
