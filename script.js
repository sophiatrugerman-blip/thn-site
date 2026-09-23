const quotes = [
  {
    text: `"To whomever may be reading this - you are loved, you matter, keep going."`,
    source: "The Human Network, Ann Arbor"
  }
  // add more quote objects here — I'll drop them in once you send the rest
];

let currentQuote = 0;

function renderQuote(index) {
  document.getElementById('quoteText').textContent = quotes[index].text;
  document.getElementById('quoteSource').textContent = `Quote from ${quotes[index].source}`;
}

document.getElementById('prevQuote').addEventListener('click', () => {
  currentQuote = (currentQuote - 1 + quotes.length) % quotes.length;
  renderQuote(currentQuote);
});

document.getElementById('nextQuote').addEventListener('click', () => {
  currentQuote = (currentQuote + 1) % quotes.length;
  renderQuote(currentQuote);
});

renderQuote(currentQuote); // show first quote on load
