import { Bridge } from "./pages/bridge";
import { RemoteController } from "./pages/remote-controller";

export function App() {
  const params = new URLSearchParams(location.search);
  if (params.get("page") === "remote-controller") {
    return <RemoteController/>;
  }

  return <Bridge />;
}
