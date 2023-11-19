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
    const a = (await api.get('/transcription/get-all', {})).data;
    return a;
  },
};

export default apis;