// Global quotes array with objects containing text and category properties
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do what you can, with what you have, where you are.", category: "Motivation" }
];

// Function to display a random quote - renamed to showRandomQuote
function showRandomQuote() {
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let selectedQuote = quotes[randomIndex];
  let quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = selectedQuote.text + " — [" + selectedQuote.category + "]";
}

// Function to add a new quote to the array and update the DOM
function addQuote() {
  let quoteText = document.getElementById("newQuoteText").value.trim();
  let quoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
  if (quoteText !== "" && quoteCategory !== "") {
    let newQuote = { text: quoteText, category: quoteCategory };
    quotes.push(newQuote);
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    showRandomQuote();
  }
}

// Function to create the add quote form
function createAddQuoteForm() {
  let formContainer = document.createElement("div");
  
  let textInput = document.createElement("input");
  textInput.setAttribute("type", "text");
  textInput.setAttribute("id", "newQuoteText");
  textInput.setAttribute("placeholder", "Enter quote text");
  
  let categoryInput = document.createElement("input");
  categoryInput.setAttribute("type", "text");
  categoryInput.setAttribute("id", "newQuoteCategory");
  categoryInput.setAttribute("placeholder", "Enter category");
  
  let addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);
  
  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
  
  document.body.appendChild(formContainer);
}

// Event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialize
showRandomQuote();
createAddQuoteForm();