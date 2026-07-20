import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const client = axios.create({ baseURL: API_BASE_URL });

function extractError(err) {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  return err.message || "Something went wrong.";
}

export const api = {
  async getCurrentWeather({ locationQuery, latitude, longitude }) {
    try {
      const { data } = await client.post("/api/weather/current", {
        location_query: locationQuery || null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
      });
      return data;
    } catch (err) {
      throw new Error(extractError(err));
    }
  },

  async listRecords() {
    try {
      const { data } = await client.get("/api/records");
      return data;
    } catch (err) {
      throw new Error(extractError(err));
    }
  },

  async createRecord(payload) {
    try {
      const { data } = await client.post("/api/records", payload);
      return data;
    } catch (err) {
      throw new Error(extractError(err));
    }
  },

  async updateRecord(id, payload) {
    try {
      const { data } = await client.put(`/api/records/${id}`, payload);
      return data;
    } catch (err) {
      throw new Error(extractError(err));
    }
  },

  async deleteRecord(id) {
    try {
      await client.delete(`/api/records/${id}`);
    } catch (err) {
      throw new Error(extractError(err));
    }
  },

  exportUrl(fmt) {
    return `${API_BASE_URL}/api/records/export/${fmt}`;
  },

  async getMaps(locationQuery) {
    try {
      const { data } = await client.get("/api/integrations/maps", {
        params: { location_query: locationQuery },
      });
      return data;
    } catch (err) {
      throw new Error(extractError(err));
    }
  },

  async getVideos(locationQuery) {
    try {
      const { data } = await client.get("/api/integrations/videos", {
        params: { location_query: locationQuery },
      });
      return data;
    } catch (err) {
      throw new Error(extractError(err));
    }
  },

  async getAirQuality(locationQuery) {
    try {
      const { data } = await client.get("/api/integrations/air-quality", {
        params: { location_query: locationQuery },
      });
      return data;
    } catch (err) {
      throw new Error(extractError(err));
    }
  },
};
