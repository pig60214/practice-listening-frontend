import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import App from '@/App';
import { BrowserRouter } from 'react-router-dom'
import apis from '@/apis';
import fakeApis from '@/fakeApis';

vi.mock('@/apis');
afterEach(cleanup);

describe('Example', async () => {
    it('Global Mock', async () => {
      const spy = vi.spyOn(apis, 'getTranscriptions');

      render(<App />, { wrapper: BrowserRouter });
      expect(spy).toHaveBeenCalledTimes(1);

      const video = await screen.findByText('Solar System 101 | National Geographic');
      expect(video).not.toBeNull();
    });

    it('Local Mock', async () => {
      const spy = vi.spyOn(apis, 'getTranscriptions').mockResolvedValue(fakeApis.getTranscriptions());

      render(<App />, { wrapper: BrowserRouter });
      expect(spy).toHaveBeenCalledTimes(1);

      const video = await screen.findByText('Solar System 101 | National Geographic');
      expect(video).not.toBeNull();
    });
});
