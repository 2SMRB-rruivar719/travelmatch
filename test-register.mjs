import http from "http";
import { Buffer } from "node:buffer";

const email = `test_${Date.now()}@example.com`;

const payload = {
  name: "Test Tester",
  email,
  password: "123456",
  role: "cliente",
  destination: "Madrid",
  language: "es",
  theme: "dark",
};

const data = JSON.stringify(payload);

const options = {
  hostname: "localhost",
  port: 4000,
  path: "/api/auth/register",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  let body = "";

  res.on("data", (chunk) => {
    body += chunk;
  });

  res.on("end", () => {
    console.log("STATUS", res.statusCode);
    console.log("RAW_BODY", body);
    try {
      const parsed = JSON.parse(body);
      console.log("PARSED_OK", !!parsed.id && parsed.email === email);
    } catch (e) {
      console.error("JSON_PARSE_ERROR", e.message);
      process.exitCode = 1;
    }
  });
});

req.on("error", (err) => {
  console.error("REQUEST_ERROR", err.message);
  process.exitCode = 1;
});

req.write(data);
req.end();


