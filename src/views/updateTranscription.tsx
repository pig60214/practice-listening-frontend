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
    setTranscription({...transcription, title: result.data.title, content: JSON.stringify(result.data.transcript)});
    setRetreving(false);
  }
  return (
    <>
    <div className="grid gap-2 justify-items-stretch max-w-3xl mx-4 md:mx-auto">
      <div className="flex gap-2">
      <input className="grow textbox" value={transcription.youtubeUrl} onChange={(e) => setTranscription({...transcription, youtubeUrl: e.target.value})} placeholder="Youtube Url" />
      <button className="button secondary md:w-fit justify-self-center" onClick={fetchYoutubeTranscription} disabled={retreving}>Retrieve</button>
      </div>
      <input className="textbox" value={transcription.title} onChange={(e) => setTranscription({...transcription, title: e.target.value})} placeholder="Title" />
      <textarea className="textbox" value={transcription.content} onChange={(e) => setTranscription({...transcription, content: e.target.value})} placeholder="Transcript"></textarea>
      <button className="button md:w-fit justify-self-center mt-3" onClick={saveTranscription} disabled={saving}>save</button>
    </div>
    </>
  );
}