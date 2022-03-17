import { Home } from "./pages/home";
import { Bridge } from "./pages/bridge";
import { RemoteController } from "./pages/remote-controller";
import { Assist } from "./pages/assist";

export function App() {
  const params = new URLSearchParams(location.search);
  const page = params.get("page");
  const roomId = params.get("room-id");

  if (page === "bridge") {
    document.title += " - Bridge";
    return <Bridge/>;
  }
  if (page === "assist") {
    document.title += " - Assist";
    return <Assist />;
  }
  // omit page string to simplify the url qrcode
  if (roomId) {
    document.title += " - Remote Controller";
    return <RemoteController roomId={roomId}/>;
  }

  document.title += " - Home";
  return <Home />;
}
