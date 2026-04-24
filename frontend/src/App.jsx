import React, { useEffect, useState } from "react";
import { fetchExpenses, createExpense } from "./api";

const categories = ["Food", "Transport", "Shopping", "Bills", "Health"];

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("");

  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: ""
  });

  const load = async () => {
    const data = await fetchExpenses(category);
    setExpenses(data);
  };

  useEffect(() => {
    load();
  }, [category]);

  const handleSubmit = async () => {
  if (!form.amount || !form.category || !form.date) {
    alert("Please fill required fields");
    return;
  }

  try {
    const res = await createExpense({
      ...form,
      amount: Number(form.amount)
    });

    if (!res.ok) {
      throw new Error("Failed to save expense");
    }

    setForm({
      amount: "",
      category: "",
      description: "",
      date: ""
    });

    load();

  } catch (err) {
    alert("Error adding expense. Try again.");
  }
};

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💰 Expense Tracker</h1>

     
      <div style={styles.card}>
        <h3>Add Expense</h3>

        <div style={styles.formRow}>
          <input
            style={styles.input}
            placeholder="Amount (₹)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          <select
            style={styles.input}
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={styles.formRow}>
          <input
            style={styles.input}
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            style={styles.input}
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <button style={styles.button} onClick={handleSubmit}>
          Add Expense
        </button>
      </div>

   
      <div style={styles.card}>
        <h3>Filter</h3>
        <select
          style={styles.input}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div style={styles.card}>
        <h3>Expenses</h3>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td>{e.date?.slice(0, 10)}</td>
                <td>{e.category}</td>
                <td>{e.description}</td>
                <td>₹{(e.amount / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 style={styles.total}>Total: ₹{(total / 100).toFixed(2)}</h3>
      </div>
    </div>
  );
}


const styles = {
  container: {
    maxWidth: "900px",
    margin: "auto",
    padding: "20px",
    fontFamily: "Arial"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px"
  },
  card: {
    background: "#f9f9f9",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },
  formRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px"
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    width: "100%",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px"
  },
  total: {
    marginTop: "15px",
    textAlign: "right"
  }
};