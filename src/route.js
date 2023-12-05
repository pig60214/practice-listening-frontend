import { createBrowserRouter } from "react-router-dom";
import Transcription from "./views/transcription";
import App from "./App";
import AddTranscription from "views/addTranscription";
import UpdateTranscription from "views/updateTranscription";

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
  },
  {
    path: "/update-transcription/:transcriptionId",
    element: <UpdateTranscription />,
  }
]);

export default router;