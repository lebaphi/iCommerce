import InsightsModel, { Insights } from '../models/insights-model'
import { Channel, Query } from '../'

export const processEvent = async (
  channel: Channel,
  query: Query
): Promise<void> => {
  try {
    const insights: Insights = {
      eventName: channel,
      metadata: query
    }
    await new InsightsModel(insights).save()
    console.log(
      `Tracked event '${channel}' success`
    )
  } catch (err) {
    throw err
  }
}
