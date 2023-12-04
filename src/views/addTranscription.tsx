import apis from "apis";
import ITranscription from "models/transcription";
import { useRef, useState } from "react";

export default function AddTranscription() {
  const title = useRef<string>('');
  const youtubeUrl = useRef<string>('');
  const content = useRef<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const saveTranscription = async () => {
    setSaving(true);
    const transcription: ITranscription = {
      id: 0,
      title: title.current,
      youtubeUrl: youtubeUrl.current,
      content: content.current,
      createDate: '',
    }

    await apis.addTranscription(transcription)
    setSaving(false);
  }
  return (
    <>
      <input onChange={(e) => title.current = e.target.value} placeholder="Title" />
      <input onChange={(e) => youtubeUrl.current = e.target.value} placeholder="Youtube Url" />
      <textarea onChange={(e) => content.current = e.target.value}></textarea>
      <button onClick={saveTranscription} disabled={saving}>save</button>
    </>
  );
}