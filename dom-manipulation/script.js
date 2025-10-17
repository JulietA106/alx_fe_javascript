// Global quotes array with objects containing text and category properties
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do what you can, with what you have, where you are.", category: "Motivation" }
];

// Function to display a random quote - renamed to showRandomQuote
function showRandomQuote() {
  let index = Math.floor(Math.random() * quotes.length);
  let display = document.getElementById("quoteDisplay");
  display.textContent = quotes[index].text + " — [" + quotes[index].category + "]";
}

// Function to add a new quote to the array and update the DOM
function addQuote() {
  let text = document.getElementById("newQuoteText").value.trim();
  let category = document.getElementById("newQuoteCategory").value.trim();

  if (text !== "" && category !== "") {
    quotes.push({ text: text, category: category });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    showRandomQuote();
  }
}

// Event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Display a random quote on page load
showRandomQuote();