const API_URL = "http://localhost:3000"; 

let tooltip = null;
let selectedText = "";

// Helper to get clean URL (removes hash fragments which are never sent to the server)
function getCleanUrl() {
  return window.location.href.split('#')[0];
}

// Dynamically check if current page is saved at the time of highlighting
async function getSaveIdForCurrentUrl() { 
  try {
    const cleanUrl = getCleanUrl();
    const res = await fetch(
      `${API_URL}/api/saves/exists?url=${encodeURIComponent(cleanUrl)}`,
      { credentials: "include" },
    );
    
    if (res.status === 401) {
      showFeedback("Please sign in to ShellAI", "error");
      return null;
    }

    const data = await res.json();
    if (data.exists) {
      return data.id;
    }
    return null;
  } catch (err) {
    console.error("Failed to check if saved:", err);
    return null;
  }
}

// Create tooltip element 
function createTooltip() {
  const el = document.createElement("div");
  el.id = "memora-highlight-tooltip";
  el.innerHTML = `
    <span class="memora-icon">◈</span>
    <span class="memora-label">Save highlight</span>
  `;
  el.style.cssText = `
    position: fixed !important;
    z-index: 2147483647 !important; /* Max possible z-index to beat website CSS */
    background: #1a1815;
    color: #ede9e3;
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-weight: 500;
    cursor: pointer;
    display: none; /* Hidden by default */
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.1);
    transition: opacity 0.15s ease;
    user-select: none;
    pointer-events: auto;
  `;

  el.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await saveHighlight();
  });

  document.body.appendChild(el);
  return el;
}

// Show tooltip near selection
function showHighlightTooltip(text, x, y) {
  if (!tooltip) tooltip = createTooltip();

  selectedText = text;
  tooltip.style.display = "flex";
  
  // Force browser reflow to ensure display: flex is applied before opacity transition
  void tooltip.offsetWidth; 
  tooltip.style.opacity = "1";

  const tooltipWidth = 140;
  
  // Position above selection, but flip below if too close to top of screen
  const top = y - 50 < 10 ? y + 20 : y - 50;
  const left = Math.min(Math.max(10, x - tooltipWidth / 2), window.innerWidth - tooltipWidth - 10);

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

// Hide tooltip
function hideTooltip() {
  if (tooltip) {
    tooltip.style.opacity = "0";
    setTimeout(() => {
      if (tooltip) tooltip.style.display = "none";
    }, 150);
  }
}

// Save the highlight
async function saveHighlight() {
  if (!selectedText) {
    showFeedback("No text selected", "error");
    hideTooltip();
    return;
  }

  // Show checking state immediately
  if (tooltip) tooltip.innerHTML = `<span>Checking...</span>`;

  // Dynamically fetch the save ID at the time of highlighting
  const currentSaveId = await getSaveIdForCurrentUrl();
  
  if (!currentSaveId) {
    showFeedback("Save this page first in ShellAI", "error");
    hideTooltip();
    return;
  }

  try {
    if (tooltip) tooltip.innerHTML = `<span>Saving...</span>`;

    const res = await fetch(`${API_URL}/api/highlights/${currentSaveId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ highlightedText: selectedText }),
    });

    if (res.status === 401) {
      showFeedback("Sign in to ShellAI first", "error"); 
      resetTooltip();
      return;
    }

    if (!res.ok) throw new Error("Failed");

    showFeedback("Highlight saved ✓", "success"); 
     resetTooltip();
  } catch (err) {
    console.error("Highlight save error:", err);
    showFeedback("Failed to save highlight", "error"); 
    resetTooltip();
  }
}

// Reset tooltip back to original state
function resetTooltip() {
  if (tooltip) {
    tooltip.innerHTML = `
      <span class="memora-icon">◈</span>
      <span class="memora-label">Save highlight</span>
    `;
    hideTooltip();
  }
}

// Feedback toast
function showFeedback(message, type) {
  // Remove existing toasts to prevent stacking
  const existing = document.querySelector(".memora-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "memora-toast";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed !important;
    bottom: 24px;
    right: 24px;
    z-index: 2147483647 !important;
    background: ${type === "success" ? "#1a7a45" : "#c0392b"};
    color: #fff;
    padding: 12px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-weight: 500;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    animation: memora-fade-in 0.2s ease;
  `;

  if (!document.getElementById("memora-styles")) {
    const style = document.createElement("style");
    style.id = "memora-styles";
    style.textContent = `
      @keyframes memora-fade-in {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// Listen for text selection
document.addEventListener("mouseup", (e) => {
  setTimeout(() => {
    const selected = window.getSelection().toString().trim();
    // CHANGED: Lowered from > 10 to > 3 so short selections still trigger it for testing
    if (selected.length > 3) {
      showHighlightTooltip(selected, e.clientX, e.clientY);
    } else {
      hideTooltip();
    }
  }, 10);
});

// Hide tooltip when clicking elsewhere
document.addEventListener("mousedown", (e) => {
  if (tooltip && !tooltip.contains(e.target)) {
    hideTooltip();
  }
});