import axios from "axios";
import ITranscription from "./models/transcription";
import ApiResponse from "./models/apiResponse";
import IWord from "./models/word";

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
  async getVocabularyByTranscriptionId(transcriptionId: number): Promise<ApiResponse<IWord[]>> {
    const result = (await api.get(`/vocabulary/get-by-transcription-id/${transcriptionId}`)).data;
    return result;
  },
  async addWord(word: IWord): Promise<ApiResponse> {
    const result = (await api.post(`/vocabulary/add`, word)).data;
    return result;
  },
  async addTranscription(transcription: ITranscription): Promise<ApiResponse> {
    const result = (await api.post(`/transcription/add`, transcription)).data;
    return result;
  },
  async updateTranscription(transcription: ITranscription): Promise<ApiResponse> {
    const result = (await api.post(`/transcription/update`, transcription)).data;
    return result;
  },
};

export default apis;