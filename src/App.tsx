import { useEffect, useState } from 'react';
import apis from './apis';
import { Link } from "react-router-dom";
import { ITranscription } from './models/transcription';

function App() {
  const [loading, setLoading] = useState(true);
  const [transcriptions, setTranscriptions] = useState<ITranscription[]>([]);
  useEffect(() => {
    const getTranscriptions = async () => {
      const t = (await apis.getTranscriptions()).data;
      setTranscriptions(t);
      setLoading(false);
    }
    getTranscriptions();
  }, [])

  return (
    <>
    <a href='add-transcription'>Add New Transcription</a>
    <ul>
      { loading && (<>
        <li><span className='animate-pulse w-36 h-4 inline-block bg-stone-200'></span></li>
        <li><span className='animate-pulse w-40 h-4 inline-block bg-stone-200'></span></li>
        <li><span className='animate-pulse w-32 h-4 inline-block bg-stone-200'></span></li>
      </>)}
      { transcriptions.map(t => <li key={t.id}><Link to={`transcription/${t.id}`}>{t.title}</Link></li>) }
    </ul>
    </>
  );
}

export default App;
