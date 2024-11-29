
// Example list of tokens (name and contract address)
let tokens = [
    { name: "Dogecoin", address: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43", description: "A popular meme coin." },
    { name: "Shiba Inu", address: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", description: "A dog-themed token." },
    { name: "Floki Inu", address: "0x5b8ed89c0a19ff512cc91c6b95a2b21125e98e34", description: "Inspired by Elon Musk's dog." }
];

// Initialize search history (for testing purpose, using localStorage to persist counts)
const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || {};

// Function to update the search history and save to localStorage
function updateSearchHistory(token) {
    const tokenName = token.name.toLowerCase();
    if (searchHistory[tokenName]) {
        searchHistory[tokenName] += 1;
    } else {
        searchHistory[tokenName] = 1;
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    updateHotTokensList();
}

// Function to update the Hot Tokens list
function updateHotTokensList() {
    const sortedTokens = Object.keys(searchHistory)
        .map(name => ({ name, count: searchHistory[name] }))
        .sort((a, b) => b.count - a.count);  // Sort by search count (descending)

    const hotTokensList = document.getElementById("hotTokensList");
    hotTokensList.innerHTML = '';  // Clear previous list

    sortedTokens.forEach(token => {
        const tokenElement = document.createElement("li");
        tokenElement.textContent = `${token.name} - ${token.count} searches`;
        hotTokensList.appendChild(tokenElement);
    });
}

// Handle search button click
document.getElementById("searchButton").addEventListener("click", () => {
    const searchQuery = document.getElementById("searchInput").value.trim();
    const searchMessage = document.getElementById("searchMessage");
    const tokenInfo = document.getElementById("tokenInfo");
    
    // Clear previous results and message
    searchMessage.textContent = "";
    tokenInfo.style.display = "none";
    
    // If the search query is empty, show an error
    if (searchQuery === "") {
        searchMessage.textContent = "Please enter a token name or contract address to search.";
        return;
    }

    // Search for the token by name or address
    const token = tokens.find(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.address.includes(searchQuery));

    if (token) {
        // Display token information
        document.getElementById("tokenName").textContent = token.name;
        document.getElementById("tokenAddress").textContent = token.address;
        document.getElementById("tokenDescription").textContent = token.description;
        document.getElementById("editButton").style.display = "inline-block"; // Show edit button
        tokenInfo.style.display = "block";

        // Update search history
        updateSearchHistory(token);
    } else {
        searchMessage.textContent = "Token not found. Please check the name or contract address.";
    }
});

// Handle edit button click
document.getElementById("editButton").addEventListener("click", () => {
    const tokenName = document.getElementById("tokenName").textContent;
    const tokenAddress = document.getElementById("tokenAddress").textContent;
    const tokenDescription = document.getElementById("tokenDescription").textContent;

    // Populate the edit form with current values
    document.getElementById("editTokenName").value = tokenName;
    document.getElementById("editTokenAddress").value = tokenAddress;
    document.getElementById("editTokenDescription").value = tokenDescription;

    // Show the edit form
    document.getElementById("editTokenSection").style.display = "block";
});

// Handle save button click
document.getElementById("saveButton").addEventListener("click", () => {
    const newName = document.getElementById("editTokenName").value.trim();
    const newAddress = document.getElementById("editTokenAddress").value.trim();
    const newDescription = document.getElementById("editTokenDescription").value.trim();
    const editMessage = document.getElementById("editMessage");

    // Validate the inputs
    if (!newName || !newAddress || !newDescription) {
        editMessage.textContent = "Please fill in all fields.";
        editMessage.className = "error";
        return;
    }

    // Update the token details
    const tokenIndex = tokens.findIndex(t => t.address === newAddress);
    if (tokenIndex >= 0) {
        tokens[tokenIndex] = { name: newName, address: newAddress, description: newDescription };
        editMessage.textContent = "Token saved successfully!";
        editMessage.className = "message";

        // Hide the edit form and update the displayed token info
        document.getElementById("editTokenSection").style.display = "none";
        document.getElementById("tokenName").textContent = newName;
        document.getElementById("tokenAddress").textContent = newAddress;
        document.getElementById("tokenDescription").textContent = newDescription;
    } else {
        editMessage.textContent = "Token not found.";
        editMessage.className = "error";
    }
});

// Handle add new token button click
document.getElementById("addNewTokenButton").addEventListener("click", () => {
    const newTokenName = document.getElementById("newTokenName").value.trim();
    const newTokenAddress = document.getElementById("newTokenAddress").value.trim();
    const newTokenDescription = document.getElementById("newTokenDescription").value.trim();
    const addNewTokenMessage = document.getElementById("addNewTokenMessage");

    // Validate the inputs
    if (!newTokenName || !newTokenAddress || !newTokenDescription) {
        addNewTokenMessage.textContent = "Please fill in all fields.";
        addNewTokenMessage.className = "error";
        return;
    }

    // Add new token to the list
    tokens.push({ name: newTokenName, address: newTokenAddress, description: newTokenDescription });
    addNewTokenMessage.textContent = "Token added successfully!";
    addNewTokenMessage.className = "message";

    // Reset the form
    document.getElementById("newTokenName").value = '';
    document.getElementById("newTokenAddress").value = '';
    document.getElementById("newTokenDescription").value = '';

    // Optionally, you can update the hot tokens list after adding new token
    updateHotTokensList();
});

// Initialize the Hot Tokens list on page load
updateHotTokensList();

document.getElementById("clearHistoryButton").addEventListener("click", () => {
// clear search history
localStorage.removeItem('searchHistory');

// clear
document.getElementById("hotTokensList").innerHTML = '';

// notice
alert("Search history has been cleared!");
});