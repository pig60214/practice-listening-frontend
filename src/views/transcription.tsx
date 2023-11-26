import { useParams } from "react-router-dom";
import ITranscription from "../models/transcription";
import { useEffect, useState } from "react";
import apis from "../apis";
import IWord from "../models/word";
import parse from 'html-react-parser';
import add from 'assets/icons/add.png';

function Transcription() {
  const { transcriptionId = '0' } = useParams();
  const [transcription, setTranscription] = useState<ITranscription>({title: "We can't find this article"} as ITranscription);
  const [vocabulary, setVocabulary] = useState<IWord[]>([]);
  const [highlightedText, setHighlightedText] = useState<string>('');
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const getTranscriptionAndVocabulary = async () => {
      if (transcriptionId) {
        const t = (await apis.getTranscription(Number(transcriptionId))).data;
        if (!t) {
          return;
        }
        setTranscription(t);

        const v = (await apis.getVocabularyByTranscriptionId(Number(transcriptionId))).data;
        setVocabulary(v);

        let contentWithMark = t.content;
        v.forEach(word => {
          contentWithMark = contentWithMark.replace(word.word, `<span class="bg-yellow-200 rounded-md py-1">${word.word}</span>`)
        });
        setContent(contentWithMark);
      }
    }
    getTranscriptionAndVocabulary();
  }, [transcriptionId])

  useEffect(() => {
    const saveSelection = () => {
      const selection = window.getSelection()?.toString();
      if (selection) {
        setHighlightedText(selection);
      }
    };
    document.addEventListener('mouseup', saveSelection);
    return () => document.removeEventListener('mouseup', saveSelection);
  }, []);

  const [saving, setSaving] = useState(false);
  const saveButton = async () => {
    setSaving(true);
    const word: IWord = {
      id: 0,
      transcriptionId: Number(transcriptionId),
      word: highlightedText,
    }
    await apis.addWord(word);
    setSaving(false);
  };

  return (
    <div>
      <h1>{transcription.title}</h1>
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