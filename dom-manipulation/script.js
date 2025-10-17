// Global quotes array
let quotes = [];

// Load quotes from local storage or set defaults
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
} else {
  quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Do what you can, with what you have, where you are.", category: "Motivation" }
  ];
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Load last selected category filter
let lastCategory = localStorage.getItem("lastCategoryFilter") || "all";

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate category dropdown dynamically
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  // Remove old options except "All Categories"
  select.innerHTML = '<option value="all">All Categories</option>';

  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  // Restore last selected category
  select.value = lastCategory;
}

// Display a random quote, considering the current category filter
function displayRandomQuote() {
  let filteredQuotes = quotes;
  const category = document.getElementById("categoryFilter").value;
  if (category && category !== "all") {
    filteredQuotes = quotes.filter(q => q.category === category);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").textContent = "No quotes in this category.";
    return;
  }

  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  document.getElementById("quoteDisplay").textContent = quote.text + " — [" + quote.category + "]";

  // Optional: store last viewed quote in session storage
  sessionStorage.setItem("lastQuoteIndex", quotes.indexOf(quote));
}

// Add a new quote
function addQuote() {
  let text = document.getElementById("newQuoteText").value.trim();
  let category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    populateCategories(); // Update categories dropdown
    displayRandomQuote();
  }
}

// Filter quotes based on selected category
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategoryFilter", category);
  displayRandomQuote();
}

// Export quotes to JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
        displayRandomQuote();
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

// Initialize categories and display quote
populateCategories();
displayRandomQuote();

// Optional: restore last viewed quote from session storage
if (sessionStorage.getItem("lastQuoteIndex")) {
  const lastIndex = parseInt(sessionStorage.getItem("lastQuoteIndex"));
  if (quotes[lastIndex]) {
    document.getElementById("quoteDisplay").textContent = quotes[lastIndex].text + " — [" + quotes[lastIndex].category + "]";
  }
}
