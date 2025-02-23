import { check } from "k6";
import http from "k6/http";

export const options = {
  thresholds: {
    http_req_failed: ["rate<0.001"], // http errors should be less than 0.1%
    http_req_duration: ["p(95)<1000"], // 95% of requests should be below 1s
  },
};

export default function () {
  const url = "https://your-site-url.com";
  const res = http.get(url);

  check(res, {
    "response code was 200": (res) => res.status == 200,
  });
}
