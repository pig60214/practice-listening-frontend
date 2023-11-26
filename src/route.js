import { createBrowserRouter } from "react-router-dom";
import Transcription from "./views/transcription";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  }, {
    path: "/transcription/:transcriptionId",
    element: <Transcription />,
  }
]);

export default router;