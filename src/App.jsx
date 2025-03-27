import bookLogo from "./assets/bx-book-open.svg";
import "./App.css";
import Generator from "./components/Generator";

function App() {
  return (
    <>
      <div className="container mx-auto">
        <div className="navbar">
          <img src={bookLogo} className="navbar-start w-16 h-16" alt="Keyword Ipsum logo" />
          <div className="flex-none">
            <h1 className="p-1 text-xl text-center">Keyword Ipsum</h1>
          </div>
        </div>

        <p className="text-lg lg:w-2/3 mx-auto sm:w-auto">
          Use this Lorem Ipsum Generator to generate custom text with your own keywords. Enter your list of keywords and
          sentence length, and generate unique Lorem Ipsum text for your project or design.
        </p>
        <Generator />
      </div>
    </>
  );
}

export default App;
