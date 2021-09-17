import redis from 'redis'
import { Query } from '../controllers/product-controller'

export type Channel = 'VIEW_PRODUCT' | 'FILTER_PRODUCT'

const publisher = redis.createClient()

export const pubEvent = (channel: Channel, query: Query): boolean => {
  return publisher.publish(channel, JSON.stringify(query))
}
