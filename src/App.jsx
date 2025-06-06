import "./App.css";
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

        <p className="text-lg lg:w-1/3 mx-auto mt-8 sm:w-auto">
          Use this Lorem Ipsum Generator to generate custom text with your own
          keywords. Enter your list of keywords and sentence length, and
          generate unique Lorem Ipsum text for your project or design.
        </p>
        <Generator />
      </div>
    </>
  );
}

export default App;
