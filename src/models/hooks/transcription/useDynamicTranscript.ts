import Transcript from "models/transcript";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIsVisible } from "../useIsVisible";

export default function useDynamicTranscript(startSecond: number, currentSecond: number, isPlaying: boolean) {
  const [currentLine, setCurrentLine] = useState<HTMLLIElement>();
  const saveHTMLElementToState = useCallback((node: HTMLLIElement) => {
    setCurrentLine(node);
  }, []);
  const isCurrentLine = (transcript: Transcript, index: number) => {
    if (currentSecond < startSecond && index === 0) return true;
    return transcript.offset/1000 <= currentSecond && transcript.offset/1000 + transcript.duration/1000 > currentSecond;
  }

  const isPlayingRef = useRef(false);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying])

  const isVisible = useIsVisible(currentLine, { threshold: 1 });
  useEffect(() => {
    if(isPlayingRef.current && !isVisible) {
      currentLine?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentLine, isVisible]);

  return {
    isCurrentLine,
    saveHTMLElementToState,
  }
}