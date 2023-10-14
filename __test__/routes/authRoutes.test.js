const superset = require('supertest');
const server_init = require("./server_init");
var app;
var db;


describe('Authentication Routes', () => {
    beforeAll(async () => {
      var server = await server_init();
      app = server.app;
      db = server.db;
    });

    afterAll(() => {
      // mongoose.disconnect();
      db.close();
    });


    // let random_user_name = `testuser_${Math.floor(Date.now() / 1000)}`;
    // it('should register a new user', async () => {
    //   const newUser = {
    //     username: random_user_name,
    //     password: 'password123',
    //   };
  
    //   const response = await superset(app)
    //     .post('/api/auth/register')
    //     .send(newUser)
    //     .expect(200);
  
    //   expect(response.body.token).toBeDefined();
    // });
  
    // it('should handle registration errors for an existing user', async () => {
    //   const existingUser = {
    //     username: random_user_name,
    //     password: 'password123',
    //   };
  
    //   const response = await superset(app)
    //     .post('/api/auth/register')
    //     .send(existingUser)
    //     .expect(400);
  
    //   expect(response.body.message).toEqual('User already exists');
    // });
  
    // it('should log in a registered user', async () => {
    //   const userCredentials = {
    //     username: "admin",
    //     password: 'admin',
    //   };
  
    //   const response = await superset(app)
    //     .post('/api/auth/login')
    //     .send(userCredentials)
    //     .expect(200);
  
    //   expect(response.body.token).toBeDefined();
    // });
    
    it('should login a user', async () => {
      const validCredentials = {
        username: 'admin',
        password: 'admin',
      };
  
      const response = await superset(app)
        .post('/api/auth/login')
        .send(validCredentials)
        .expect(200);
  
      expect(response.body.token).toBeDefined();
    });

    it('should handle login errors for invalid credentials', async () => {
      const invalidCredentials = {
        username: 'admin',
        password: 'invalidpassword',
      };
  
      const response = await superset(app)
        .post('/api/auth/login')
        .send(invalidCredentials)
        .expect(401);
  
      expect(response.body.message).toEqual('Invalid credentials');
    });

  });
  