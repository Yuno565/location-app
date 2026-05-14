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

  async getReservations(agencyName = null) {
    let url = `${API_URL}/reservations`;
    if (agencyName) {
      url += `?agency_name=${encodeURIComponent(agencyName)}`;
    }
    const res = await fetch(url);
    return res.json();
  },

  async createReservation(data) {
    const res = await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateReservationStatus(id, status) {
    const res = await fetch(`${API_URL}/reservations/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return res.json();
  }
};
