import { useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import apis from "../apis";
import IWord from "../models/word";
import parse from 'html-react-parser';
import add from 'assets/icons/add.png';
import ReactPlayer from 'react-player/youtube'
import useTranscription from "models/hooks/transcription/useTranscription";
import useIsPlaying from "models/hooks/transcription/useIsPlaying";
import useDynamicTranscript from "models/hooks/transcription/useDynamicTranscript";

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
  const { isPlaying, setIsPlaying } = useIsPlaying();
  const { setCurrentSecond, isCurrentLine, saveHTMLElementToState } = useDynamicTranscript(startSecond.current, isPlaying);

  const [showVocabularyInMobile, setShowVocabularyInMobile] = useState(false);
  const showOrHidden = showVocabularyInMobile ? 'block' : 'hidden';
  const showOrHiddenBtnText = showVocabularyInMobile ? 'Hide Vocabulary' : 'Show Vocabulary';

  return (
    <div className={`h-full flex flex-col ${loading? 'animate-pulse' : ''}`}>
      <h1 className="px-4 md:px-0">{title}</h1>
      <div className="grow h-0 flex flex-col md:flex-row md:gap-3" >
        <div className="w-full h-full md:w-1/2 flex flex-col">
          <div className="w-full aspect-video flex-none bg-stone-200">
            <ReactPlayer
              ref={player}
              width='100%' height='100%'
              controls
              playing={isPlaying}
              url={youtubeUrl}
              onProgress={({playedSeconds}) => setCurrentSecond(playedSeconds)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
            />
          </div>
          <button className="px-4 md:hidden" onClick={() => setShowVocabularyInMobile(!showVocabularyInMobile)}>{showOrHiddenBtnText}</button>
          <ul className={`${showOrHidden} md:block overflow-auto space-y-1 px-4 md:px-0`}>
            { vocabulary.map(word => <li key={word.id}>{ word.word }</li>) }
          </ul>
        </div>
        <article className="w-full md:w-1/2 overflow-auto px-4 md:px-0">
          <ul className="space-y-2">
          { parse(content) }
          { transcripts.map((transcript, index) => {
              const isMe = isCurrentLine(transcript, index);
              const className = isMe ? 'bg-yellow-100' : '';
              return(
                <li key={transcript.offset} className={className} ref={isMe ? saveHTMLElementToState : null}>
                  <span onClick={() => {player.current?.seekTo(transcript.offset/1000); setIsPlaying(true);}} className="cursor-pointer pr-2">▶</span>
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