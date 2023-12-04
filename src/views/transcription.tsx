import { useParams } from "react-router-dom";
import ITranscription from "../models/transcription";
import { useCallback, useEffect, useRef, useState } from "react";
import apis from "../apis";
import IWord from "../models/word";
import parse from 'html-react-parser';
import add from 'assets/icons/add.png';

function Transcription() {
  const { transcriptionId = '0' } = useParams();
  const transcription = useRef<ITranscription>({title: '', content: ''} as ITranscription);
  const [vocabulary, setVocabulary] = useState<IWord[]>([]);
  const [title, setTitle] = useState<string>("We can't find this article");
  const [content, setContent] = useState<string>('');
  const highlightedText = useRef<string>('');

  const getVocabulary = useCallback(async () => {
    const v = (await apis.getVocabularyByTranscriptionId(Number(transcriptionId))).data;
    setVocabulary(v);
    let contentWithMark = transcription.current.content.replaceAll('\n', '<br />');
    v.forEach(word => {
      contentWithMark = contentWithMark.replace(word.word, `<span class="bg-yellow-200 rounded-md py-1">${word.word}</span>`)
    });
    setContent(contentWithMark);
  }, [transcriptionId]);

  useEffect(() => {
    const getTranscriptionAndVocabulary = async () => {
      if (transcriptionId) {
        const t = (await apis.getTranscription(Number(transcriptionId))).data;
        if (!t) {
          return;
        }
        transcription.current = t;
        setTitle(t.title);
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

  return (
    <div>
      <h1>{title}</h1>
      <article>
        { parse(content) }
      </article>
      <ul>
        { vocabulary.map(word => <li key={word.id}>{ word.word }</li>) }
      </ul>
      <div className='fixed w-8 right-4 top-1/2'>
      <button className={`w-10 h-10 rounded-full shadow-lg bg-stone-200 hover:border hover:border-stone-500 disabled:opacity-80 disabled:border-none`} onClick={saveButton} disabled={saving}>
        <img className='m-auto' src={add} alt=''/>
      </button>
      </div>
    </div>
  );
}

export default Transcription;