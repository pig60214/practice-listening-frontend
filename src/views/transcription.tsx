import { useParams } from "react-router-dom";
import { ITranscription } from "../models/transcription";
import { useCallback, useEffect, useRef, useState } from "react";
import apis from "../apis";
import IWord from "../models/word";
import parse from 'html-react-parser';
import add from 'assets/icons/add.png';
import ReactPlayer from 'react-player/youtube'
import Transcript from "models/transcript";

function Transcription() {
  const [loading, setLoading] = useState(true);
  const { transcriptionId = '0' } = useParams();
  const transcription = useRef<ITranscription>({title: '', content: ''} as ITranscription);
  const [vocabulary, setVocabulary] = useState<IWord[]>([]);
  const [title, setTitle] = useState<string>("Loading");
  const [content, setContent] = useState<string>('');
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const highlightedText = useRef<string>('');

  const getVocabulary = useCallback(async () => {
    const v = (await apis.getVocabularyByTranscriptionId(Number(transcriptionId))).data;
    setVocabulary(v);
    let contentWithMark = transcription.current.content;
    v.forEach(word => {
      contentWithMark = contentWithMark.replace(word.word, `<span class='bg-yellow-200 rounded-md py-1'>${word.word}</span>`)
    });
    try {
      const result = JSON.parse(contentWithMark);
      setTranscripts(result);
    } catch (e) {
      setContent(contentWithMark.replaceAll('\n', '<br />'));
    }
    setLoading(false);
  }, [transcriptionId]);

  useEffect(() => {
    const getTranscriptionAndVocabulary = async () => {
      if (transcriptionId) {
        const t = (await apis.getTranscription(Number(transcriptionId))).data;
        if (!t) {
          setTitle("We can't find this article");
          setLoading(false);
          return;
        }
        transcription.current = t;
        setTitle(t.title);
        setYoutubeUrl(t.youtubeUrl);
        getVocabulary();
      }
    }
    getTranscriptionAndVocabulary();
  }, [transcriptionId, getVocabulary])

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
  const [showVocabularyInMobile, setShowVocabularyInMobile] = useState(false);
  const showOrHidden = showVocabularyInMobile ? 'block' : 'hidden';
  const showOrHiddenBtnText = showVocabularyInMobile ? 'Hide Vocabulary' : 'Show Vocabulary'
  const isHighlighted = (transcript: Transcript) => transcript.offset/1000 <= currentSecond && transcript.offset/1000 + transcript.duration/1000 >= currentSecond ? 'bg-yellow-100' : '';

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

  return (
    <div className={`h-screen ${loading? 'animate-pulse' : ''}`} style={{padding: '5%'}}>
      <h1>{title}</h1>
      <div className="flex flex-col md:flex-row md:gap-3" style={{height: '90%'}}>
        <div className="w-full h-full md:w-1/2 flex flex-col">
          <div className="w-full aspect-video flex-none bg-stone-200">
            <ReactPlayer ref={player} width='100%' height='100%' controls playing={playing} url={youtubeUrl} onProgress={({playedSeconds}) => setCurrentSecond(playedSeconds)} />
          </div>
          <button className="md:hidden" onClick={() => setShowVocabularyInMobile(!showVocabularyInMobile)}>{showOrHiddenBtnText}</button>
          <ul className={`${showOrHidden} md:block overflow-auto space-y-1`}>
            { vocabulary.map(word => <li key={word.id}>{ word.word }</li>) }
          </ul>
        </div>
        <article className="w-full md:w-1/2 overflow-auto">
          <ul className="space-y-2">
          { parse(content) }
          { transcripts.map(t => (
            <li key={t.offset} className={`${isHighlighted(t)}`}>
              <span onClick={() => {player.current?.seekTo(t.offset/1000)}} className="cursor-pointer pr-2">▶</span>
              {parse(t.text.replaceAll('\n', ' '))}
            </li>)
          ) }
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