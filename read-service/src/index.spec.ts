import mockingoose from 'mockingoose'
import { ProductCtrl } from './controllers'
import * as publisher from './publisher'
import Product from './models/product-model'

describe('Test Product Controller', () => {
  let mockData: any = {}
  const mockReq: any = {}
  const mockRes: any = {}
  let publisherStub: any

  beforeEach(() => {
    mockData = {
      name: 'Iphone 13',
      price: '$500',
      branch: 'Apple',
      color: 'blue',
    }
    publisherStub = jest.spyOn(publisher, 'pubEvent').mockReturnValue(true)
    mockRes.status = jest.fn().mockReturnValue(mockRes)
    mockRes.json = jest.fn().mockReturnValue(mockRes)
  })

  afterEach(() => {
    publisherStub.mockRestore()
  })

  test('should filter product by id success', async () => {
    mockReq.params = {
      id: 'mock',
    }

    mockingoose(Product).toReturn(mockData, 'findOne')

    await ProductCtrl.findById(mockReq, mockRes)

    expect(publisherStub).toHaveBeenCalledTimes(1)
    expect(publisherStub).toHaveBeenCalledWith('FILTER_PRODUCT', ['mock'])
    expect(mockRes.json).toHaveBeenCalledTimes(1)
    expect(mockRes.json).toHaveBeenCalledWith({
      result: expect.objectContaining(mockData),
    })
    expect(mockRes.status).toHaveBeenCalledTimes(1)
    expect(mockRes.status).toHaveBeenCalledWith(200)
  })

  test('should get all product success', async () => {
    const allDocs = [mockData]
    mockingoose(Product).toReturn(allDocs, 'find')

    await ProductCtrl.findAll(mockReq, mockRes)

    expect(publisherStub).toHaveBeenCalledTimes(1)
    // expect(publisherStub).toHaveBeenCalledWith(
    //   'VIEW_PRODUCT',
    //   expect.arrayContaining([expect.any(String)])
    // )
    expect(mockRes.json).toHaveBeenCalledTimes(1)
    expect(mockRes.json).toHaveBeenCalledWith({
      result: expect.arrayContaining([expect.objectContaining(mockData)]),
    })
    expect(mockRes.status).toHaveBeenCalledTimes(1)
    expect(mockRes.status).toHaveBeenCalledWith(200)
  })
})
