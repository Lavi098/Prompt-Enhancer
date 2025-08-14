alert("Prompt Improver content script loaded!");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SHOW_LOADING_POPUP") {
    showLoadingPopup();
  }
  if (message.type === "SHOW_IMPROVED_PROMPT") {
    removeLoadingPopup();
    const { originalPrompt, improvedPrompt } = message;
    showImprovedPromptPopup(originalPrompt, improvedPrompt);
  }
});

function showLoadingPopup() {
  removeLoadingPopup();
  const popup = document.createElement("div");
  popup.id = "ai-loading-popup";
  popup.textContent = "🔄 Improving your prompt...";
  popup.style = `
    position: fixed;
    top: 32px;
    right: 32px;
    width: 340px;
    background: #23232b;
    color: #fff;
    border-radius: 14px;
    padding: 20px 24px;
    font-family: 'Segoe UI', 'Arial', sans-serif;
    font-size: 16px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.45);
    z-index: 99999;
    display: flex;
    align-items: center;
    gap: 10px;
  `;
  document.body.appendChild(popup);
}

function removeLoadingPopup() {
  const popup = document.getElementById("ai-loading-popup");
  if (popup) popup.remove();
}

function showImprovedPromptPopup(original, improved) {
  const existing = document.getElementById("ai-popup");
  if (existing) existing.remove();

  const safeImproved = improved && improved.trim() ? improved : "❌ No improved prompt received.";
  const isError = safeImproved.startsWith("❌");
  const popup = document.createElement("div");
  popup.id = "ai-popup";
  popup.style = `
    position: fixed;
    top: 32px;
    right: 32px;
    width: 370px;
    z-index: 99999;
    background: ${isError ? "#d63031" : "rgba(28, 28, 30, 0.97)"};
    color: #f1f2f6;
    border-radius: 16px;
    padding: 22px 24px;
    font-family: 'Segoe UI', 'Arial', sans-serif;
    box-shadow: 0 8px 30px rgba(0,0,0,0.45);
    backdrop-filter: blur(8px);
    transition: box-shadow 0.3s;
  `;

  const escaped = safeImproved
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  popup.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 14px; font-size: 17px; letter-spacing: 0.2px;">✨ Improved Prompt</div>
    <pre style="white-space: pre-wrap; margin-bottom: 18px; font-size: 15px; line-height: 1.6; background: rgba(44,44,54,0.13); border-radius: 8px; padding: 10px;">${escaped}</pre>
    <div style="display: flex; gap: 10px; justify-content: flex-end;">
      ${isError
        ? `<button id="ai-cancel" style="${btnStyle('#d63031')}">Close</button>`
        : `
          <button id="ai-accept" style="${btnStyle('#00b894')}">Accept</button>
          <button id="ai-another" style="${btnStyle('#0984e3')}">Suggest Another</button>
          <button id="ai-cancel" style="${btnStyle('#d63031')}">Cancel</button>
        `
      }
    </div>
  `;

  document.body.appendChild(popup);

  if (!isError) {
    document.getElementById("ai-accept").onclick = () => {
      replaceSelectedText(safeImproved);
      popup.remove();
    };

    document.getElementById("ai-another").onclick = () => {
      document.getElementById("ai-another").textContent = "🔄 Improving...";
      document.getElementById("ai-another").disabled = true;
      chrome.runtime.sendMessage({
        type: "REQUEST_ANOTHER_IMPROVEMENT",
        prompt: original,
      });
      popup.remove();
    };
  }

  document.getElementById("ai-cancel").onclick = () => popup.remove();
}

function replaceSelectedText(newText) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const node = range.startContainer;

  if (node.nodeType === Node.TEXT_NODE) {
    range.deleteContents();
    range.insertNode(document.createTextNode(newText));
  } else if (
    node.nodeType === Node.ELEMENT_NODE &&
    node.isContentEditable
  ) {
    document.execCommand("insertText", false, newText);
  } else if (
    node.nodeType === Node.ELEMENT_NODE &&
    ["INPUT", "TEXTAREA"].includes(node.tagName)
  ) {
    node.value = newText;
  } else {
    alert("❗ Cannot replace selected text in this context.");
  }
}

function btnStyle(color) {
  return `
    padding: 7px 16px;
    background: ${color};
    border: none;
    color: white;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    font-size: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
    transition: background 0.2s;
  `;
}