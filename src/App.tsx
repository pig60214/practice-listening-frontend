import { useEffect, useState } from 'react';
import apis from './apis';
import { Link, useNavigate } from "react-router-dom";
import { ITranscription } from './models/transcription';
import add from 'assets/icons/add.png';

interface VideoImageProps {
  youtubeUrl: string,
}

const getVideoId = (youtubeUrl: string): string => {
  if (!youtubeUrl) {
    return '';
  }
  if (youtubeUrl.includes('youtube.com') && youtubeUrl.includes('v=')) {
    const id = youtubeUrl.split('v=')[1].substring(0, 11);
    return id
  }
  if(youtubeUrl.includes('youtu.be')) {
    //eslint-disable-next-line
    const regex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = youtubeUrl.match(regex);
    if (match) {
      return match[1];
    }
  }
  return '';
}

function App() {
  const [loading, setLoading] = useState(true);
  const [transcriptions, setTranscriptions] = useState<ITranscription[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getTranscriptions = async () => {
      const t = (await apis.getTranscriptions()).data;
      setTranscriptions(t);
      setLoading(false);
    }
    getTranscriptions();
  }, [])

  const VideoImage = (props: VideoImageProps) => {
    const videoId = getVideoId(props.youtubeUrl);
    if (videoId === '') {
      return <div style={{maxWidth: 480, aspectRatio: '4/3'}} className='bg-stone-100'></div>;
    }
    return <img src={`https://img.youtube.com/vi/${videoId}/0.jpg`} alt={props.youtubeUrl} />
  }

  return (
    <>
    <ul className='grid gap-3 justify-items-center grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
      { loading && [1,2,3,4,5,6].map(i => (<>
        <li key={i}><div>
          <div className='animate-pulse w-full md:w-60 bg-stone-200' style={{aspectRatio: '4/3'}}></div>
          <div className='bg-stone-200 h-4 mt-1'></div>
        </div></li>
      </>))}
      { transcriptions.map(t => (
        <li key={t.id}>
          <Link to={`transcription/${t.id}`} className='w-full md:w-60 block'>
            <VideoImage youtubeUrl={t.youtubeUrl} />
            {t.title}
          </Link>
        </li>)) }
    </ul>
    <div className='fixed w-8 right-4 top-1/2'>
      <button className={`w-10 h-10 rounded-full shadow-lg bg-stone-200 hover:border hover:border-stone-500 disabled:opacity-80 disabled:border-none`} onClick={() => navigate('add-transcription')}>
        <img className='m-auto' src={add} alt=''/>
      </button>
    </div>
    </>
  );
}

export default App;
