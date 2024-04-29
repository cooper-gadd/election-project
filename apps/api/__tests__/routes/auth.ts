import request from 'supertest';
import { server } from '../../src/server';

export async function userLogin() {
  const loginResponse = await request(server)
    .post('/auth/login')
    .send({
      email: 'grapefruitsnowstorm10@gmail.com', // societyID = 19
      password: '123456789',
    })
    .set('Accept', 'application/json')
    .expect(204);

  return loginResponse.headers['set-cookie']?.[0];
}
export async function adminLogin() {
  const loginResponse = await request(server)
    .post('/auth/login')
    .send({
      email: 'connor@admin.com',
      password: 'connor123',
    })
    .set('Accept', 'application/json')
    .expect(204);

  return loginResponse.headers['set-cookie']?.[0];
}
export async function officerLogin() {
  const loginResponse = await request(server)
    .post('/auth/login')
    .send({
      email: 'cashewraccoon5@gmail.com',
      password: '123456789',
    })
    .set('Accept', 'application/json')
    .expect(204);

  return loginResponse.headers['set-cookie']?.[0];
}

export async function employeeLogin() {
  const loginResponse = await request(server)
    .post('/auth/login')
    .send({
      email: 'dean@employee.com',
      password: 'dean123',
    })
    .set('Accept', 'application/json')
    .expect(204);

  return loginResponse.headers['set-cookie']?.[0];
}
describe('POST /auth/login', () => {
  it('allows a user to login with valid credentials', async () => {
    const loginResponse = await request(server)
      .post('/auth/login')
      .send({
        email: 'connor@admin.com',
        password: 'connor123',
      })
      .set('Accept', 'application/json')
      .expect(204);

    const authToken = loginResponse.headers['set-cookie']?.[0];
  });

  it('denies a user who logs in with invalid credentials', async () => {
    await request(server)
      .post('/auth/login')
      .send({
        email: 'connor@admin.com',
        password: 'notmypassword',
      })
      .set('Accept', 'application/json')
      .expect(400);
  });
});

describe('POST /auth/logout', () => {
  it('logs a user in and then logs out successfully', async () => {
    const response = await request(server)
      .post('/auth/login')
      .send({
        email: 'shpend.ismaili1@gmail.com',
        password: 'shpend123',
      })
      .set('Accept', 'application/json')
      .expect(204);

    await request(server)
      .post('/auth/logout')
      .set('Cookie', response.headers['set-cookie']?.[0] || '')
      .expect(204);
  });

  it('fails to log out in an unauthenticated state', async () => {
    await request(server).post('/auth/logout').expect(400);
  });
});

afterAll(() => {
  server.close();
});
