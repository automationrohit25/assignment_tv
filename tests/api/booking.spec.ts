import { test, expect } from '@playwright/test';
import { RestfulBookerClient, BookingPayload } from './RestfulBookerClient';

test.describe('Restful Booker Booking Management', () => {
  const bookingPayload: BookingPayload = {
    firstname: 'Api',
    lastname: 'Automation',
    totalprice: 155,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-07-01',
      checkout: '2026-07-05',
    },
    additionalneeds: 'Breakfast',
  };

  test('GET /booking positive: returns a list of booking IDs', async ({ request }) => {
    const client = new RestfulBookerClient(request);

    const response = await client.getBookingIds();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    expect(typeof body[0].bookingid).toBe('number');
  });

  test('GET /booking negative: invalid filter returns no results', async ({ request }) => {
    const client = new RestfulBookerClient(request);

    const response = await client.getBookingIdsByFilter({ firstname: 'NoSuchUserName' });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBe(0);
  });

  test('GET /booking/:id positive: returns booking details for a valid ID', async ({ request }) => {
    const client = new RestfulBookerClient(request);

    const bookingIdsResponse = await client.getBookingIds();
    expect(bookingIdsResponse.status()).toBe(200);

    const bookingIds = await bookingIdsResponse.json();
    const bookingId = bookingIds[0]?.bookingid;
    expect(typeof bookingId).toBe('number');

    const response = await client.getBookingById(bookingId);
    expect(response.status()).toBe(200);

    const booking = await response.json();
    expect(typeof booking.firstname).toBe('string');
    expect(typeof booking.lastname).toBe('string');
    expect(booking.bookingdates).toBeTruthy();
    expect(typeof booking.bookingdates.checkin).toBe('string');
    expect(typeof booking.bookingdates.checkout).toBe('string');
  });

  test('GET /booking/:id negative: invalid ID returns 404', async ({ request }) => {
    const client = new RestfulBookerClient(request);

    const response = await client.getBookingById(99999999);
    expect(response.status()).toBe(404);
  });

  test('POST /booking positive: creates a booking with valid payload', async ({ request }) => {
    const client = new RestfulBookerClient(request);

    const response = await client.createBooking(bookingPayload);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(typeof body.bookingid).toBe('number');
    expect(body.booking).toEqual(bookingPayload);
  });

  test('POST /booking negative: invalid payload returns server error', async ({ request }) => {
    const api = request;
    const response = await api.post('https://restful-booker.herokuapp.com/booking', {
      data: { firstname: 'only-firstname' },
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });

    expect(response.status()).toBe(500);
    const bodyText = await response.text();
    expect(bodyText).toContain('Internal Server Error');
  });

  test('PUT /booking/:id positive: updates a booking with valid auth', async ({ request }) => {
    const client = new RestfulBookerClient(request);

    const authResponse = await client.authenticate();
    expect(authResponse.status()).toBe(200);
    const token = (await authResponse.json()).token;

    const createResponse = await client.createBooking(bookingPayload);
    expect(createResponse.status()).toBe(200);
    const bookingId = (await createResponse.json()).bookingid;

    const updatePayload: BookingPayload = {
      ...bookingPayload,
      firstname: 'ApiUpdated',
      totalprice: 260,
      depositpaid: false,
      bookingdates: {
        checkin: '2026-08-01',
        checkout: '2026-08-04',
      },
      additionalneeds: 'Late checkout',
    };

    const updateResponse = await client.updateBooking(bookingId, updatePayload, token);
    expect(updateResponse.status()).toBe(200);
    const updatedBooking = await updateResponse.json();
    expect(updatedBooking).toEqual(updatePayload);
  });

  test('PUT /booking/:id negative: missing auth token returns forbidden', async ({ request }) => {
    const client = new RestfulBookerClient(request);

    const createResponse = await client.createBooking(bookingPayload);
    expect(createResponse.status()).toBe(200);
    const bookingId = (await createResponse.json()).bookingid;

    const updateResponse = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
      data: bookingPayload,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });

    expect(updateResponse.status()).toBe(403);
  });

  test('DELETE /booking/:id positive: deletes a booking when authorized', async ({ request }) => {
    const client = new RestfulBookerClient(request);

    const authResponse = await client.authenticate();
    expect(authResponse.status()).toBe(200);
    const token = (await authResponse.json()).token;

    const createResponse = await client.createBooking(bookingPayload);
    expect(createResponse.status()).toBe(200);
    const bookingId = (await createResponse.json()).bookingid;

    const deleteResponse = await client.deleteBooking(bookingId, token);
    expect(deleteResponse.status()).toBe(201);

    const getResponse = await client.getBookingById(bookingId);
    expect(getResponse.status()).toBe(404);
  });

  test('DELETE /booking/:id negative: unauthorized delete returns forbidden', async ({ request }) => {
    const client = new RestfulBookerClient(request);

    const createResponse = await client.createBooking(bookingPayload);
    expect(createResponse.status()).toBe(200);
    const bookingId = (await createResponse.json()).bookingid;

    const deleteResponse = await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingId}`);
    expect(deleteResponse.status()).toBe(403);
  });
});
