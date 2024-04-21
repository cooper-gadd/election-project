import request from 'supertest';
import { server } from '../../src/server';
import { adminLogin, userLogin } from './auth';

describe('GET /v1/elections', () => {
  let authToken: string | undefined;
  let societyId: number;

  beforeAll(async () => {
    authToken = await userLogin(); // Use the login function to obtain the authentication token
    societyId = 5;
  });
  it('User gets the election data for a specific society', async () => {
    const response = await request(server)
      .get('/v1/elections')
      .set('Cookie', authToken || '') // Set authorization header with the obtained token
      .set('x-society-id', societyId.toString()) // Set society ID header
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          startDate: expect.any(String),
          endDate: expect.any(String),
          societyId: expect.any(Number),
          photoURL: null,
        }),
      ]),
    );
  });
  it('User receives unauthorized for societies he doesnt belong in', async () => {
    await request(server)
      .get('/v1/elections')
      .set('Cookie', authToken || '') // Set authorization header with the obtained token
      .set('x-society-id', '7') // Set society ID header
      .expect(401);
  });
});

// describe('POST /v1/elections', () => {
//   let societyId = 6;
//   it('creates a new election', async () => {
//     const authToken = await adminLogin(); // Obtain authentication token

//     const response = await request(server)
//       .post('/v1/elections')
//       .send({
//         name: 'Test Election',
//         startDate: '2000-04-20 00:00:00',
//         endDate: '2000-04-30 00:00:00',
//         photoUrl: 'testimage.com',
//       })
//       .set('Cookie', authToken || '')
//       .set('x-society-id', societyId.toString())
//       .set('Accept', 'application/json')
//       .expect(200);

//     expect(response.body).toEqual({
//       id: expect.any(Number),
//       name: 'Test Election',
//       societyId: expect.any(Number),
//       startDate: expect.any(String),
//       endDate: expect.any(String),
//       photoURL: expect.any(String),
//     });
//   });

//   it('handles errors correctly', async () => {
//     const authToken = await adminLogin(); // Obtain authentication token

//     await request(server)
//       .post('/v1/elections')
//       .send({
//         name: 'Test Election',
//         startDate: '2024-04-13T00:00:00.000Z',
//         endDate: '2024-04-14T00:00:00.000Z',
//         photoUrl: 'testimage.com',
//       })
//       .set('Cookie', authToken || '') // Set authentication cookie
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(400);
//   });
// });

// describe('PUT /v1/elections/:election_id', () => {
//   let authToken: string | undefined;
//   let societyID = 5;

//   beforeAll(async () => {
//     authToken = await adminLogin(); // Use the login function to obtain the authentication token
//   });

//   const updateData = {
//     name: 'Updated Election Name',
//     startDate: '2000-04-20 00:00:00',
//     endDate: '2000-04-29 00:00:00', // Assuming 1 day duration
//     societyId: societyID,
//     photoUrl: 'testimage.com', // Example URL
//   };
//   it('Admin updates election', async () => {
//     const response = await request(server)
//       .put('/v1/elections/:123')
//       .set('Cookie', authToken || '')
//       .set('x-society-id', societyID.toString())
//       .set('Accept', 'application/json')
//       .send(updateData)
//       .expect(200);

//     if (response.body === undefined) {
//       expect(response.body).toBeUndefined();
//     } else {
//       expect(response.body).toEqual(
//         expect.objectContaining({
//           id: 123,
//           name: expect.any(String),
//           startDate: expect.any(String),
//           endDate: expect.any(String),
//           societyId: expect.any(Number),
//           photoURL: expect.any(String),
//         }),
//       );
//     }
//   });
// });

describe('GET /v1/elections/:election_id', () => {
  let authToken: string | undefined;
  let societyId: number;

  beforeAll(async () => {
    authToken = await adminLogin(); // Use the login function to obtain the authentication token
    societyId = 5;
  });

  it('User retrieves the election data for a specific society', async () => {
    const response = await request(server)
      .get('/v1/elections/122') // Replace '123' with an actual election ID
      .set('Cookie', authToken || '') // Set authorization header with the obtained token
      .set('x-society-id', societyId.toString()) // Set society ID header
      .set('Accept', 'application/json')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: 122,
        name: expect.any(String),
        startDate: expect.any(String),
        endDate: expect.any(String),
        societyId: expect.any(Number),
        photoURL: null,
      }),
    );
  });

  it('handles errors correctly when society ID is missing from headers', async () => {
    const response = await request(server)
      .get('/v1/elections/123') // Replace '123' with an actual election ID
      .set('Cookie', authToken || '') // Set authorization header with the obtained token
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toEqual({
      error: true,
      message: 'Invalid society ID. Check your headers.',
    });
  });
});

afterAll(() => {
  server.close();
});
