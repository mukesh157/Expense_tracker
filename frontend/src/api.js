const BASE = "https://expense-tracker-backend-4aft.onrender.com";

export async function fetchExpenses(category) {
  const url = category
    ? `${BASE}/expenses?category=${category}`
    : `${BASE}/expenses`;

  const res = await fetch(url);
  return res.json();
}

export async function createExpense(data) {
  return fetch(`${BASE}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID()
    },
    body: JSON.stringify(data)
  });
}