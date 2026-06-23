import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const TOTAL_USERS = Number(__ENV.TOTAL_USERS || 25);
const SELLER_COUNT = Math.min(Number(__ENV.SELLER_COUNT || 10), TOTAL_USERS);
const BUYER_COUNT = Math.max(TOTAL_USERS - SELLER_COUNT, 0);
const TEST_DURATION = __ENV.TEST_DURATION || '2h';

const PASSWORD = __ENV.LOAD_USER_PASSWORD || 'password123';

export const options = {
  scenarios: {
    buyers: {
      executor: 'constant-vus',
      vus: BUYER_COUNT,
      duration: TEST_DURATION,
      exec: 'buyerScenario',
    },
    sellers: {
      executor: 'constant-vus',
      vus: SELLER_COUNT,
      duration: TEST_DURATION,
      exec: 'sellerScenario',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<300'],
  },
};

function jsonHeaders(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
}

function publicJsonHeaders() {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

function expectOk(res, name) {
  const ok = check(res, {
    [name]: (r) => r.status >= 200 && r.status < 300,
  });

  if (!ok) {
    throw new Error(`${name} failed: ${res.status} ${res.body}`);
  }
}

function registerUser({ email, role, firstName, lastName }) {
  const res = http.post(
    `${BASE_URL}/auth/register`,
    JSON.stringify({
      email,
      password: PASSWORD,
      firstName,
      lastName,
      role,
    }),
    publicJsonHeaders(),
  );

  expectOk(res, `register ${role} ${email}`);
}

function login(email) {
  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email, password: PASSWORD }),
    publicJsonHeaders(),
  );

  expectOk(res, `login ${email}`);
  return res.json('access_token');
}

function createLocation(token, index) {
  const res = http.post(
    `${BASE_URL}/locations`,
    JSON.stringify({
      lat: 58.58 + index * 0.001,
      lng: 49.57 + index * 0.001,
      address: `Load test address ${index}`,
    }),
    jsonHeaders(token),
  );

  expectOk(res, `create seller location ${index}`);
  return res.json('id');
}

function createBusiness(token, locationId, index) {
  const res = http.post(
    `${BASE_URL}/businesses`,
    JSON.stringify({
      name: `Load test store ${index}`,
      description: 'Business created by k6 load test',
      locationId,
      pickupStartTime: '18:00',
      pickupEndTime: '22:00',
      imageUrls: [],
    }),
    jsonHeaders(token),
  );

  expectOk(res, `create seller business ${index}`);
  return res.json('id');
}

