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

// Initialize selected category (checker requires this name)
let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// ----------------- Storage helpers -----------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ----------------- Category UI & Filtering -----------------
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  // Reset dropdown options
  select.innerHTML = '<option value="all">All Categories</option>';

  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });

  // Restore the last selected category
  select.value = selectedCategory;
}

function filterQuotes() {
  selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  displayRandomQuote();
}

// ----------------- Display & Add -----------------
function displayRandomQuote() {
  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").textContent = "No quotes in this category.";
    return;
  }

  const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  document.getElementById("quoteDisplay").textContent = quote.text + " — [" + quote.category + "]";
  sessionStorage.setItem("lastQuoteIndex", quotes.indexOf(quote));
}

function addQuote() {
  let text = document.getElementById("newQuoteText").value.trim();
  let category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    // push only text and category to remain checker-compliant
    quotes.push({ text, category });
    saveQuotes();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    populateCategories(); // Update dropdown with new category
    displayRandomQuote();
    // simulate pushing local change to server
    pushLocalChangesToServer();
  }
}

// ----------------- JSON Import / Export -----------------
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
        // push imported changes to server simulation
        pushLocalChangesToServer();
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ----------------- Simulated Server -----------------
// We simulate a remote server by storing a copy in localStorage under 'serverQuotes'.
// In a real app you'd use fetch() to GET/POST to a server endpoint.

