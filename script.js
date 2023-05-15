const keywordEl = document.getElementById('keywords');
const lengthEl = document.getElementById('length');
const formEl = document.getElementById('form');
const ipsumEl = document.getElementById('ipsum');

let keywords = keywordEl.value

function loremIpsumGenerator(keywords, length) {
  const paragraphCount = length;
  const words = [
    "lorem",
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
    "aliqua"
  ];
  const sentences = [
    "Lorem ipsum dolor sit amet.",
    "Consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam.",
    "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident.",
    "Sunt in culpa qui officia deserunt mollit anim id est laborum."
  ];
  let paragraphs = "";
  for (let i = 0; i < paragraphCount; i++) {
    let sentenceCount = Math.floor(Math.random() * 5) + 1;
    let paragraph = "";
    for (let j = 0; j < sentenceCount; j++) {
      let sentence = sentences[Math.floor(Math.random() * sentences.length)];
      let wordsCount = Math.floor(Math.random() * (length / sentenceCount)) + 1;
      let sentenceWords = [];
      for (let k = 0; k < wordsCount; k++) {
        let word = words[Math.floor(Math.random() * words.length)];
        if (k === 0) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        sentenceWords.push(word);
      }
      sentence += " " + sentenceWords.join(" ");
      paragraph += sentence + " ";
    }
    paragraphs += "<p>" + paragraph + "</p>";
  }
  return paragraphs;
}


formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const keywords = keywordEl.value.split(', ');
  console.log(`keywords: ${keywords}`);
  const length = lengthEl.value
  console.log(`length: ${length}`);

  console.log(ipsumEl);

  ipsumEl.value = loremIpsumGenerator(keywords, length)

})

const copyButtonEl = document.getElementById('copy')

copyButtonEl.addEventListener('click', () =>{

  navigator.clipboard.writeText(ipsumEl.value)
    .then(() => {
      console.log('copied to clipboard')
    },
    () => {
      console.log('not copied to clipboard')
    })

})


// copyButtonEl.onclick(() => {

//     navigator.clipboard.writeText(this.ipsumEl.value)
//     .then(() => {
//       this.copiedCode.innerHTML = '<div class="alert">Copied to clipboard \u{1F44D}</div>'
//     }, () => {
//       this.copiedCode.innerHTML = '<div class="alert">\u{1F494} Not Supported</div>'
//     }), setTimeout(() => {
//       this.copiedCode.innerHTML = ""
//     }, 2e3)

// })