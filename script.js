const keywordElement = document.getElementById("keywords");
const lengthElement = document.getElementById("length");
const formElement = document.getElementById("form");
const ipsumElement = document.getElementById("ipsum");
const outputElement = document.getElementById("output");

function generateIpsum(keywords, length) {
  const paragraphCount = length;
  // Define an array of Lorem Ipsum words
  const loremIpsumWords = [
    "Lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
    "Ut",
    "enim",
    "ad",
    "minim",
    "veniam",
    "quis",
    "nostrud",
    "exercitation",
    "ullamco",
    "laboris",
    "nisi",
    "ut",
    "aliquip",
    "ex",
    "ea",
    "commodo",
    "consequat",
    "Duis",
    "aute",
    "irure",
    "dolor",
    "in",
    "reprehenderit",
    "in",
    "voluptate",
    "velit",
    "esse",
    "cillum",
    "dolore",
    "eu",
    "fugiat",
    "nulla",
    "pariatur",
    "Excepteur",
    "sint",
    "occaecat",
    "cupidatat",
    "non",
    "proident",
    "sunt",
    "in",
    "culpa",
    "qui",
    "officia",
    "deserunt",
    "mollit",
    "anim",
    "id",
    "est",
    "laborum",
  ];

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generate a random sentence using the keywords
  const randomSentence = () => {
    const sentence = [];
    let wordCount = getRandomInt(3, 15);
    for (let i = 0; i < wordCount; i++) {
      if (Math.random() > 0.7 && keywords.length > 0) {
        sentence.push(keywords[Math.floor(Math.random() * keywords.length)]);
      } else {
        sentence.push(
          loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)]
        );
      }
    }
    // Capitalize the first letter of the first word in the sentence
    const capitalizedSentence =
      sentence.join(" ").charAt(0).toUpperCase() + sentence.join(" ").slice(1);
    return capitalizedSentence + ".";
  };

  // Generate a random paragraph using the random sentence generator
  const getRandomParagraph = () => {
    const paragraph = [];
    let sentenceCount = getRandomInt(1, 7);
    for (let i = 0; i < sentenceCount; i++) {
      paragraph.push(randomSentence(sentenceCount));
    }
    return paragraph.join(" ");
  };

  // Generate the final Lorem Ipsum text using the random paragraph generator
  const generateLoremIpsumText = () => {
    const text = [];
    for (let i = 0; i < paragraphCount; i++) {
      text.push(getRandomParagraph());
    }
    return text.join("\n\n");
  };
  // Return the final Lorem Ipsum text
  return generateLoremIpsumText();
}

formElement.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(keywordElement.value);
const keywords = keywordElement.value.split(/[,\s]+/);
  const length = lengthElement.value;
  console.log(keywords);
  if (!keywords.value || isNaN(length) || length <= 0) {
    outputElement.innerText = "enter some keywords and a valid number";
    ipsumElement.innerText = "";
  } else {
    outputElement.innerText = "";
    ipsumElement.innerText = generateIpsum(keywords, length);
  }
});

const copyButtonEl = document.getElementById("copy");

copyButtonEl.addEventListener("click", () => {
  navigator.clipboard.writeText(ipsumElement.value).then(
    () => {
      outputElement.innerText = "copied to clipboard";
      console.log("copied to clipboard");
    },
    () => {
      outputElement.innerText = "unable to copy for some reason";
      console.log("not copied to clipboard");
    }
  );
});
