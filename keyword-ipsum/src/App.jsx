import bookLogo from "/bx-book-open.svg";
import "./App.css";
import Generator from './components/Generator';

function App() {

  return (
    <>
      <div className="container mx-auto">
        <img src={bookLogo} className="logo mx-auto" alt="Vite logo" />
        <h1 className='py-2'>Keyword Ipsum</h1>
        <p className='text-lg lg:w-2/3 mx-auto sm:w-auto'>
          Use this Lorem Ipsum Generator to generate custom text with your own
          keywords. Enter your list of keywords and sentence length, and
          generate unique Lorem Ipsum text for your project or design. Perfect
          for filling in placeholder text and visualizing design layouts. Try it
          now!
        </p>
        <Generator />
      </div>
    </>
  );
}

export default App;
