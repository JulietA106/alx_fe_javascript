// Array of quotes with categories
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do what you can, with what you have, where you are.", category: "Motivation" }
];

// Function to display a random quote
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.textContent = `${quotes[randomIndex].text} — [${quotes[randomIndex].category}]`;
}

// Function to add a new quote dynamically
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText && quoteCategory) {
    quotes.push({ text: quoteText, category: quoteCategory });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    displayRandomQuote(); // Show the newly added quote immediately
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

// Display a random quote when the page loads
displayRandomQuote();
