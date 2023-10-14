const supertest = require("supertest");
const server_init = require("./server_init");

var app;
var db;
var adminToken;
var userToken;
var user_id = "6528e6da92053a46000a57f9";
var group_id = "652576498097051e45c1e047";


describe('Group Routes', () => {
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

    // Test the "Create a new group" route
    it('should create a new group', async () => {
    let grp_name = `Test Group ${(new Date().getTime())}`;
      const response = await supertest(app)
        .post('/api/groups')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: grp_name });
  
        console.log("response.body", response.body);
        group_id = response.body.group._id;

      expect(response.status).toBe(201);
      expect(response.body.group.name).toBe(grp_name);
    });
  
    // Test the "Add members to a group" route
    it('should add members to a group', async () => {
      const groupId = group_id; // Replace with the actual group ID from your database
  
      const response = await supertest(app)
        .post(`/api/groups/${groupId}/members`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ userIds: [user_id] }); // Replace with valid user IDs
  
      expect(response.status).toBe(200);
      expect(response.body.members).toEqual(expect.arrayContaining([user_id]));
    });
  
    // Test the "Search for groups" route
    it('should search for groups', async () => {
      const response = await supertest(app)
        .get('/api/groups/search')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ query: 'Test Group' });
  
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  
    // Test the "Get all members of a group" route
    it('should get all members of a group', async () => {
      const groupId = group_id; // Replace with the actual group ID from your database
  
      const response = await supertest(app)
        .get(`/api/groups/${groupId}/members`)
        .set('Authorization', `Bearer ${adminToken}`);
  
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0); // Ensure there are members
    });
  
    
    // Test the "Edit a group by ID" route
    it('should edit a group', async () => {
      const groupId = group_id; // Replace with the actual group ID from your database
      const newData = { name: 'Updated Group Name' }; // Modify as needed
  
      const response = await supertest(app)
        .put(`/api/groups/${groupId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newData);
        
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(newData.name);
    });

    // Test the "Delete a group" route
    it('should delete a group', async () => {
      const groupId = group_id; // Replace with the actual group ID from your database
    
      const response = await supertest(app).delete(`/api/groups/${groupId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    
      expect(response.status).toBe(200);
    });
});
  