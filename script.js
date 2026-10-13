const quotes = [
  {
    descriptor: "Every journal holds real voices, left behind for the next reader to find.",
    text: `"To whomever may be reading this - you are loved, you matter, keep going."`,
    source: "The Human Network, Ann Arbor"
  },
  {
    descriptor: "We place anonymous journals in cafes, camps, and community spaces nationwide.",
    text: `"Everything happens for a reason, my friends! Even when life gets hard, you are exactly where you are supposed to be. There is always a new adventure around the corner. Take control of your life & practice gratitude everyday."`,
    source: "The Human Network, Tucson"
  },
  {
    descriptor: "Anyone can pick one up, read a stranger's story, and leave their own.",
    text: `"Take long deep breaths. Put your feet in the grass. Drink a glass of water. Hug your favorite people."`,
    source: "The Human Network, Chicago"
  },
  {
    descriptor: "Every entry builds a quiet, growing archive of empathy and reflection.",
    text: `"You are loved for who you are and nothing can ever take that away from you."`,
    source: "The Human Network, New York City"
  }
];

let currentQuote = 0;
const quoteInner = document.getElementById('quoteInner');
const quoteDescriptor = document.getElementById('quoteDescriptor');

function renderQuote(index) {
  document.getElementById('quoteText').textContent = quotes[index].text;
  document.getElementById('quoteSource').textContent = `Quote from ${quotes[index].source}`;
  quoteDescriptor.textContent = quotes[index].descriptor;
}

function changeQuote(direction) {
  const outClass = direction === 'left' ? 'slide-out-left' : 'slide-out-right';
  quoteInner.classList.add(outClass);
  quoteDescriptor.classList.add('fade-out');

  setTimeout(() => {
    if (direction === 'left') {
      currentQuote = (currentQuote + 1) % quotes.length;
    } else {
      currentQuote = (currentQuote - 1 + quotes.length) % quotes.length;
    }
    renderQuote(currentQuote);
    quoteInner.classList.remove(outClass);
    quoteDescriptor.classList.remove('fade-out');
  }, 500);
}

document.getElementById('nextQuote').addEventListener('click', () => changeQuote('left'));
document.getElementById('prevQuote').addEventListener('click', () => changeQuote('right'));

renderQuote(currentQuote);