function createProduct(token, businessId, index) {
  const res = http.post(
    `${BASE_URL}/products`,
    JSON.stringify({
      name: `Load test product ${index}`,
      description: 'Product created by k6 load test',
      price: 10,
      quantity: 100000,
      isActive: true,
      category: 'food',
      businessId,
      imageUrl: [],
    }),
    jsonHeaders(token),
  );

  expectOk(res, `create seller product ${index}`);
  return res.json('id');
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function setup() {
  if (BUYER_COUNT === 0 || SELLER_COUNT === 0) {
    throw new Error(
      'BUYER_COUNT and SELLER_COUNT must both be greater than 0.',
    );
  }

  const runId = Date.now();
  const buyerTokens = [];
  const sellerContexts = [];

  for (let i = 0; i < BUYER_COUNT; i += 1) {
    const email = `k6-buyer-${runId}-${i}@example.com`;

    registerUser({
      email,
      role: 'USER',
      firstName: 'Load',
      lastName: `Buyer ${i}`,
    });

    buyerTokens.push(login(email));
  }

  for (let i = 0; i < SELLER_COUNT; i += 1) {
    const email = `k6-seller-${runId}-${i}@example.com`;

    registerUser({
      email,
      role: 'BUSINESS',
      firstName: 'Load',
      lastName: `Seller ${i}`,
    });

    const token = login(email);
    const locationId = createLocation(token, i);
    const businessId = createBusiness(token, locationId, i);
    const productId = createProduct(token, businessId, i);

    sellerContexts.push({
      token,
      businessId,
      productId,
    });
  }

  return {
    buyerTokens,
    sellerContexts,
  };
}

export function buyerScenario(data) {
  const buyerToken = data.buyerTokens[(__VU - 1) % data.buyerTokens.length];
  const target = pick(data.sellerContexts);
  const params = jsonHeaders(buyerToken);

  group('buyer browse and cart', () => {
    const browseRes = http.get(`${BASE_URL}/businesses/all`, params);
    check(browseRes, { 'buyer GET /businesses/all': (r) => r.status === 200 });

    const storeRes = http.get(
      `${BASE_URL}/businesses/${target.businessId}`,
      params,
    );
    check(storeRes, { 'buyer GET /businesses/:id': (r) => r.status === 200 });

    http.del(`${BASE_URL}/favorites/${target.businessId}`, null, params);

    const favoriteRes = http.post(
      `${BASE_URL}/favorites/${target.businessId}`,
      null,
      params,
    );
    check(favoriteRes, {
      'buyer POST /favorites/:businessId': (r) =>
        r.status === 200 || r.status === 201,
    });

    const addCartRes = http.post(
      `${BASE_URL}/cart/items`,
      JSON.stringify({ productId: target.productId, quantity: 1 }),
      params,
    );
    check(addCartRes, {
      'buyer POST /cart/items': (r) => r.status === 200 || r.status === 201,
    });

    const cartRes = http.get(`${BASE_URL}/cart`, params);
    check(cartRes, { 'buyer GET /cart': (r) => r.status === 200 });

    const updateCartRes = http.patch(
      `${BASE_URL}/cart/items/${target.productId}`,
      JSON.stringify({ quantity: 2 }),
      params,
    );
    check(updateCartRes, {
      'buyer PATCH /cart/items/:productId': (r) => r.status === 200,
    });

    if (Math.random() < 0.2) {
      const orderRes = http.post(
        `${BASE_URL}/orders`,
        JSON.stringify({
          businessId: target.businessId,
          items: [{ productId: target.productId, quantity: 1 }],
          status: 'PENDING',
        }),
        params,
      );
      check(orderRes, {
        'buyer POST /orders': (r) => r.status === 200 || r.status === 201,
      });
    } else {
      const deleteCartItemRes = http.del(
        `${BASE_URL}/cart/items/${target.productId}`,
        null,
        params,
      );
      check(deleteCartItemRes, {
        'buyer DELETE /cart/items/:productId': (r) => r.status === 200,
      });
    }

    const ordersRes = http.get(`${BASE_URL}/orders/user`, params);
    check(ordersRes, { 'buyer GET /orders/user': (r) => r.status === 200 });

    const deleteFavoriteRes = http.del(
      `${BASE_URL}/favorites/${target.businessId}`,
      null,
      params,
    );
    check(deleteFavoriteRes, {
      'buyer DELETE /favorites/:businessId': (r) =>
        r.status === 200 || r.status === 201,
    });
  });

  sleep(Math.random() * 2 + 0.5);
}

export function sellerScenario(data) {
  const seller = data.sellerContexts[(__VU - 1) % data.sellerContexts.length];
  const params = jsonHeaders(seller.token);

  group('seller manage business', () => {
    const businessesRes = http.get(`${BASE_URL}/businesses`, params);
    check(businessesRes, { 'seller GET /businesses': (r) => r.status === 200 });

    const ordersRes = http.get(
      `${BASE_URL}/orders/business/${seller.businessId}`,
      params,
    );
    check(ordersRes, {
      'seller GET /orders/business/:id': (r) => r.status === 200,
    });

    const productRes = http.get(
      `${BASE_URL}/products/${seller.productId}`,
      params,
    );
    check(productRes, { 'seller GET /products/:id': (r) => r.status === 200 });

    const updateProductRes = http.put(
      `${BASE_URL}/products/${seller.productId}`,
      JSON.stringify({
        quantity: 100000,
        price: 10 + Math.floor(Math.random() * 5),
        isActive: true,
      }),
      params,
    );
    check(updateProductRes, {
      'seller PUT /products/:id': (r) => r.status === 200 || r.status === 201,
    });

    if (Math.random() < 0.1) {
      const createRes = http.post(
        `${BASE_URL}/products`,
        JSON.stringify({
          name: `Temporary k6 product ${__VU}-${__ITER}`,
          description: 'Temporary product for CRUD load scenario',
          price: 25,
          quantity: 5,
          isActive: true,
          category: 'bakery',
          businessId: seller.businessId,
          imageUrl: [],
        }),
        params,
      );

      check(createRes, {
        'seller POST /products temp': (r) =>
          r.status === 200 || r.status === 201,
      });

      const tempProductId = createRes.json('id');
      if (tempProductId) {
        const deleteRes = http.del(
          `${BASE_URL}/products/${tempProductId}`,
          null,
          params,
        );
        check(deleteRes, {
          'seller DELETE /products temp': (r) => r.status === 200,
        });
      }
    }
  });

  sleep(Math.random() * 2 + 0.5);
}
