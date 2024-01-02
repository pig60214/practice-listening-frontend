import { describe, it, vi, afterEach, expect } from 'vitest';
import { cleanup, renderHook, waitFor } from '@testing-library/react';
import useTranscription from '@/models/hooks/transcription/useTranscription';
import fakeApis from '@/fakeApis';

vi.mock('@/apis');
afterEach(cleanup);

describe('useTranscription.test', async () => {
    it('Test Hook Result', async () => {
      const { result } = renderHook(() => useTranscription('2'));

      const transcripts = [
        {
          text: "You produce between two - three <span class='bg-yellow-200 rounded-md py-1'>pint</span>s of <span class='bg-yellow-200 rounded-md py-1'>urine</span>\nevery day",
          duration: 4811,
          offset: 359
        },
        {
          text: 'So, what does\nyour pee say about you?',
          duration: 5190,
          offset: 5170
        }
      ]

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.vocabulary).toStrictEqual(fakeApis.getVocabularyByTranscriptionId().data);
        expect(result.current.transcripts).toStrictEqual(transcripts);
        expect(result.current.loading).toBe(false);
        expect(result.current.title).toBe(fakeApis.getTranscription().data.title);
        expect(result.current.youtubeUrl).toBe(fakeApis.getTranscription().data.youtubeUrl);
        expect(result.current.startSecond.current).toBe(0.359);
      });

    });
});
