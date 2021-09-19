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
  const userId = req?.user?.id || 'loggedUser'
  const defaultQuery: Query = { userId }

  if (!req.query) return defaultQuery

  const { name, branch, color } = req.query as { name: string, branch: string, color: string }
  if (name) defaultQuery.name = name
  if (branch) defaultQuery.branch = branch
  if (color) defaultQuery.color = color

  return defaultQuery
}

const ProductController = {
  findById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { params } = req
      const doc: Product = await ProductModel.findOne({ _id: params.id, deleted: false })

      // publish `FILTER_PRODUCT` event to redis
      pubEvent('FILTER_PRODUCT', {
        userId: req?.user?.id || 'loggedUser',
        docId: params.id
      })

      res.status(200).json({ result: doc })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  },
  findAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const query = buildQuery(req)
      const docs: Product[] = await ProductModel.find({ ...query, deleted: false })

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
