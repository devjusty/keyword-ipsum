import { BookOpen } from "lucide-react";
import Generator from "./components/Generator";

function App() {
  return (
    <>
      <div className="container mx-auto">
        <div className="navbar justify-center">
          <BookOpen
            className="w-10 h-10"
            alt="Keyword Ipsum"
            title="Keyword Ipsum"
          />
          <h1 className="p-1 text-lg tracking-wider">Keyword Ipsum</h1>
        </div>

        <div className="text-md text-primary-content/80 md:w-1/2 mx-auto mb-4 sm:w-auto">
          <p>
            Use this Lorem Ipsum Generator to generate custom text with your own
            keywords.
          </p>
          <p>
            Enter your list of keywords and text length to generate unique Lorem
            Ipsum text for your project or design.
          </p>
        </div>
        <Generator />
      </div>
    </>
  );
}

export default App;
