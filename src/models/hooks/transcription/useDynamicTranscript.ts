import Transcript from "models/transcript";
import { useCallback, useEffect, useState } from "react";
import { useIsVisible } from "../useIsVisible";

export default function useDynamicTranscript(startSecond: number, isPlaying: boolean) {
  const [currentSecond, setCurrentSecond] = useState(0);

  const [currentLine, setCurrentLine] = useState<HTMLLIElement>();
  const saveHTMLElementToState = useCallback((node: HTMLLIElement) => {
    setCurrentLine(node);
  }, []);
  const isCurrentLine = (transcript: Transcript, index: number) => {
    if (currentSecond < startSecond && index === 0) return true;
    return transcript.offset/1000 <= currentSecond && transcript.offset/1000 + transcript.duration/1000 > currentSecond;
  }

  const isVisible = useIsVisible(currentLine, { threshold: 1 });
  useEffect(() => {
    if(isPlaying && !isVisible) {
      currentLine?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isPlaying, currentLine, isVisible]);

  return {
    setCurrentSecond,
    isCurrentLine,
    saveHTMLElementToState,
  }
}