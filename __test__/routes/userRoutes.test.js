const supertest = require("supertest");
const server_init = require("./server_init");
var mongoose = require('mongoose');

var app;
var db;
var adminToken;
var userToken;
var user_id = new mongoose.Types.ObjectId();
var user_name = `User_${(new Date().getTime())}`



describe("User Routes", () => {
  beforeAll(async () => {
      var server = await server_init();
      // console.log("server", server)
      app = server.app;
      db = server.db;

      
      let adminTokenTemp = await supertest(app)
      .post('/api/auth/login')
      .send({
        "username": "admin",
        "password": "admin"
      });
      
      adminToken = adminTokenTemp.body.token;
      
      let userTokenTemp = await supertest(app)
      .post('/api/auth/login')
      .send({
        "username": "admin",
        "password": "admin"
      });
      userToken = userTokenTemp.body.token;
  });
  
  afterAll(() => {
      db.close();
  });

  // Test the "Create a new user" route
  it('should create a new user', async () => {
    // console.log("adminToken", adminToken);
    const response = await supertest(app)
      .post('/api/users/add')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ _id: user_id, username: user_name, password: user_name, isAdmin: false });

      // console.log("Create user", { _id: user_id, username: user_name, password: user_name, isAdmin: false });

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(user_name);
  });

  // Test the "Edit a user" route
  it('should edit a user', async () => {
    const userId = user_id; // Replace with the actual user ID from your database
    const newData = { username: `${user_name}_UPDATED`, password: `${user_name}_UPDATED` }; // Modify as needed

    const response = await supertest(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newData);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(newData.username);
  });

  
  // Test the "Search for users" route
  it('should search for users', async () => {
    const response = await supertest(app)
      .get('/api/users/search')
      .set('Authorization', `Bearer ${userToken}`)
      .query({ q: 'User' });

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0); // Ensure there are users
  });

  // Test the "Fetch all users" route
  it('should fetch all users', async () => {
    const response = await supertest(app)
      .get('/api/users/all')
      .set('Authorization', `Bearer ${userToken}`)

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0); // Ensure there are users
  });

  // Test the "Delete a user" route
  it('should delete a user', async () => {
    const userId = user_id; // Replace with the actual user ID from your database

    const response = await supertest(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(200);
  });

});
