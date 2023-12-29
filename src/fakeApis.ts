import { ITranscription } from "@/models/transcription";
import ApiResponse from "@/models/apiResponse";

const fakeApis = {
  getTranscriptions(): ApiResponse<ITranscription[]> {
    return {
      "errorCode": 0,
      "data": [
        {
          "id": 8,
          "title": "Solar System 101 | National Geographic",
          "youtubeUrl": "https://youtu.be/libKVRa01L8?si=duhATZLf3RodhNp7"
        },
        {
          "id": 1,
          "title": "IS Vaping Worse Than Smoking",
          "youtubeUrl": "https://youtu.be/N0IYc-leYFg?si=Oq_bGqSkrs_LfS9q"
        },
        {
          "id": 2,
          "title": "What Does Your PEE Say About You?",
          "youtubeUrl": "https://www.youtube.com/watch?v=5GIfISN4-G8"
        }
      ]
    } as ApiResponse<ITranscription[]>;
  },
};

export default fakeApis;
