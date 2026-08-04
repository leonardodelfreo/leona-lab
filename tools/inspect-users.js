const fs = require("fs");
const file = process.env.DATA_DIR ? `${process.env.DATA_DIR}/users.json` : "/data/users.json";
const raw = fs.readFileSync(file, "utf8");
const parsed = JSON.parse(raw);
const users = Array.isArray(parsed.users) ? parsed.users : [];
const out = users.map((x) => ({
  username: x.username,
  email: x.email,
  plan: x.plan,
  role: x.role,
  hasPaid: Boolean(x.paidAt || x.stripeCustomerId || x.stripeSessionId),
  hashPrefix: String(x.passwordHash || "").slice(0, 16),
}));
console.log(JSON.stringify(out, null, 2));
