import { useEffect, useState } from "react";

export default function useIsPlaying() {
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    const enterEvent = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsPlaying(!isPlaying);
        e.preventDefault()
      }
    }
    document.body.addEventListener('keydown', enterEvent)
    return () => document.removeEventListener('keydown', enterEvent);
  }, [isPlaying]);

  return {
    isPlaying,
    setIsPlaying,
  }
}