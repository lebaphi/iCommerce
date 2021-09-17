import express, { Response } from 'express'
import { ProductCtrl } from './controllers'
import connectDB from './models'

const app = express()
app.use(express.json())

app.get('/healthcheck', (_, res: Response) => {
  res.status(200).json({ result: 'ok' })
})

app.get('/products/:id', ProductCtrl.findById)
app.get('/products', ProductCtrl.findAll)

app.use((_, res: Response) => {
  res.status(404).json({ error: 'Not found!' })
})

const port = process.env.PORT
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
  })
})
