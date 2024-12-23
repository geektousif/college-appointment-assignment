import request from 'supertest';
import testDb from './testdb.config';
import app from '../src/app';
import testUsers from './testUsersData';

beforeAll(async () => {
    await testDb.connect();
});

afterAll(async () => {
    await testDb.cleanup();
    await testDb.disconnect();
});

describe('E2E Test: College Appointment System', () => {
    const accessTokens: Record<string, string> = {};
    const userIds: Record<string, number> = {};
    const availableSlots: Record<string, number> = {};
    const appointmentIds: Record<string, number> = {};

    it('should create new user', async () => {
        for (const user in testUsers) {
            const response = await request(app).post('/api/v1/auth/register').set('Accept', 'application/json').send({
                name: testUsers[user].name,
                email: testUsers[user].email,
                password: testUsers[user].password,
                role: testUsers[user].role,
            });
            expect(response.status).toBe(201);
            userIds[testUsers[user].name] = response.body.data.id;
        }
    });

    describe('Authentication', () => {
        it('should login student A1', async () => {
            const response = await request(app).post('/api/v1/auth/login').set('Accept', 'application/json').send({
                email: testUsers.A1.email,
                password: testUsers.A1.password,
            });
            expect(response.status).toBe(200);
            expect(response.body.data.accessToken).not.toBeNull();
            accessTokens.A1 = response.body.data.accessToken;
        });

        it('should login professor P1', async () => {
            const response = await request(app).post('/api/v1/auth/login').set('Accept', 'application/json').send({
                email: testUsers.P1.email,
                password: testUsers.P1.password,
            });
            expect(response.status).toBe(200);
            expect(response.body.data.accessToken).not.toBeNull();
            accessTokens.P1 = response.body.data.accessToken;
        });
    });

    describe('Available Slots Creation by Professor', () => {
        it('should allow professor P1 to create available slots', async () => {
            const timeSlots = [
                {
                    startTime: '2025-01-01 10:00:00',
                    endTime: '2025-01-01 11:00:00',
                },
                {
                    startTime: '2025-01-01 12:00:00',
                    endTime: '2025-01-01 13:00:00',
                },
            ];

            for (const slot of timeSlots) {
                const response = await request(app)
                    .post('/api/v1/slots')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${accessTokens.P1}`)
                    .send({
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                    });
                expect(response.status).toBe(201);
            }
        });
    });

    describe('Slot Checking and Appointment Booking by Student', () => {
        it('should allow student A1 to view all slots for professor P1', async () => {
            const response = await request(app)
                .get(`/api/v1/slots/professor/${userIds.P1}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${accessTokens.A1}`);

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(2);
            for (const slot of response.body.data) {
                availableSlots[`T${slot.id}`] = slot.id;
            }
        });

        it('should allow student A1 to book an available slot for professor P1 in slot T1', async () => {
            const response = await request(app)
                .post('/api/v1/appointments')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${accessTokens.A1}`)
                .send({
                    slotId: availableSlots.T1,
                });
            expect(response.status).toBe(201);
            appointmentIds['A1-T1-P1'] = response.body.data.id;
            delete availableSlots.T1;
        });
    });

    describe('A2 Authentication', () => {
        it('should authenticate student A2', async () => {
            const response = await request(app).post('/api/v1/auth/login').set('Accept', 'application/json').send({
                email: testUsers.A2.email,
                password: testUsers.A2.password,
            });
            expect(response.status).toBe(200);
            accessTokens.A2 = response.body.data.accessToken;
        });
    });

    describe('A2 Books Slot T2', () => {
        it('should allow student A2 to book an available slot for professor P1 in slot T2', async () => {
            const response = await request(app)
                .post('/api/v1/appointments')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${accessTokens.A2}`)
                .send({
                    slotId: availableSlots.T2,
                });
            expect(response.status).toBe(201);
            appointmentIds['A2-T2-P1'] = response.body.data.id;
            console.log(appointmentIds);
            delete availableSlots.T2;
        });
    });

    describe('Professor P1 cancels appointment with A1', () => {
        it('should allow professor P1 to cancel an appointment with student A1', async () => {
            const response = await request(app)
                .delete(`/api/v1/appointments/${appointmentIds['A1-T1-P1']}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${accessTokens.P1}`);
            expect(response.status).toBe(200);
            delete appointmentIds['A1-T1-P1'];
            availableSlots.T1 = 1;
        });
    });

    describe('Student A1 checks appointments', () => {
        it('should allow student A1 to check their appointments', async () => {
            const response = await request(app)
                .get('/api/v1/appointments')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${accessTokens.A1}`);
            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(0);
        });
    });
});
