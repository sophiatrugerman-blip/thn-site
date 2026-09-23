const quotes = [
  {
    text: `"To whomever may be reading this - you are loved, you matter, keep going."`,
    source: "The Human Network, Ann Arbor"
  },
  {
    text: `"Everything happens for a reason, my friends! Even when life gets hard, you are exactly where you are supposed to be. There is always a new adventure around the corner. Take control of your life & practice gratitude everyday."`,
    source: "The Human Network, Tucson"
  },
  {
    text: `"Take long deep breaths. Put your feet in the grass. Drink a glass of water. Hug your favorite people."`,
    source: "The Human Network, Chicago"
  },
  {
    text: `"You are loved for who you are and nothing can ever take that away from you."`,
    source: "The Human Network, New York City"
  }
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
