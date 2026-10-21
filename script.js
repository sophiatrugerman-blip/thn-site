const quotes = [
  {
    text: `"To whomever may be reading this - you are loved, you matter, keep going."`,
    city: "Ann Arbor"
  },
  {
    text: `"Everything happens for a reason, my friends! Even when life gets hard, you are exactly where you are supposed to be. There is always a new adventure around the corner. Take control of your life & practice gratitude everyday."`,
    city: "Tucson"
  },
  {
    text: `"Take long deep breaths. Put your feet in the grass. Drink a glass of water. Hug your favorite people."`,
    city: "Chicago"
  },
  {
    text: `"You are loved for who you are and nothing can ever take that away from you."`,
    city: "New York City"
  }
];

let current = 0;
let busy = false;

const inner = document.getElementById('quoteInner');
const labelEl = document.getElementById('quoteLabel');
const textEl = document.getElementById('quoteText');
const dotsEl = document.getElementById('quoteDots');

quotes.forEach((q, i) => {
  const dot = document.createElement('button');
  dot.className = 'quote-dot';
  dot.setAttribute('aria-label', 'Show quote ' + (i + 1));
  dot.addEventListener('click', () => go(i));
  dotsEl.appendChild(dot);
});

function render(i) {
  labelEl.textContent = 'Page from a journal in ' + quotes[i].city;
  textEl.textContent = quotes[i].text;
  Array.from(dotsEl.children).forEach((d, n) => d.classList.toggle('active', n === i));
}

function go(next) {
  if (busy || next === current) return;
  busy = true;
  const outClass = next > current ? 'slide-out-left' : 'slide-out-right';
  inner.classList.add(outClass);
  setTimeout(() => {
    current = next;
    render(current);
    inner.classList.remove(outClass);
    busy = false;
  }, 400);
}

document.getElementById('nextQuote').addEventListener('click', () => go((current + 1) % quotes.length));
document.getElementById('prevQuote').addEventListener('click', () => go((current - 1 + quotes.length) % quotes.length));

render(current);
