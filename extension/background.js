const API_URL = "http://localhost:3000";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CHECK_SAVED") {
    checkSaved(message.url)
      .then(sendResponse)
      .catch((error) => {
        console.error("CHECK_SAVED error:", error);

        sendResponse({
          ok: false,
          error: error.message,
        });
      });

    return true;
  }

  if (message.type === "SAVE_HIGHLIGHT") {
    saveHighlight(message.saveId, message.highlightedText)
      .then(sendResponse)
      .catch((error) => {
        console.error("SAVE_HIGHLIGHT error:", error);

        sendResponse({
          ok: false,
          error: error.message,
        });
      });

    return true;
  }
});

async function checkSaved(url) {
  console.log("Checking saved URL:", url);

  const response = await fetch(
    `${API_URL}/api/saves/exists?url=${encodeURIComponent(url)}`,
    {
      credentials: "include",
    },
  );

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Invalid server response: ${text}`);
  }

  console.log("CHECK_SAVED response:", response.status, data);

  return {
    ok: response.ok,
    status: response.status,
    exists: data.exists === true,
    id: data.id || null,
    savedAgo: data.savedAgo || null,
    data,
  };
}

async function saveHighlight(saveId, highlightedText) {
  console.log("Saving highlight:", {
    saveId,
    highlightedText,
  });

  if (!saveId) {
    return {
      ok: false,
      status: 400,
      error: "Missing save ID",
    };
  }

  const response = await fetch(
    `${API_URL}/api/highlights/${saveId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        highlightedText,
      }),
    },
  );

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = {
      message: text,
    };
  }

  console.log("SAVE_HIGHLIGHT response:", response.status, data);

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}