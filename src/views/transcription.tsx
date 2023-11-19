import { useParams } from "react-router-dom";
import ITranscription from "../models/transcription";
import { useEffect, useState } from "react";
import apis from "../apis";

function Transcription() {
  const { id } = useParams();
  const [transcription, setTranscription] = useState<ITranscription>();

  useEffect(() => {
    const getTranscription = async () => {
      if (id) {
        const t = (await apis.getTranscription(Number(id))).data;
        if (t) {
          setTranscription(t);
        }
      }
    }
    getTranscription();
  }, [id])
  return (
    <div>
      { transcription &&
        <>
          <h1>{transcription.title}</h1>
          <article>{transcription.content}</article>
        </>
      }
    </div>
  );
}

export default Transcription;