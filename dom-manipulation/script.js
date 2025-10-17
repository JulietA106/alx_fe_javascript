let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to display quotes
function displayQuotes() {
  const quoteList = document.getElementById('quoteList');
  quoteList.innerHTML = quotes
    .map((quote) => `<li>${quote.text} - <em>${quote.category}</em></li>`)
    .join('');
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to fetch quotes from mock server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();

    // Convert server data to quote objects (simulate server response)
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: 'Server'
    }));

    // Conflict resolution: server data takes precedence
    const localTexts = quotes.map(q => q.text);
    const newQuotes = serverQuotes.filter(q => !localTexts.includes(q.text));

    if (newQuotes.length > 0) {
      quotes.push(...newQuotes);
      saveQuotes();
      displayQuotes();
      showNotification('New quotes synced from server!');
    }
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
  }
}

// Function to post new quote to server (simulated)
async function postQuoteToServer(quote) {
  try {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote),
    });
    console.log('Quote synced to server:', quote);
  } catch (error) {
    console.error('Error posting quote:', error);
  }
}

// Function to sync local and server quotes periodically
function syncQuotes() {
  fetchQuotesFromServer();
  setInterval(fetchQuotesFromServer, 30000); // Every 30 seconds
}

// Add new quote
function addQuote() {
  const text = document.getElementById('quoteText').value.trim();
  const category = document.getElementById('quoteCategory').value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    displayQuotes();
    postQuoteToServer(newQuote);
  }
}

// Show notification for updates
function showNotification(message) {
  const notif = document.getElementById('notification');
  notif.textContent = message;
  notif.style.display = 'block';
  setTimeout(() => (notif.style.display = 'none'), 3000);
}

// Initialize app
window.onload = function () {
  displayQuotes();
  syncQuotes();
};