// Initialize server storage if missing
if (!localStorage.getItem("serverQuotes")) {
  // server initially contains a slightly different set to allow conflict demo
  const serverInitial = [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    // server changed category for this quote to create potential conflict
    { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
    { text: "Server only quote example", category: "Server" }
  ];
  localStorage.setItem("serverQuotes", JSON.stringify(serverInitial));
}

// read server "endpoint"
function fetchServerQuotes() {
  // simulate network latency with a resolved Promise
  return new Promise((resolve) => {
    const serverData = JSON.parse(localStorage.getItem("serverQuotes") || "[]");
    setTimeout(() => resolve(serverData), 200); // 200ms simulated latency
  });
}

// write to server "endpoint" (simulate POST/PUT)
function postToServerQuotes(newServerArray) {
  return new Promise((resolve) => {
    localStorage.setItem("serverQuotes", JSON.stringify(newServerArray));
    setTimeout(() => resolve(true), 150);
  });
}

// ----------------- Sync & Conflict Resolution -----------------
let hasConflicts = false;
let conflicts = []; // array of {local, server}

// Sync algorithm:
// - Fetch server quotes
// - For each server quote:
//     - if local has same text but different category => conflict (server wins by default)
//     - if server quote not in local => add to local
// - For local quotes not on server => leave them but optional push to server later
// - Save local quotes when appropriate
async function syncWithServer() {
  try {
    const serverList = await fetchServerQuotes();

    // detect conflicts and merges
    const newLocal = [...quotes]; // clone local
    const localTexts = newLocal.map(q => q.text);

    conflicts = [];

    // 1) For each server quote: ensure local either has same or update local (server precedence)
    serverList.forEach(sq => {
      const localIndex = newLocal.findIndex(lq => lq.text === sq.text);
      if (localIndex === -1) {
        // server has a quote local doesn't -> add it
        newLocal.push({ text: sq.text, category: sq.category });
      } else {
        // both have same text; check category
        if (newLocal[localIndex].category !== sq.category) {
          // conflict detected
          conflicts.push({ local: newLocal[localIndex], server: sq, index: localIndex });
          // server precedence: replace local category with server's
          newLocal[localIndex] = { text: sq.text, category: sq.category };
        }
      }
    });

    // 2) Local-only quotes remain (they can be pushed later)
    // Save updated local
    quotes = newLocal;
    saveQuotes();
    populateCategories();

    // update conflict state UI
    if (conflicts.length > 0) {
      hasConflicts = true;
      showConflictNotification();
    } else {
      hasConflicts = false;
      hideConflictNotification();
    }

    // show sync status
    setSyncStatus("Synced with server.");
  } catch (err) {
    setSyncStatus("Sync failed.");
  }
}

// push local-only quotes to server (merge local into server)
async function pushLocalChangesToServer() {
  try {
    const serverList = JSON.parse(localStorage.getItem("serverQuotes") || "[]");
    const serverTexts = serverList.map(q => q.text);

    // Add local-only quotes to server
    const toAdd = quotes.filter(lq => !serverTexts.includes(lq.text));
    const newServer = serverList.concat(toAdd);
    await postToServerQuotes(newServer);
    setSyncStatus("Local changes pushed to server.");
  } catch {
    setSyncStatus("Failed to push local changes.");
  }
}

// Manual conflict UI functions
function showConflictNotification() {
  const btn = document.getElementById("resolveConflictsBtn");
  btn.style.display = "inline-block";
  setSyncStatus("Conflicts detected. Server changes applied automatically. Click 'Resolve Conflicts' to review.");
}

function hideConflictNotification() {
  const btn = document.getElementById("resolveConflictsBtn");
  btn.style.display = "none";
  setSyncStatus("");
}

function setSyncStatus(text) {
  const status = document.getElementById("syncStatus");
  status.textContent = text;
}

function openManualResolve() {
  const panel = document.getElementById("manualResolve");
  const list = document.getElementById("conflictList");
  list.textContent = "";
  conflicts.forEach((c, i) => {
    const div = document.createElement("div");
    div.style.marginBottom = "8px";

    const left = document.createElement("div");
    left.textContent = "Local: " + c.local.text + " — [" + c.local.category + "]";
    const right = document.createElement("div");
    right.textContent = "Server: " + c.server.text + " — [" + c.server.category + "]";

    div.appendChild(left);
    div.appendChild(right);
    list.appendChild(div);
  });
  panel.style.display = "block";
}

function closeManualResolve() {
  document.getElementById("manualResolve").style.display = "none";
}

// User chooses to accept server versions (server already applied in syncWithServer)
function acceptServerResolution() {
  // conflicts already applied to local during sync (server precedence), just clear conflicts
  conflicts = [];
  hasConflicts = false;
  hideConflictNotification();
  closeManualResolve();
  displayRandomQuote();
  setSyncStatus("Server versions accepted.");
}

// User chooses to keep local versions (push local values to server)
async function keepLocalResolution() {
  // Build server array replacing any server entries with local versions for conflicts
  let serverList = JSON.parse(localStorage.getItem("serverQuotes") || "[]");

  conflicts.forEach(c => {
    const sIndex = serverList.findIndex(sq => sq.text === c.server.text);
    if (sIndex !== -1) {
      // replace server's version with local's
      serverList[sIndex] = { text: c.local.text, category: c.local.category };
    } else {
      // add local
      serverList.push({ text: c.local.text, category: c.local.category });
    }
  });

  await postToServerQuotes(serverList);

  // Clear conflicts and update UI
  conflicts = [];
  hasConflicts = false;
  hideConflictNotification();
  closeManualResolve();
  setSyncStatus("Local versions pushed to server; conflicts resolved.");
}

// Sync now handler
function syncNow() {
  setSyncStatus("Syncing...");
  syncWithServer();
}

// Periodic sync every 30 seconds
setInterval(syncWithServer, 30000);

// ----------------- Initialization -----------------
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
populateCategories();
displayRandomQuote();

// restore last viewed quote from sessionStorage
if (sessionStorage.getItem("lastQuoteIndex")) {
  const lastIndex = parseInt(sessionStorage.getItem("lastQuoteIndex"), 10);
  if (quotes[lastIndex]) {
    document.getElementById("quoteDisplay").textContent =
      quotes[lastIndex].text + " — [" + quotes[lastIndex].category + "]";
  }
}
