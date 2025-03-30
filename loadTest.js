import http from "k6/http";
import { sleep, check } from "k6";

export let options = {
  stages: [
    { duration: "10s", target: 10 }, // Ramp up to 10 users in 10s
    { duration: "20s", target: 50 }, // Stay at 50 users for 20s
    { duration: "10s", target: 0 },  // Ramp down to 0 users
  ],
};

export default function () {
  let userId = 1;

  let responses = http.batch([
    ["GET", `http://127.0.0.1:3055/categories/total-spent?userId=${userId}`],
    ["POST", "http://127.0.0.1:3055/categories", JSON.stringify({
      user_id: userId,
      name: "Food",
      amount: 100
    }), { headers: { "Content-Type": "application/json" } }],
    ["GET", "http://127.0.0.1:3055/expenses"],
  ]);

  check(responses[0], { "GET /total-spent is 200": (res) => res.status === 200 });
  check(responses[1], { "POST /categories is 201": (res) => res.status === 201 });
  check(responses[2], { "GET /expenses is 200": (res) => res.status === 200 });

  sleep(1);
}
