import { useParams } from "react-router-dom";
import ITranscription from "../models/transcription";
import { useEffect, useState } from "react";
import apis from "../apis";
import IWord from "../models/word";
import parse from 'html-react-parser';

function Transcription() {
  const { id } = useParams();
  const [transcription, setTranscription] = useState<ITranscription>();
  const [vocabulary, setVocabulary] = useState<IWord[]>();

  useEffect(() => {
    const getTranscriptionAndVocabulary = async () => {
      if (id) {
        const t = (await apis.getTranscription(Number(id))).data;
        if (t) {
          setTranscription(t);
        }

        const v = (await apis.getVocabularyByTranscriptionId(Number(id))).data;
        if (v) {
          setVocabulary(v);
        }
      }
    }
    getTranscriptionAndVocabulary();
  }, [id])

  function Content() {
    if (transcription && vocabulary) {
      let contentWithMark = transcription.content;
      vocabulary.forEach(word => {
        contentWithMark = contentWithMark.replace(word.word, `<span class="bg-yellow-200 rounded-md py-1">${word.word}</span>`)
      });
      return <>{parse(contentWithMark)}</>;
    } else if (transcription) {
      return <>{transcription.content}</>;
    }
    return <></>;
  }
  return (
    <div>
      { transcription &&
        <>
          <h1>{transcription.title}</h1>
          <article>
            <Content />
          </article>
        </>
      }
      { vocabulary &&
        <ul>
          {
            vocabulary.map(word => <li key={word.id}>{ word.word }</li>)
          }
        </ul>
      }
    </div>
  );
}

export default Transcription;