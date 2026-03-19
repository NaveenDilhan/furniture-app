const request = require('supertest');
const app = require('../server'); 
const mongoose = require('mongoose');
const Furniture = require('../models/Furniture');

describe('Furniture API Integration Tests', () => {
  
  beforeAll(() => {
    jest.spyOn(Furniture, 'find').mockImplementation(() => {
      return Promise.resolve([
        { id: '101', name: 'Test Chair', type: 'Chair', price: 150, modelUrl: '/test.glb' }
      ]);
    });
  });

  afterAll(async () => {

    jest.restoreAllMocks();
    await mongoose.connection.close();
  });

  it('GET /api/furniture - should return an array of furniture items', async () => {

    const response = await request(app).get('/api/furniture');


    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Test Chair');
  });
});