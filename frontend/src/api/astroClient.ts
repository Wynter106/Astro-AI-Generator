import axios from 'axios';
import { NightSkyInput } from '../types/NightSky';

const baseURL = import.meta.env.VITE_BACKEND_URL;

export interface AstrologyInput {
  year: number;
  month: number;
  day: number;
  hour: number | null;
  minute: number | null;
  region: string | null;
}

export interface AstrologyResponse {
  result: string;
}

export const postAstrology = async (
  input: AstrologyInput,
  mode: 'insight' | 'fortune'
): Promise<AstrologyResponse> => {
  const res = await axios.post(`${baseURL}/astrology/${mode}`, input);
  return res.data;
};

export const getNightSky = async (params: NightSkyInput) => {
  const response = await axios.post(`${baseURL}/nightsky`, params);
  return response.data.image; // base64 string
};
