import axios from "axios";
import { API_BASE_URL } from "../lib/constants";

export const postToFirebase = async (endpoint: string, data: any) => {
  const res = await axios.post(`${API_BASE_URL}${endpoint}.json`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const getFromFirebase = async (endpoint: string) => {
  const res = await axios.get(
    endpoint ? `${API_BASE_URL}${endpoint}.json` : `${API_BASE_URL}.json`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};

export const putToFirebase = async (endpoint: string, updatedData: any) => {
  const res = await axios.put(`${API_BASE_URL}${endpoint}.json`, updatedData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};
export const deleteFromFirebase = async (endpoint: string) => {
  const res = await axios.delete(`${API_BASE_URL}${endpoint}.json`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};
