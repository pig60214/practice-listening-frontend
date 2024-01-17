import axios from "axios";
import { IAddTranscription, ITranscription, IUpdateTranscription } from "@/models/transcription";
import ApiResponse from "@/models/apiResponse";
import IWord from "@/models/word";
import FetchYoutubeTranscriptionRequest from "@/models/fetchYoutubeTranscriptionRequest";
import YoutubeInfo from "@/models/youtubeInfo";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_END_POINT,
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
  async updateWord(word: IWord): Promise<ApiResponse> {
    const result = (await api.post(`/vocabulary/update`, word)).data;
    return result;
  },
  async deleteWord(wordId: number): Promise<ApiResponse> {
    const result = (await api.delete(`/vocabulary/delete/${wordId}`)).data;
    return result;
  },
  async addTranscription(transcription: IAddTranscription): Promise<ApiResponse> {
    const result = (await api.post(`/transcription/add`, transcription)).data;
    return result;
  },
  async updateTranscription(transcription: IUpdateTranscription): Promise<ApiResponse> {
    const result = (await api.post(`/transcription/update`, transcription)).data;
    return result;
  },
  async fetchYoutubeTranscription(request: FetchYoutubeTranscriptionRequest): Promise<ApiResponse<YoutubeInfo>> {
    const result = (await api.post(`/transcription/fetch-youtube-transcription`, request)).data;
    return result;
  },
};

export default apis;