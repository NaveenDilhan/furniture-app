const httpMocks = require('node-mocks-http');
const furnitureController = require('./furnitureController');
const Furniture = require('../models/Furniture');

jest.mock('../models/Furniture');

describe('Furniture Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {

    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  it('getAllFurniture should return 200 and all furniture items', async () => {

    const mockFurnitureData = [
      { id: '1', name: 'Modern Sofa', type: 'Sofa', price: 500, modelUrl: '/models/sofa.glb' },
      { id: '2', name: 'Oak Table', type: 'Table', price: 300, modelUrl: '/models/table.glb' }
    ];
    

    Furniture.find.mockResolvedValue(mockFurnitureData);


    await furnitureController.getAllFurniture(req, res);


    expect(Furniture.find).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(mockFurnitureData);
  });
});