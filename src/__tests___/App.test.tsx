import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import App from '@/App';
import { BrowserRouter, RouterProvider, createMemoryRouter } from 'react-router-dom'
import apis from '@/apis';
import fakeApis from '@/fakeApis';
import userEvent from '@testing-library/user-event'
import { routes } from '@/route';

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

describe('App', async () => {
  it('Get Transcriptions And Display Videos', async () => {
    const getTranscriptions = vi.spyOn(apis, 'getTranscriptions');

    render(<App />, { wrapper: BrowserRouter });
    expect(getTranscriptions).toHaveBeenCalledTimes(1);

    const video = await screen.findByText('Solar System 101 | National Geographic');
    expect(video).not.toBeNull();
  });

  it('Click New Transcription Button And Go To New Transcription Page', async () => {
    const router = createMemoryRouter(routes);
    render(<RouterProvider router={router} />);
    const user = userEvent.setup();

    const button = screen.getByAltText('add');
    await user.click(button);

    const input = await screen.findByPlaceholderText('Youtube Url');
    expect(input.getAttribute('value')).toBe('')
  });
});