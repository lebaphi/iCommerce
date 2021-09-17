import mockingoose from 'mockingoose'
import { ProductCtrl } from './controllers'
import * as publisher from './publisher'
import ProductModel, { Product } from './models/product-model'

describe('Test Product Controller', () => {
  const mockRes: any = {}
  const mockReq: any = {
    params: {
      id: 'mock_id',
    },
    user: {
      id: 'mock_user'
    }
  }
  let mockData: Product[] = []
  let publisherStub: any

  beforeEach(() => {
    mockData = [
      {
        name: 'Iphone 13',
        price: '$400',
        branch: 'Apple',
        color: 'blue',
      },
      {
        name: 'Iphone 12',
        price: '$500',
        branch: 'Apple',
        color: 'white',
      }
    ]
    publisherStub = jest.spyOn(publisher, 'pubEvent').mockReturnValue(true)
    mockRes.status = jest.fn().mockReturnValue(mockRes)
    mockRes.json = jest.fn().mockReturnValue(mockRes)
  })

  afterEach(() => {
    publisherStub.mockRestore()
  })

  test('should filter product by id success', async () => {
    mockingoose(ProductModel).toReturn(mockData[0], 'findOne')

    await ProductCtrl.findById(mockReq, mockRes)

    expect(publisherStub).toHaveBeenCalledTimes(1)
    expect(publisherStub).toHaveBeenCalledWith('FILTER_PRODUCT', { 'docId': 'mock_id', 'userId': 'mock_user' })
    expect(mockRes.json).toHaveBeenCalledTimes(1)
    expect(mockRes.json).toHaveBeenCalledWith({
      result: expect.objectContaining(mockData[0]),
    })
    expect(mockRes.status).toHaveBeenCalledTimes(1)
    expect(mockRes.status).toHaveBeenCalledWith(200)
  })

  test('should get filter product success', async () => {
    mockingoose(ProductModel).toReturn(mockData, 'find')

    mockReq.query = {}
    await ProductCtrl.findAll(mockReq, mockRes)

    expect(publisherStub).toHaveBeenCalledTimes(1)
    expect(publisherStub).toHaveBeenCalledWith('VIEW_PRODUCT', { 'userId': 'mock_user' })
    expect(mockRes.json).toHaveBeenCalledTimes(1)
    expect(mockRes.json).toHaveBeenCalledWith({
      result: expect.arrayContaining(
        [
          expect.objectContaining(mockData[0]),
          expect.objectContaining(mockData[1])
        ]
      ),
    })
    expect(mockRes.status).toHaveBeenCalledTimes(1)
    expect(mockRes.status).toHaveBeenCalledWith(200)
  })

  test('should get filter product by name and color success', async () => {
    mockingoose(ProductModel).toReturn((query: any) => {
      const { name, color } = query.getQuery()
      return mockData.filter(product => product.name === name && product.color === color)
    }, 'find')

    // set filter to the second product
    mockReq.query = {
      name: 'Iphone 12',
      color: 'white'
    }
    await ProductCtrl.findAll(mockReq, mockRes)

    expect(publisherStub).toHaveBeenCalledTimes(1)
    expect(publisherStub).toHaveBeenCalledWith('VIEW_PRODUCT', { 'userId': 'mock_user', ...mockReq.query })
    expect(mockRes.json).toHaveBeenCalledTimes(1)
    expect(mockRes.json).toHaveBeenCalledWith({
      result: expect.arrayContaining([expect.objectContaining(mockData[1])]),
    })
    expect(mockRes.json).toHaveBeenCalledWith({
      result: expect.not.arrayContaining([expect.objectContaining(mockData[0])]),
    })
    expect(mockRes.status).toHaveBeenCalledTimes(1)
    expect(mockRes.status).toHaveBeenCalledWith(200)
  })
})
