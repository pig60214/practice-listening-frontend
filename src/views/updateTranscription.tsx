import apis from "@/apis";
import FetchYoutubeTranscriptionRequest from "@/models/fetchYoutubeTranscriptionRequest";
import { IUpdateTranscription } from "@/models/transcription";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function UpdateTranscription() {
  const { transcriptionId } = useParams();
  const [transcription, setTranscription] = useState<IUpdateTranscription>({title: '', youtubeUrl: '', content: ''} as IUpdateTranscription);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getTranscription = async () => {
      if (transcriptionId) {
        setIsLoading(true);
        const t = (await apis.getTranscription(Number(transcriptionId))).data;
        if (t) {
          setTranscription(t);
        }
        setIsLoading(false);
      }
    }
    getTranscription();
  }, [transcriptionId])

  const saveTranscription = async () => {
    setIsSaving(true);
    if(transcriptionId) {
      await apis.updateTranscription(transcription)
    } else {
      await apis.addTranscription(transcription)
    }
    setIsSaving(false);
  }
  const [isRetreving, setisRetreving] = useState(false);
  const lang = useRef('en');
  const fetchYoutubeTranscription =async () => {
    setisRetreving(true);
    const request: FetchYoutubeTranscriptionRequest = {
      youtubeUrl: transcription.youtubeUrl,
      lang: lang.current,
    }
    const result = await apis.fetchYoutubeTranscription(request);
    setTranscription({...transcription, title: result.data.title, content: JSON.stringify(result.data.transcript)});
    setisRetreving(false);
  }
  return (
    <>
    <div className="grid gap-2 justify-items-stretch max-w-3xl mt-4 md:mt-0 mx-4 md:mx-auto">
      <div className="flex gap-2">
      <input className="grow textbox" value={transcription.youtubeUrl} onChange={(e) => setTranscription({...transcription, youtubeUrl: e.target.value})} placeholder="Youtube Url" />
      <select onChange={(e) => lang.current = e.target.value}>
        <option value="en">English</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
        <option value="es-ES">Spanish</option>
      </select>
      <button className="button secondary md:w-fit justify-self-center" onClick={fetchYoutubeTranscription} disabled={isRetreving}>Retrieve</button>
      </div>
      <input className="textbox" value={transcription.title} onChange={(e) => setTranscription({...transcription, title: e.target.value})} placeholder="Title" />
      <textarea className="textbox" value={transcription.content} onChange={(e) => setTranscription({...transcription, content: e.target.value})} placeholder="Transcript"></textarea>
      <button className="button md:w-fit justify-self-center mt-3" onClick={saveTranscription} disabled={isSaving}>save</button>
    </div>
    {
      (isLoading || isRetreving || isSaving) &&
      <div className="w-full h-full z-10 absolute top-0 bg-stone-100 opacity-70 grid place-content-center">
        <div className="animate-pulse">● ● ●</div>
      </div>
    }
    </>
  );
}