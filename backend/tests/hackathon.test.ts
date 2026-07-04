import request from "supertest";
import app from "../src/app";
import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma";
import { UserRole } from "@prisma/client";
import { describe, expect, test, beforeEach, afterAll } from "@jest/globals";

// Clear the database before each test
describe("Hackathon & Participant API Tests", () => {
    
    let adminToken: string;
    let userToken: string;
    let hackathonId: number;
    let userId: number;
    const password = "password123";
    
    beforeEach(async () => {
        // Clear relevant tables before each test to ensure a clean state
        await prisma.hackathonParticipant.deleteMany();
        await prisma.hackathon.deleteMany();
        await prisma.refreshToken.deleteMany();
        await prisma.userSkill.deleteMany();
        await prisma.user.deleteMany();
        await prisma.skill.deleteMany();
    
        // setup users via prisma (with same password for simplicity)
        const hashedPassword = await bcrypt.hash(password, 10);
        const adminUser = await prisma.user.create({
            data: { username: 'admin', email: 'admin@test.com', passwordHash: hashedPassword }
        });
        const user = await prisma.user.create({
            data: { username: 'user1', email: 'user1@test.com', passwordHash: hashedPassword }
        });

        userId = user.id;
        // update admin user role to ADMIN
        await prisma.user.update({
            where: { id: adminUser.id },
            data: { userRole: UserRole.ADMIN }
        });

        // login admin and user to get tokens
        const adminLogin = await request(app).post("/auth/login").send({ email: "admin@test.com", password });
        const userLogin = await request(app).post("/auth/login").send({ email: "user1@test.com", password });
        adminToken = `Bearer ${adminLogin.body.accessToken}`;
        userToken = `Bearer ${userLogin.body.accessToken}`;

        // create a test hackathon via prisma using admin user
        const hackResponse = await request(app)
            .post("/hackathons")
            .set("Authorization", adminToken)
            .send({
                name: "Varsity Hack 2026",
                description: "Sunway's flagship event",
                externalUrl: "https://varsityhack.com",
                startDate: new Date(Date.now() + 86400000).toISOString(), 
                endDate: new Date(Date.now() + 172800000).toISOString(),
                registrationDeadline: new Date(Date.now() + 43200000).toISOString(),
                maxTeamSize: 4
            });

        hackathonId = hackResponse.body.id;
    });

    // Close the database connection after all tests
    afterAll(async () => {
        await prisma.$disconnect();
    });

    // ===== Happy Path Tests =====
    // 1. Test viewing all hackathons
    describe("GET /hackathons", () => {
        test("should return a list of all hackathons", async () => {
            const res = await request(app)
                .get("/hackathons")
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0]).toHaveProperty("id");
            expect(res.body[0]).toHaveProperty("name", "Varsity Hack 2026");
        });
    });

    // 2. Test creating a hackathon (admin only)
    describe("POST /hackathons", () => {
        test("should allow admin to create a hackathon", async () => {
            const res = await request(app)
                .post("/hackathons")
                .set("Authorization", adminToken)
                .send({
                    name: "Test Hackathon",
                    description: "A test hackathon",
                    externalUrl: "https://testhack.com",
                    startDate: new Date(Date.now() + 86400000).toISOString(), 
                    endDate: new Date(Date.now() + 172800000).toISOString(),
                    registrationDeadline: new Date(Date.now() + 43200000).toISOString(),
                    maxTeamSize: 4
                });
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("id");
            expect(res.body).toHaveProperty("name", "Test Hackathon");
        });
});

    // 3. Test viewing hackathon details
    describe("GET /hackathons/:hackathonId", () => {
        test("should return hackathon details", async () => {
            const res = await request(app)
                .get(`/hackathons/${hackathonId}`)
                .set("Authorization", userToken);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("id", hackathonId);
            expect(res.body).toHaveProperty("name", "Varsity Hack 2026");
        });
})

    // 4. Test allow admin to edit hackathon details
    describe("PUT /hackathons/:hackathonId", () => {
        test("should allow admin to edit hackathon details", async () => {
            const res = await request(app)
                .put(`/hackathons/${hackathonId}`)
                .set("Authorization", adminToken)
                .send({ description: "Updated description" });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("id", hackathonId);
            expect(res.body).toHaveProperty("description", "Updated description");
        });
});

    // 5. Test allow user to join or register hackathon
    describe("POST /hackathons/:hackathonId/join", () => {
        test("should allow user to join hackathon", async () => {
            const res = await request(app)
                .post(`/hackathons/${hackathonId}/join`)
                .set("Authorization", userToken);
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("userId");
        });
    });

    // 6. Test allow participant to update their team status
    describe("PUT /hackathons/:hackathonId/participant", () => {
        test("should allow participant to update their team status", async () => {
            // First, register the participant for the hackathon
            await request(app)
                .post(`/hackathons/${hackathonId}/join`)
                .set("Authorization", userToken);
            
            const res = await request(app)
                .put(`/hackathons/${hackathonId}/participant`)
                .set("Authorization", userToken)
                .send({ teamStatus: "FULL" });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("teamStatus", "FULL");
        });
    });

    // 7. Test allow participant to leave hackathon
    describe("DELETE /hackathons/:hackathonId/leave", () => {
        test("should allow participant to leave hackathon", async () => {
            // First, register the participant for the hackathon
            await request(app)
                .post(`/hackathons/${hackathonId}/join`)
                .set("Authorization", userToken);

            const res = await request(app)
                .delete(`/hackathons/${hackathonId}/leave`)
                .set("Authorization", userToken);
            expect(res.status).toBe(204);
        });
    });

    // 8. Test allow admin to delete hackathon
    describe("DELETE /hackathons/:hackathonId", () => {
        test("should allow admin to delete hackathon", async () => {
            const res = await request(app)
                .delete(`/hackathons/${hackathonId}`)
                .set("Authorization", adminToken);
            expect(res.status).toBe(204);
        });
});

    // 9. Test return full list of participants for a hackathon
    describe("GET /hackathons/:hackathonId/participants", () => {
        test("should return a list of participants for the hackathon", async () => {
            // First, register a participant for the hackathon
            await request(app)
                .post(`/hackathons/${hackathonId}/join`)
                .set("Authorization", userToken);
            
            const res = await request(app)
                .get(`/hackathons/${hackathonId}/participants`)
                .set("Authorization", userToken);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0]).toHaveProperty("userId");
        });
    });

    // 10. Test return filtered list of participants based on skills
    describe("GET /hackathons/:hackathonId/participants with skill filter", () => {
        test("should return a filtered list of participants based on skills", async () => {

            // Create a skill in the database
            const skill = await prisma.skill.create({ data: { name: "React", category: "FRONTEND" } });

            // First, register a participant for the hackathon
            await request(app)
                .post(`/hackathons/${hackathonId}/join`)
                .set("Authorization", userToken);
            
            // Add skills to the user
            await prisma.userSkill.create({
                data: { userId: userId, 
                        skillId: skill.id,
                    }
            });
            
            const res = await request(app)
                .get(`/hackathons/${hackathonId}/participants?skills=React`)
                .set("Authorization", userToken);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0].user.skills.some((s: { name: string }) => s.name === 'React')).toBe(true);
        });
    });


    // ===== Edge Case Tests =====
    // 1. Test creating a hackathon with missing required fields
    describe("POST /hackathons with missing fields", () => {
        test("should return 400 if required fields are missing", async () => {
            const res = await request(app)
                .post("/hackathons")
                .set("Authorization", adminToken)
                .send({
                    description: "Missing name field",
                    externalUrl: "https://testhack.com",
                    startDate: new Date(Date.now() + 86400000).toISOString(), 
                    endDate: new Date(Date.now() + 172800000).toISOString(),
                    registrationDeadline: new Date(Date.now() + 43200000).toISOString(),
                    maxTeamSize: 4
                });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("message");
        });
    });

    // 2. Test creating a hackathon with invalid date formats
    describe("POST /hackathons with invalid date formats", () => {
        test("should return 400 if date formats are invalid", async () => {
            const res = await request(app)
                .post("/hackathons")
                .set("Authorization", adminToken)
                .send({
                    name: "Invalid Date Hackathon",
                    description: "Testing invalid date formats",
                    externalUrl: "https://testhack.com",
                    startDate: "invalid-date",
                    endDate: "invalid-date",
                    registrationDeadline: "invalid-date",
                    maxTeamSize: 4
                });
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("message");
        });
    });

    // 3. Test user trying to edit hackathon details (should be forbidden)
    describe("PUT /hackathons/:hackathonId by non-admin", () => {
        test("should return 403 if non-admin tries to edit hackathon details", async () => {
            const res = await request(app)
                .put(`/hackathons/${hackathonId}`)
                .set("Authorization", userToken)
                .send({ description: "Attempted update by non-admin" });
            expect(res.status).toBe(403);
            expect(res.body).toHaveProperty("message");
        });
    });

    // 4. Test user trying to join hackathon after registration deadline has passed
    describe("POST /hackathons/:hackathonId/join after registration deadline", () => {
        test("should return 400 if user tries to join after registration deadline", async () => {
            // First, create a hackathon with a past registration deadline
            const pastHackResponse = await request(app)
                .post("/hackathons")
                .set("Authorization", adminToken)
                .send({
                    name: "Past Deadline Hackathon",
                    description: "Testing registration deadline",
                    externalUrl: "https://testhack.com",
                    startDate: new Date(Date.now() + 86400000).toISOString(), 
                    endDate: new Date(Date.now() + 172800000).toISOString(),
                    registrationDeadline: new Date(Date.now() - 86400000).toISOString(), // Deadline in the past
                    maxTeamSize: 4
                });
            const pastHackathonId = pastHackResponse.body.id;

            // Attempt to join the hackathon with the past deadline
            const res = await request(app)
                .post(`/hackathons/${pastHackathonId}/join`)
                .set("Authorization", userToken);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("message");
        });
    });
    // 5. Test user trying to join the same hackathon twice
    describe("POST /hackathons/:hackathonId/join twice", () => {
        test("should return 400 if user tries to join the same hackathon twice", async () => {
            // First, join the hackathon
            await request(app)
                .post(`/hackathons/${hackathonId}/join`)
                .set("Authorization", userToken);
            
            // Attempt to join the same hackathon again
            const res = await request(app)
                .post(`/hackathons/${hackathonId}/join`)
                .set("Authorization", userToken);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("message");
        });
    });

    // 6. Test user trying to join a non-existent hackathon
    describe("POST /hackathons/:hackathonId/join non-existent hackathon", () => {
        test("should return 404 if user tries to join a non-existent hackathon", async () => {
            const res = await request(app)
                .post(`/hackathons/9999/join`) // Assuming 9999 is a non-existent hackathon ID
                .set("Authorization", userToken);
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("message");
        });
    });
    
});
