import proxy from 'express-http-proxy'
import express, { Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT
const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.get('/healthcheck', (_, res: Response) => {
  res.status(200).json({ result: 'ok' })
})

const writeProxy = proxy(process.env.WRITE_PRODUCT_URL)
const readProxy = proxy(process.env.READ_PRODUCT_URL)

/** Store Product Service */
app.post('/products', writeProxy) // add new product to db
app.delete('/products/:id', writeProxy) // delete product by id
app.patch('/products/:id', writeProxy) // update product by id

/** Get Product Service */
app.get('/products', readProxy) // get all product
app.get('/products/:id', readProxy) // get product by id

app.use((_, res: Response) => {
  res.status(404).json({ error: 'Not found!' })
})

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})
