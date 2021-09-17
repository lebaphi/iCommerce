import redis from 'redis'
import { processEvent } from './controllers'
import connectDB from './models'

export type Channel = 'VIEW_PRODUCT' | 'FILTER_PRODUCT'
export type Query = {
  userId: string
  docId?: string
  name?: string
  color?: string
  branch?: string
}

const subscriber = redis.createClient()

  ; (() => {
    subscriber.on('message', (channel: Channel, query: string) => {
      processEvent(channel, JSON.parse(query))
    })

    connectDB().then(
      () => {
        subscriber.subscribe('VIEW_PRODUCT')
        subscriber.subscribe('FILTER_PRODUCT')
        console.log(`Subscribing on 'VIEW_PRODUCT' and 'FILTER_PRODUCT' channels`)
      },
      (err) => {
        throw err
      }
    )
  })()
