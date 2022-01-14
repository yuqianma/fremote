import { Controller } from "./pages/controller";
import { Client } from "./pages/client";

export function App() {
  const params = new URLSearchParams(location.search.replace("?", ""));
  if (params.has("controller")) {
    return <Controller />;
  }

  return <Client />;
}
