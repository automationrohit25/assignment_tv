import { test, expect } from '@playwright/test';
import { RestfulBookerClient } from './RestfulBookerClient';

test.describe('Restful Booker Authentication', () => {
  test('POST /auth positive: returns a token for valid credentials', async ({ request }) => {
    const client = new RestfulBookerClient(request);

    const response = await client.authenticate();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
  });

  test('POST /auth negative: invalid credentials return Bad credentials', async ({ request }) => {
    const client = new RestfulBookerClient(request);

    const response = await client.authenticate('admin', 'wrong-password');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.reason).toContain('Bad credentials');
  });
});
