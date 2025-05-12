// Load saved settings when popup opens
document.addEventListener("DOMContentLoaded", async () => {
  const result = await chrome.storage.local.get(["minPage", "maxPage"]);
  if (result.minPage) {
    document.getElementById("minPage").value = result.minPage;
  }
  if (result.maxPage) {
    document.getElementById("maxPage").value = result.maxPage;
  }
});

document.getElementById("generateBtn").addEventListener("click", async () => {
  const minPage = parseInt(document.getElementById("minPage").value);
  const maxPage = parseInt(document.getElementById("maxPage").value);

  if (isNaN(minPage) || isNaN(maxPage) || minPage > maxPage) {
    alert("Please enter valid page range!");
    return;
  }

  // Save settings
  await chrome.storage.local.set({ minPage, maxPage });

  // Generate random page number
  const randomPage = Math.floor(Math.random() * (maxPage - minPage + 1)) + minPage;

  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Inject script into current page
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: updatePageNumber,
    args: [randomPage],
  });
});

function updatePageNumber(randomPage) {
  const currentUrl = window.location.href;

  // Use regex to match page number in formats: -page-2-, -page-2.html, and albums-index-page-508330.html
  const pageRegex = /(?:-page-|page-)(\d+)(?:-|\.html)/;
  const match = currentUrl.match(pageRegex);

  if (match) {
    // Replace page number while preserving the format
    const newUrl = currentUrl.replace(pageRegex, (fullMatch, pageNum, suffix) => {
      const prefix = fullMatch.startsWith("-") ? "-page-" : "page-";
      return `${prefix}${randomPage}${fullMatch.endsWith(".html") ? ".html" : "-"}`;
    });
    window.location.href = newUrl;
  } else {
    alert("Current URL format does not match!");
  }
}
