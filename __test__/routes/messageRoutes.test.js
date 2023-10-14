const supertest = require("supertest");
const server_init = require("./server_init");

var app;
var db;
var adminToken;
var userToken;
var user_id = "6528e6da92053a46000a57f9";
var group_id = "652576498097051e45c1e047";


describe('Message Routes', () => {
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


    it('should send a message', async () => {
        let msg = `Hello, World! ${(new Date().getTime())}`;
        const newMessage = {
            content: msg,
            groupId: group_id
        };


        const response = await supertest(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newMessage)
        .expect(201);


        expect(response.body.content).toBe(msg);
        expect(response.body.userId).toBe(user_id);
        expect(response.body.groupId).toBe(group_id);
        // You may want to check for additional properties returned by your route handler
    });

    it('should retrieve messages for a group', async () => {
        const response = await supertest(app)
        .get(`/api/messages/${group_id}`) // Replace 'testgroup' with an actual group ID or name
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

        // Add expectations to verify the returned messages
        // For example, check if the response.body is an array of messages
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should handle invalid group when retrieving messages', async () => {
        const invalidGroup = '652a9fc7cfe736201fb0fdfb';

        const response = await supertest(app)
        .get(`/api/messages/${invalidGroup}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

        expect(response.body.message).toEqual('No messages found for this group');
    });

    it('should handle errors when sending a message with missing fields', async () => {
        const invalidMessage = {
        user: user_id,
        // Missing 'text' and 'group' fields
        };

        const response = await supertest(app)
        .post('/api/messages')
        .send(invalidMessage)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

        expect(response.body.message).toEqual('Invalid message data');
    });
});
