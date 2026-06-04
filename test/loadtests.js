import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:3000';

export function setup() {
  const loginUrl = `${BASE_URL}/auth/login`;
  const payload = JSON.stringify({
    email: 'admin@example.com', // Пользователь с нужной ролью (например, Admin)
    password: 'password123',
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(loginUrl, payload, params);
  
  // Проверяем, что логин прошел успешно
  check(res, { 'logged in successfully': (r) => r.status === 201 || r.status === 200 });

  const token = res.json('access_token'); // Или то имя поля, которое возвращает ваш API
  return { token: token };
}

export let options = {
   //vus: 100, // Virtual Users
   //duration: '2m', // Duration of the test
  thresholds: {
    "http_req_failed": ["rate<0.05"],
    "http_req_duration": ["p(95)<500"]
  },
  stages: [
    { duration: '1m', target: 10 },
    { duration: '5m', target: 10 },
    { duration: '1m', target: 25 },
    { duration: '10m', target: 25 },
    { duration: '1m', target: 0 },
  ],
  // Рампинг нагрузки
  // stages: [
  //   { duration: '1m', target: 100 },
  //   { duration: '1m', target: 500 },
  //   { duration: '1m', target: 800 },
  //   { duration: '1m', target: 1000 },
  //   { duration: '1m', target: 2500 },
  //   { duration: '1m', target: 5000 },
  //   { duration: '1m', target: 8000 },
  //   { duration: '1m', target: 10000 },
  //   { duration: '1m', target: 0 },
  // ],
};

export default function (data) {
  const params = {
    headers: {
      'Authorization': `Bearer ${data.token}`, // Подставляем токен из setup
      'Content-Type': 'application/json',
    },
  };
  
  let res = http.get('http://localhost:3000/users', params); // Update with your API endpoint
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}