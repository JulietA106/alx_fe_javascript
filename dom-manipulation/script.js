// Global quotes array with objects containing text and category properties
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do what you can, with what you have, where you are.", category: "Motivation" }
];

// Function to display a random quote
function displayRandomQuote() {
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
    displayRandomQuote();
  }
}

// Function to create the add quote form
function createAddQuoteForm() {
  // This function creates the form elements for adding quotes
  const formContainer = document.createElement('div');
  
  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.id = 'newQuoteText';
  textInput.placeholder = 'Enter quote text';
  
  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter category';
  
  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);
  
  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
  
  document.body.appendChild(formContainer);
}

// Event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

// Initialize the application
displayRandomQuote();
createAddQuoteForm();