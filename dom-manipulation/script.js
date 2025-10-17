// Array of quotes with text and category
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do what you can, with what you have, where you are.", category: "Motivation" }
];

// Function to display a random quote
function displayRandomQuote() {
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.textContent = quotes[randomIndex].text + " — [" + quotes[randomIndex].category + "]";
}

// Function to add a new quote
function addQuote() {
  let quoteText = document.getElementById("newQuoteText").value.trim();
  let quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText !== "" && quoteCategory !== "") {
    quotes.push({ text: quoteText, category: quoteCategory });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    displayRandomQuote();
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

// Display a random quote when page loads
displayRandomQuote();
