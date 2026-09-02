import { ReaderIcon as BookOpenIcon } from "@radix-ui/react-icons";
import Generator from "./components/Generator";

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <BookOpenIcon aria-hidden="true" width="24" height="24" />
        <h1>Keyword Ipsum</h1>
      </header>

      <section className="app-intro" aria-labelledby="intro-heading">
        <h2 id="intro-heading" className="sr-only">
          Keyword text generator
        </h2>
        <p>
          Enter keywords to shape custom Lorem Ipsum, then choose your length
          and review the generated text.
        </p>
      </section>

      <section className="workbench" aria-label="Ipsum generator">
        <Generator />
      </section>
    </main>
  );
}

export default App;
