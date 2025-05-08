document.getElementById("generateBtn").addEventListener("click", async () => {
  const minPage = parseInt(document.getElementById("minPage").value);
  const maxPage = parseInt(document.getElementById("maxPage").value);

  if (isNaN(minPage) || isNaN(maxPage) || minPage > maxPage) {
    alert("Please enter valid page range!");
    return;
  }

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

  // Use regex to match page number
  const pageRegex = /-page-(\d+)-/;
  const match = currentUrl.match(pageRegex);

  if (match) {
    // Replace page number
    const newUrl = currentUrl.replace(pageRegex, `-page-${randomPage}-`);
    window.location.href = newUrl;
  } else {
    alert("Current URL format does not match!");
  }
}
