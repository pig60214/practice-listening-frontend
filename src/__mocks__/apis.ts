import fakeApis from "@/fakeApis";
import { vi } from 'vitest';

const apis = {
  getTranscriptions: vi.fn(() => {
    return Promise.resolve(fakeApis.getTranscriptions());
  }),
}

export default apis;