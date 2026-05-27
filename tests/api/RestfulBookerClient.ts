import { APIRequestContext } from '@playwright/test';

export type BookingDates = {
  checkin: string;
  checkout: string;
};

export type BookingPayload = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
};

export type BookingCreateResponse = {
  bookingid: number;
  booking: BookingPayload;
};

export type AuthResponse = {
  token: string;
};

export class RestfulBookerClient {
  static readonly baseURL = 'https://restful-booker.herokuapp.com';

  constructor(private readonly api: APIRequestContext) {}

  authenticate(username = 'admin', password = 'password123') {
    return this.api.post(`${RestfulBookerClient.baseURL}/auth`, {
      data: { username, password },
      headers: { 'Content-Type': 'application/json' },
    });
  }

  getBookingIds() {
    return this.api.get(`${RestfulBookerClient.baseURL}/booking`, {
      headers: { Accept: 'application/json' },
    });
  }

  getBookingIdsByFilter(filter: Record<string, string>) {
    return this.api.get(`${RestfulBookerClient.baseURL}/booking`, {
      headers: { Accept: 'application/json' },
      params: filter,
    });
  }

  getBookingById(id: number) {
    return this.api.get(`${RestfulBookerClient.baseURL}/booking/${id}`, {
      headers: { Accept: 'application/json' },
    });
  }

  createBooking(booking: BookingPayload) {
    return this.api.post(`${RestfulBookerClient.baseURL}/booking`, {
      data: booking,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  updateBooking(id: number, booking: BookingPayload, token: string) {
    return this.api.put(`${RestfulBookerClient.baseURL}/booking/${id}`, {
      data: booking,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${token}`,
      },
    });
  }

  deleteBooking(id: number, token: string) {
    return this.api.delete(`${RestfulBookerClient.baseURL}/booking/${id}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
  }
}
