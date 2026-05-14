const API_URL = "http://localhost:5000/api";

export const api = {
  async login(email, password) {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async getVehicles() {
    const res = await fetch(`${API_URL}/vehicles`);
    return res.json();
  },

  async getReservations() {
    const res = await fetch(`${API_URL}/reservations`);
    return res.json();
  },

  async createReservation(data) {
    const res = await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
};
