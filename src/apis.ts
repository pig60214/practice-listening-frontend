import axios from "axios";
import ITranscription from "./models/transcription";
import ApiResponse from "./models/apiResponse";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_END_POINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apis = {
  async getTranscriptions(): Promise<ApiResponse<ITranscription[]>> {
    const result = (await api.get('/transcription/get-list')).data;
    return result;
  },
  async getTranscription(id: number): Promise<ApiResponse<ITranscription>> {
    const result = (await api.get(`/transcription/${id}`)).data;
    return result;
  },
};

export default apis;