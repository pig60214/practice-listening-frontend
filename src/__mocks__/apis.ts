import fakeApis from "@/fakeApis";
import { vi } from 'vitest';

const apis = {
  getTranscriptions: vi.fn(() => {
    return Promise.resolve(fakeApis.getTranscriptions());
  }),
  getTranscription: vi.fn(() => {
    return Promise.resolve(fakeApis.getTranscription());
  }),
  getVocabularyByTranscriptionId: vi.fn(() => {
    return Promise.resolve(fakeApis.getVocabularyByTranscriptionId());
  }),
}

export default apis;