import { Controller } from "./pages/controller";

export function App() {
  const params = new URLSearchParams(location.search.replace("?", ""));
  if (params.has("controller")) {
    return <Controller />;
  }

  return (
    <>
      <p>
        Hello
      </p>
    </>
  )
}
