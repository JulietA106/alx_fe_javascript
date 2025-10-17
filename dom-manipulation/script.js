// =====================
// Dynamic Quote Generator (Tasks 0–3 Combined)
// =====================

// Quotes array with text and category
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not in what you have, but who you are.", category: "Success" }
];

// Selected category for filtering
let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// =====================
// Task 0: Display Random Quote
// =====================

function showRandomQuote() {
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${randomQuote.text}"</p>
    <p><em>- ${randomQuote.category}</em></p>
  `;

  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// =====================
// Task 1: Add Quote (with createAddQuoteForm)
// =====================

// Function required by checker
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteFormContainer");
  if (!formContainer) return;

  formContainer.innerHTML = `
    <input type="text" id="newQuoteText" placeholder="Enter a new quote" />
    <input type="text" id="newQuoteCategory" placeholder="Enter category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;

  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
}

function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text === "" || category === "") {
    alert("Please fill out both fields!");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);

  saveQuotes();
  populateCategories();
  showRandomQuote();
  postQuoteToServer(newQuote);

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// =====================
// Task 2: Category Filtering
// =====================

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = categories
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join("");

  categoryFilter.value = selectedCategory;
}

function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// =====================
// Task 2: Import / Export
// =====================

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// =====================
// Task 3: Server Sync Simulation
// =====================

async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    quotes = [...serverQuotes, ...quotes];
    saveQuotes();
    populateCategories();
    showRandomQuote();

    alert("Quotes synced with server!");
    document.getElementById("notification").innerText = "Quotes synced with server!";
  } catch (error) {
    console.error("Error syncing with server:", error);
  }
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    const result = await response.json();
    console.log("Quote posted to server:", result);
  } catch (error) {
    console.error("Error posting quote:", error);
  }
}

function syncQuotes() {
  fetchQuotesFromServer();
  setInterval(fetchQuotesFromServer, 30000);
}

// =====================
// Event Listeners & Init
// =====================

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

window.onload = function () {
  populateCategories();
  showRandomQuote();
  createAddQuoteForm(); // Required for Task 0–1
  syncQuotes();
};
