interface IAddTranscription {
  title: string,
  content: string,
  youtubeUrl: string,
}

interface IUpdateTranscription {
  id: number,
  title: string,
  content: string,
  youtubeUrl: string,
}

interface ITranscription {
  id: number,
  title: string,
  content: string,
  youtubeUrl: string,
  createDate: string,
}

 export type {
  IAddTranscription,
  IUpdateTranscription,
  ITranscription
}