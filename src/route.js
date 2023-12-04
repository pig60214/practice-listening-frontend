import { createBrowserRouter } from "react-router-dom";
import Transcription from "./views/transcription";
import App from "./App";
import AddTranscription from "views/addTranscription";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  }, {
    path: "/transcription/:transcriptionId",
    element: <Transcription />,
  }, {
    path: "/add-transcription",
    element: <AddTranscription />,
  }
]);

export default router;