import axios from "axios";

const API_KEY = "ukEu3DChtA6huxcTQXfZWOnuOyePM58qq8eGL7b1";
const BASE_URL = "https://opendata.resas-portal.go.jp/api/v1/";

export interface Prefecture {
  prefCode: number;
  prefName: string;
}

export interface PopulationData {
  year: number;
  value: number;
}

export const getPrefectures = async (): Promise<Prefecture[]> => {
  try {
    const response = await axios.get(`${BASE_URL}prefectures`, {
      headers: { "X-API-KEY": API_KEY },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error fetching prefectures:", error);
    throw error;
  }
};

export const getPopulationComposition = async (
  prefCode: number
): Promise<PopulationData[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}population/composition/perYear`,
      {
        headers: { "X-API-KEY": API_KEY },
        params: { prefCode },
      }
    );
    return response.data.result.data[0].data; // Assuming the first dataset is what we need
  } catch (error) {
    console.error("Error fetching population data:", error);
    throw error;
  }
};
