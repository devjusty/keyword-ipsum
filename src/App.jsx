import { ReaderIcon as BookOpenIcon } from "@radix-ui/react-icons";
import Generator from "./components/Generator";

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="app-brand-mark" aria-hidden="true">
          <BookOpenIcon width="22" height="22" />
        </div>
        <div>
          <p className="app-kicker">Placeholder copy tool</p>
          <h1>Keyword Ipsum</h1>
        </div>
      </header>

      <section className="app-intro" aria-labelledby="intro-heading">
        <h2 id="intro-heading" className="sr-only">
          Keyword text generator
        </h2>
        <p>Create placeholder copy shaped by your keywords.</p>
      </section>

      <section className="workbench" aria-label="Lorem Ipsum generator">
        <Generator />
      </section>
    </main>
  );
}

export default App;
