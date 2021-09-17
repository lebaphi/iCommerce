import mockingoose from 'mockingoose'
import { ProductCtrl } from './controllers'
import Product from './models/product-model'

describe('Test Product Controller', () => {
  let mockData: any = {}
  const mockReq: any = {}
  const mockRes: any = {}

  beforeEach(() => {
    mockData = {
      name: 'Iphone 13',
      price: '$500',
      branch: 'Apple',
      color: 'blue',
    }

    mockRes.status = jest.fn().mockReturnValue(mockRes)
    mockRes.json = jest.fn().mockReturnValue(mockRes)
  })

  test('should create new product success', async () => {
    mockReq.body = mockData
    mockingoose(Product).toReturn(mockData, 'save')

    await ProductCtrl.post(mockReq, mockRes)

    expect(mockRes.json).toHaveBeenCalledTimes(1)
    expect(mockRes.json).toHaveBeenCalledWith({
      result: expect.objectContaining(mockData),
    })
    expect(mockRes.status).toHaveBeenCalledTimes(1)
    expect(mockRes.status).toHaveBeenCalledWith(200)
  })

  test('should update new product success', async () => {
    mockReq.params = {
      id: 'mock',
    }
    mockingoose(Product).toReturn(mockData, 'findOneAndUpdate')

    await ProductCtrl.update(mockReq, mockRes)

    expect(mockRes.json).toHaveBeenCalledTimes(1)
    expect(mockRes.json).toHaveBeenCalledWith({
      result: expect.objectContaining(mockData),
    })
    expect(mockRes.status).toHaveBeenCalledTimes(1)
    expect(mockRes.status).toHaveBeenCalledWith(200)
  })

  test('should delete product success', async () => {
    mockReq.params = {
      id: 'mock',
    }
    mockingoose(Product).toReturn(mockData, 'findOneAndDelete')

    await ProductCtrl.delete(mockReq, mockRes)

    expect(mockRes.json).toHaveBeenCalledTimes(1)
    expect(mockRes.json).toHaveBeenCalledWith({
      result: expect.objectContaining(mockData),
    })
    expect(mockRes.status).toHaveBeenCalledTimes(1)
    expect(mockRes.status).toHaveBeenCalledWith(200)
  })
})
