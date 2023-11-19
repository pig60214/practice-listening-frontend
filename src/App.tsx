import { useEffect, useState } from 'react';
import apis from './apis';
import { Link } from "react-router-dom";
import ITranscription from './models/transcription';

function App() {
  const [transcriptions, setTranscriptions] = useState<ITranscription[]>([]);
  useEffect(() => {
    const getTranscriptions = async () => {
      const t = (await apis.getTranscriptions()).data;
      setTranscriptions(t);
    }
    getTranscriptions();
  }, [])

  return (
    <ul>
      { transcriptions.map(t => <li key={t.id}><Link to={`transcription/${t.id}`}>{t.title}</Link></li>) }
    </ul>
  );
}

export default App;
