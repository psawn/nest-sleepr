const user = {
  email: 'test@gmail.com',
  password: 'Bao123456.',
};

describe('Reservations', () => {
  let jwt: string;

  beforeAll(async () => {
    // create user
    await fetch('http://auth:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    // login
    const response = await fetch('http://auth:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    jwt = await response.text();
    console.log(jwt);
  });

  test('Create', async () => {
    const response = await fetch('http://reservations:3000/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        startDate: '12/02/2022',
        endDate: '12/04/2022',
        placeId: '123',
        invoiceId: '456',
        charge: {
          amount: 5,
          card: {
            cvc: '413',
            exp_month: 12,
            exp_year: 2027,
            number: '4242424242424242',
          },
        },
      }),
    });

    console.log(response);
  });
});
