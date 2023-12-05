import apis from "apis";
import ITranscription from "models/transcription";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UpdateTranscription() {
  const { transcriptionId = '0' } = useParams();
  const [transcription, setTranscription] = useState<ITranscription>({title: '', youtubeUrl: '', content: ''} as ITranscription);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const getTranscription = async () => {
      if (transcriptionId) {
        const t = (await apis.getTranscription(Number(transcriptionId))).data;
        if (!t) {
          return;
        }
        setTranscription(t);
      }
    }
    getTranscription();
  }, [transcriptionId])

  const saveTranscription = async () => {
    setSaving(true);
    await apis.updateTranscription(transcription)
    setSaving(false);
  }
  return (
    <>
      <input value={transcription.title} onChange={(e) => setTranscription({...transcription, title: e.target.value})} placeholder="Title" />
      <input value={transcription.youtubeUrl} onChange={(e) => setTranscription({...transcription, youtubeUrl: e.target.value})} placeholder="Youtube Url" />
      <textarea value={transcription.content} onChange={(e) => setTranscription({...transcription, content: e.target.value})}></textarea>
      <button onClick={saveTranscription} disabled={saving}>save</button>
    </>
  );
}