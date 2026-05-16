import { VEHICLES, RESERVATIONS } from "../data/mockData";

const API_URL = "http://localhost:5000/api";

// Helper function to manage local data when backend is down
const getLocalData = (key, defaultData) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
};

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
    try {
      const res = await fetch(`${API_URL}/vehicles`);
      const data = await res.json();
      if (data.error || !Array.isArray(data)) throw new Error();
      return data;
    } catch (err) {
      return getLocalData("mock_v2_vehicles", VEHICLES);
    }
  },

  async getReservations(agencyName = null) {
    try {
      let url = `${API_URL}/reservations`;
      if (agencyName) {
        url += `?agency_name=${encodeURIComponent(agencyName)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.error || !Array.isArray(data)) throw new Error();
      return data;
    } catch (err) {
      const allRes = getLocalData("mock_v2_reservations", RESERVATIONS);
      return agencyName ? allRes.filter(r => r.agency_name === agencyName) : allRes;
    }
  },

  async createReservation(data) {
    try {
      const res = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.error) throw new Error();
      return json;
    } catch (err) {
      const vehicles = getLocalData("mock_v2_vehicles", VEHICLES);
      const vehicle = vehicles.find(v => v.id === data.vehicle_id);
      
      const newRes = {
        ...data,
        id: "r_mock_" + Date.now(),
        agency_name: vehicle ? vehicle.agency_name : "AutoLux Casablanca",
        status: data.status || 'En attente'
      };
      
      const allRes = getLocalData("mock_v2_reservations", RESERVATIONS);
      allRes.unshift(newRes); // Add new reservation at the beginning
      localStorage.setItem("mock_v2_reservations", JSON.stringify(allRes));
      return { success: true, id: newRes.id };
    }
  },

  async updateReservationStatus(id, status) {
    try {
      const res = await fetch(`${API_URL}/reservations/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.error) throw new Error();
      return json;
    } catch (err) {
      const allRes = getLocalData("mock_v2_reservations", RESERVATIONS);
      const index = allRes.findIndex(r => r.id === id);
      if (index !== -1) {
        allRes[index].status = status;
        localStorage.setItem("mock_v2_reservations", JSON.stringify(allRes));
      }
      return { success: true };
    }
  },

  async getVehicleImages(id) {
    try {
      const res = await fetch(`${API_URL}/vehicles/${id}/images`);
      const data = await res.json();
      if (data.error || !Array.isArray(data)) throw new Error();
      return data;
    } catch (err) {
      return [];
    }
  },

  async createVehicle(formData) {
    try {
      const res = await fetch(`${API_URL}/vehicles`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.error) throw new Error();
      return json;
    } catch (err) {
      const allVehicles = getLocalData("mock_v2_vehicles", VEHICLES);
      const newV = {
        id: "v_mock_" + Date.now(),
        brand: formData.get("brand"),
        model: formData.get("model"),
        year: parseInt(formData.get("year")) || 2023,
        price_per_day: parseInt(formData.get("price_per_day")) || 0,
        city: formData.get("city"),
        category: formData.get("category"),
        transmission: formData.get("transmission"),
        fuel_type: formData.get("fuel_type"),
        seats: parseInt(formData.get("seats")) || 5,
        description: formData.get("description"),
        agency_name: formData.get("agency_name"),
        image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&q=80",
        available: true,
      };
      allVehicles.unshift(newV);
      localStorage.setItem("mock_v2_vehicles", JSON.stringify(allVehicles));
      return { success: true, id: newV.id, message: "Véhicule ajouté localement" };
    }
  },

  async updateVehicle(id, formData) {
    try {
      const res = await fetch(`${API_URL}/vehicles/${id}`, {
        method: "PUT",
        body: formData,
      });
      const json = await res.json();
      if (json.error) throw new Error();
      return json;
    } catch (err) {
      const allVehicles = getLocalData("mock_v2_vehicles", VEHICLES);
      const index = allVehicles.findIndex(v => v.id === id);
      if (index !== -1) {
        allVehicles[index] = {
          ...allVehicles[index],
          brand: formData.get("brand"),
          model: formData.get("model"),
          year: parseInt(formData.get("year")),
          price_per_day: parseInt(formData.get("price_per_day")),
          city: formData.get("city"),
          category: formData.get("category"),
          transmission: formData.get("transmission"),
          fuel_type: formData.get("fuel_type"),
          seats: parseInt(formData.get("seats")),
          description: formData.get("description"),
        };
        localStorage.setItem("mock_v2_vehicles", JSON.stringify(allVehicles));
      }
      return { success: true, message: "Véhicule modifié localement" };
    }
  },
};
