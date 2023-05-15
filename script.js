const keywordEl = document.getElementById('keywords');
const lengthEl = document.getElementById('length');
const formEl = document.getElementById('form');
const ipsumEl = document.getElementById('ipsum');

let keywords = keywordEl.value

function loremIpsumGenerator(keywords, length) {
  // Define an array of Lorem Ipsum words
  const loremIpsumWords = [
    "Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "Ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
    "commodo", "consequat", "Duis", "aute", "irure", "dolor", "in", "reprehenderit",
    "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
    "pariatur", "Excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
    "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id",
    "est", "laborum"
  ];

  // Generate a random sentence using the keywords
  // const randomSentence = () => {
  //   const sentence = [];
  //   for (let i = 0; i < length; i++) {
  //     if (Math.random() > 0.7 && keywords.length > 0) {
  //       sentence.push(keywords[Math.floor(Math.random() * keywords.length)]);
  //     } else {
  //       sentence.push(loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)]);
  //     }
  //   }
  //   return sentence.join(" ") + ".";
  // };

    // Generate a random sentence using the keywords
    const randomSentence = () => {
      const sentence = [];
      for (let i = 0; i < length; i++) {
        if (Math.random() > 0.7 && keywords.length > 0) {
          sentence.push(keywords[Math.floor(Math.random() * keywords.length)]);
        } else {
          sentence.push(loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)]);
        }
      }
      // Capitalize the first letter of the first word in the sentence
      const capitalizedSentence = sentence.join(" ").charAt(0).toUpperCase() + sentence.join(" ").slice(1);
      return capitalizedSentence + ".";
    };

  // Generate a random paragraph using the random sentence generator
  const randomParagraph = () => {
    const paragraph = [];
    for (let i = 0; i < 5; i++) {
      paragraph.push(randomSentence());
    }
    return paragraph.join(" ");
  };

  // Generate the final Lorem Ipsum text using the random paragraph generator
  const loremIpsumText = () => {
    const text = [];
    for (let i = 0; i < 5; i++) {
      text.push(randomParagraph());
    }
    return text.join("\n\n");
  };

  // Return the final Lorem Ipsum text
  // console.log(loremIpsumText());
  return loremIpsumText();
}

// Example usage
console.log(loremIpsumGenerator(keywords, 10));

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