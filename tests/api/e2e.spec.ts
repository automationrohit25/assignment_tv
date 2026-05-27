import { test, expect } from '@playwright/test';
import { RestfulBookerClient, BookingPayload } from './RestfulBookerClient';

test('E2E: Create → Update → Verify → Delete booking', async ({ request }) => {
  const client = new RestfulBookerClient(request);

  const createPayload: BookingPayload = {
    firstname: 'E2E',
    lastname: 'Booking',
    totalprice: 200,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-09-01',
      checkout: '2026-09-05',
    },
    additionalneeds: 'Breakfast',
  };

  const authResponse = await client.authenticate();
  expect(authResponse.status()).toBe(200);
  const token = (await authResponse.json()).token;

  const createResponse = await client.createBooking(createPayload);
  expect(createResponse.status()).toBe(200);
  const bookingId = (await createResponse.json()).bookingid;
  expect(typeof bookingId).toBe('number');

  const updatePayload: BookingPayload = {
    ...createPayload,
    firstname: 'E2E-updated',
    totalprice: 275,
    depositpaid: false,
    bookingdates: {
      checkin: '2026-09-10',
      checkout: '2026-09-12',
    },
    additionalneeds: 'Late checkout',
  };

  const updateResponse = await client.updateBooking(bookingId, updatePayload, token);
  expect(updateResponse.status()).toBe(200);
  const updatedBooking = await updateResponse.json();
  expect(updatedBooking).toEqual(updatePayload);

  const getResponse = await client.getBookingById(bookingId);
  expect(getResponse.status()).toBe(200);
  const confirmedBooking = await getResponse.json();
  expect(confirmedBooking.firstname).toBe(updatePayload.firstname);
  expect(confirmedBooking.totalprice).toBe(updatePayload.totalprice);
  expect(confirmedBooking.depositpaid).toBe(updatePayload.depositpaid);

  const deleteResponse = await client.deleteBooking(bookingId, token);
  expect(deleteResponse.status()).toBe(201);

  const verifyDeleted = await client.getBookingById(bookingId);
  expect(verifyDeleted.status()).toBe(404);

  // Playwright request fixture is managed automatically.
});
