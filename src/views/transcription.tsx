import { useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import apis from "@/apis";
import IWord from "@/models/word";
import parse from 'html-react-parser';
import add from '@/assets/icons/add.png';
import ReactPlayer from 'react-player/youtube'
import useTranscription from "@/models/hooks/transcription/useTranscription";
import useIsPlaying from "@/models/hooks/transcription/useIsPlaying";
import useDynamicTranscript from "@/models/hooks/transcription/useDynamicTranscript";
import pause from '@/assets/icons/pause.png';
import play from '@/assets/icons/play.png';

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
  const seekTo = (offset: number) => {
    player.current?.seekTo(offset/1000, 'seconds');
    setIsPlaying(true);
  }
  const { isPlaying, setIsPlaying } = useIsPlaying();
  const [currentSecond, setCurrentSecond] = useState(0);

  const [showVocabularyInMobile, setShowVocabularyInMobile] = useState(false);
  const showOrHidden = showVocabularyInMobile ? 'block' : 'hidden';
  const showOrHiddenForTranscript = showVocabularyInMobile ? 'hidden' : 'block';
  const showOrHiddenBtnText = showVocabularyInMobile ? 'Vocabulary ▲' : 'Vocabulary ▼';

  const TranscriptArea = () => {
    const { isCurrentLine, saveHTMLElementToState } = useDynamicTranscript(startSecond.current, currentSecond, isPlaying);
    return (
      <ul className="space-y-2">
      { parse(content) }
      { transcripts.map((transcript, index) => {
          const isMe = isCurrentLine(transcript, index);
          const className = isMe ? 'bg-yellow-100' : '';
          return(
            <li key={transcript.offset} className={className} ref={isMe ? saveHTMLElementToState : null}>
              <span onClick={() => {seekTo(transcript.offset);}} className="cursor-pointer pr-2">▶</span>
              {parse(transcript.text.replaceAll('\n', ' '))}
            </li>
          )
        }
      )}
      </ul>
    );
  }

  return (<>
    <div className={`${loading? 'animate-pulse' : ''} h-full flex flex-col md:flex-row md:gap-3`}>
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
        <h1 className="px-4 md:px-0 md:text-lg font-semibold md:font-bold my-1 truncate">{title}</h1>
        <div className="mx-4 px-2 py-1 md:hidden text-center bg-stone-200" onClick={() => setShowVocabularyInMobile(!showVocabularyInMobile)}>{showOrHiddenBtnText}</div>
        <div className={`${showOrHidden} md:block / mb-4 md:mb-0 mx-4 md:mx-0 px-2 py-1 / grow h-0 overflow-auto / bg-stone-200`}>
          <ul className='space-y-1'>
            { vocabulary.map(word => {
              const goto = () => {
                if(word.videoOffset) {
                  seekTo(word.videoOffset);
                }
              }
              return <li key={word.id}>
                  <span onClick={goto} className={`pr-2 ${word.videoOffset ? 'cursor-pointer' : 'opacity-20'}`}>▶</span>
                  { word.word }
                </li>
            }) }
          </ul>
        </div>
      </div>
      <article className={`${showOrHiddenForTranscript} md:block w-full md:w-1/2 overflow-auto pb-4 px-4 md:p-0`}>
        <TranscriptArea />
      </article>
    </div>
    <div className='fixed w-8 right-4 top-1/2 space-y-2'>
      <button className={`w-10 h-10 rounded-full shadow-lg bg-stone-200 hover:border hover:border-stone-500 disabled:opacity-80 disabled:border-none`} onClick={saveButton} disabled={saving}>
        <img className='m-auto' src={add} alt=''/>
      </button>
      <button className={`md:hidden w-10 h-10 rounded-full shadow-lg bg-stone-200 hover:border hover:border-stone-500 disabled:opacity-80 disabled:border-none`} onClick={() => setIsPlaying(!isPlaying)}>
        <img className='m-auto' src={isPlaying ? pause : play} alt=''/>
      </button>
    </div>
  </>);
}

export default Transcription;