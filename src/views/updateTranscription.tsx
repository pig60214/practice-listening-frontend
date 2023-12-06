import apis from "apis";
import FetchYoutubeTranscriptionRequest from "models/fetchYoutubeTranscriptionRequest";
import { IUpdateTranscription } from "models/transcription";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UpdateTranscription() {
  const { transcriptionId } = useParams();
  const [transcription, setTranscription] = useState<IUpdateTranscription>({title: '', youtubeUrl: '', content: ''} as IUpdateTranscription);
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
    if(transcriptionId) {
      await apis.updateTranscription(transcription)
    } else {
      await apis.addTranscription(transcription)
    }
    setSaving(false);
  }
  const [retreving, setRetreving] = useState(false);
  const fetchYoutubeTranscription =async () => {
    setRetreving(true);
    const request: FetchYoutubeTranscriptionRequest = {
      youtubeUrl: transcription.youtubeUrl,
    }
    const result = await apis.fetchYoutubeTranscription(request);
    setTranscription({...transcription, content: JSON.stringify(result.data)});
    setRetreving(false);
  }
  return (
    <>
    <div className="flex flex-col">
      <input value={transcription.title} onChange={(e) => setTranscription({...transcription, title: e.target.value})} placeholder="Title" />
      <input value={transcription.youtubeUrl} onChange={(e) => setTranscription({...transcription, youtubeUrl: e.target.value})} placeholder="Youtube Url" />
      <button onClick={fetchYoutubeTranscription} disabled={retreving}>Retrieve Transcript From Youtube</button>
      <textarea value={transcription.content} onChange={(e) => setTranscription({...transcription, content: e.target.value})} placeholder="Transcript"></textarea>
      <button onClick={saveTranscription} disabled={saving}>save</button>
    </div>
    </>
  );
}