import apis from "@/apis";
import Transcript from "@/models/transcript";
import { ITranscription } from "@/models/transcription";
import IWord from "@/models/word";
import { useCallback, useEffect, useRef, useState } from "react";

export default function useTranscription(transcriptionId: string) {
  const [vocabulary, setVocabulary] = useState<IWord[]>([]);
  const transcription = useRef<ITranscription>({title: '', content: ''} as ITranscription);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const startSecond = useRef(0);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState<string>("Loading");
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');

  const getVocabulary = useCallback(async () => {
    const vocabulary = (await apis.getVocabularyByTranscriptionId(Number(transcriptionId))).data;
    setVocabulary(vocabulary);
    try {
      const lines: Transcript[] = JSON.parse(transcription.current.content);
      if (lines.length > 0) {
        lines.forEach(line => {
          line.text = line.text.replaceAll('\n', ' ');
        });
        vocabulary.forEach(word => {
          let line = lines.find(line => line.offset === word.videoOffset);
          const replace = (line: Transcript) => {
            line.text = line.text.replace(word.word, `<span class='bg-yellow-200 rounded-md py-1'>${word.word}</span>`);
          }
          if(line) {
            if(line.text.indexOf(word.word) > -1) {
              replace(line);
            } else {
              word.videoOffset = -1;
              apis.updateWord(word);
            }
          } else {
            line = lines.find(line => line.text.indexOf(word.word) > -1);
            if(line) {
              word.videoOffset = line.offset;
              apis.updateWord(word);
            } else {
              if (word.videoOffset != -1) {
                word.videoOffset = -1;
                apis.updateWord(word);
              }
            }
          }
        })
        setTranscripts(lines);
        startSecond.current = lines[0].offset / 1000;
      }
    } catch (e) {
      let contentWithMark = transcription.current.content;
      vocabulary.forEach(word => {
        contentWithMark = contentWithMark.replace(word.word, `<span class='bg-yellow-200 rounded-md py-1'>${word.word}</span>`)
      });
      setContent(contentWithMark.replaceAll('\n', '<br />'));
    }
    setLoading(false);
  }, [transcriptionId]);

  useEffect(() => {
    const getTranscription = async () => {
      if (transcriptionId) {
        const t = (await apis.getTranscription(Number(transcriptionId))).data;
        if (!t) {
          setTitle("We can't find this article");
          setLoading(false);
          return;
        }
        transcription.current = t;
        setTitle(t.title);
        setYoutubeUrl(t.youtubeUrl);
        getVocabulary();
      }
    }

    getTranscription();
  }, [transcriptionId, getVocabulary])

  return {
    vocabulary,
    transcripts,
    content,
    loading,
    title,
    youtubeUrl,
    startSecond,
    getVocabulary
  }
}