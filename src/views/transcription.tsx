import { useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import apis from "../apis";
import IWord from "../models/word";
import parse from 'html-react-parser';
import add from 'assets/icons/add.png';
import ReactPlayer from 'react-player/youtube'
import Transcript from "models/transcript";
import { useIsVisible } from "models/hooks/useIsVisible";
import useTranscription from "models/hooks/transcription/useTranscription";

function Transcription() {
  const { transcriptionId = '0' } = useParams();
  const { vocabulary, transcripts, content, loading, title, youtubeUrl, startSecond, getVocabulary } = useTranscription(transcriptionId);
  const highlightedText = useRef<string>('');

  useEffect(() => {
    const saveSelection = () => {
      const selection = window.getSelection()?.toString();
      if (selection) {
        highlightedText.current = selection;
      }
    };
    document.addEventListener('mouseup', saveSelection);
    document.addEventListener('touchend', saveSelection);
    return () => {
      document.removeEventListener('mouseup', saveSelection);
      document.removeEventListener('touchend', saveSelection);
    }
  }, []);

  const [saving, setSaving] = useState(false);
  const saveButton = useCallback(async () => {
    if(highlightedText.current === '') return;
    setSaving(true);
    const word: IWord = {
      id: 0,
      transcriptionId: Number(transcriptionId),
      word: highlightedText.current,
    }
    await apis.addWord(word);
    await getVocabulary();
    setSaving(false);
  }, [transcriptionId, getVocabulary]);

  useEffect(() => {
    const enterEvent = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        saveButton();
      }
    }
    document.body.addEventListener('keydown', enterEvent)
    return () => document.removeEventListener('keydown', enterEvent);
  }, [saveButton]);

  const player = useRef<ReactPlayer>(null);
  const [currentSecond, setCurrentSecond] = useState(0);
  const [currentLine, setCurrentLine] = useState<HTMLLIElement>();
  const isCurrentLine = (transcript: Transcript, index: number) => {
    if (currentSecond < startSecond.current && index === 0) return true;
    return transcript.offset/1000 <= currentSecond && transcript.offset/1000 + transcript.duration/1000 > currentSecond;
  }

  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const enterEvent = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setPlaying(!playing);
        e.preventDefault()
      }
    }
    document.body.addEventListener('keydown', enterEvent)
    return () => document.removeEventListener('keydown', enterEvent);
  }, [playing]);

  const isVisible = useIsVisible(currentLine, { threshold: 1 });
  const handleRect = useCallback((node: HTMLLIElement) => {
    setCurrentLine(node);
  }, []);

  useEffect(() => {
    if(playing && !isVisible) {
      currentLine?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [playing, currentLine, isVisible]);

  const [showVocabularyInMobile, setShowVocabularyInMobile] = useState(false);
  const showOrHidden = showVocabularyInMobile ? 'block' : 'hidden';
  const showOrHiddenBtnText = showVocabularyInMobile ? 'Hide Vocabulary' : 'Show Vocabulary';

  return (
    <div className={` ${loading? 'animate-pulse' : ''}`} style={{height: '90dvh'}}>
      <h1>{title}</h1>
      <div className="flex flex-col md:flex-row md:gap-3" style={{height: '90%'}}>
        <div className="w-full h-full md:w-1/2 flex flex-col">
          <div className="w-full aspect-video flex-none bg-stone-200">
            <ReactPlayer
              ref={player}
              width='100%' height='100%'
              controls
              playing={playing}
              url={youtubeUrl}
              onProgress={({playedSeconds}) => setCurrentSecond(playedSeconds)}
              onPause={() => setPlaying(false)}
              onPlay={() => setPlaying(true)}
            />
          </div>
          <button className="md:hidden" onClick={() => setShowVocabularyInMobile(!showVocabularyInMobile)}>{showOrHiddenBtnText}</button>
          <ul className={`${showOrHidden} md:block overflow-auto space-y-1`}>
            { vocabulary.map(word => <li key={word.id}>{ word.word }</li>) }
          </ul>
        </div>
        <article className="w-full md:w-1/2 overflow-auto">
          <ul className="space-y-2">
          { parse(content) }
          { transcripts.map((transcript, index) => {
              const isMe = isCurrentLine(transcript, index);
              const className = isMe ? 'bg-yellow-100' : '';
              return(
                <li key={transcript.offset} className={className} ref={isMe ? handleRect : null}>
                  <span onClick={() => {player.current?.seekTo(transcript.offset/1000); setPlaying(true);}} className="cursor-pointer pr-2">▶</span>
                  {parse(transcript.text.replaceAll('\n', ' '))}
                </li>)
            }
          )}
          </ul>
        </article>
      </div>

      <div className='fixed w-8 right-4 top-1/2'>
      <button className={`w-10 h-10 rounded-full shadow-lg bg-stone-200 hover:border hover:border-stone-500 disabled:opacity-80 disabled:border-none`} onClick={saveButton} disabled={saving}>
        <img className='m-auto' src={add} alt=''/>
      </button>
      </div>
    </div>
  );
}

export default Transcription;