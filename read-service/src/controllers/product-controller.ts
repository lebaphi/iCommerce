import { Request, Response } from 'express'
import ProductModel, { Product } from '../models/product-model'
import { pubEvent } from '../publisher'

export type Query = {
  userId: string
  docId?: string
  name?: string
  color?: string
  branch?: string
}

const buildQuery = (req: Request): Query => {
  const { name, branch, color } = req.query as { name: string, branch: string, color: string }

  const query: Query = { userId: 'loggedUser' }
  if (name) query.name = name
  if (branch) query.branch = branch
  if (color) query.color = color

  return query
}

const ProductController = {
  findById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { params } = req
      const doc: Product = await ProductModel.findById({ _id: params.id })

      // publish `FILTER_PRODUCT` event to redis
      const query: Query = {
        userId: 'loggedUser',
        docId: params.id,
      }
      pubEvent('FILTER_PRODUCT', query)

      res.status(200).json({ result: doc })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },
  findAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const query = buildQuery(req)
      const docs: Product[] = await ProductModel.find(query).exec()

      // publish `VIEW_PRODUCT` event to redis
      pubEvent(
        'VIEW_PRODUCT',
        query
      )

      res.status(200).json({ result: docs })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },
}

export default ProductController
