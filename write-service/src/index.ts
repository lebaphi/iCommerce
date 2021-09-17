import express, { Response } from 'express'
import { ProductCtrl } from './controllers'
import connectDB from './models'

const app = express()
app.use(express.json())

app.get('/healthcheck', (_, res: Response) => {
  res.status(200).json({ result: 'ok' })
})

app.post('/products', ProductCtrl.post)
app.delete('/products/:id', ProductCtrl.delete)
app.patch('/products/:id', ProductCtrl.update)

app.use((_, res: Response) => {
  res.status(404).json({ error: 'Not found!' })
})

const port = process.env.PORT

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
  })
})
