chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "improve-prompt",
    title: "Improve with Extension",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "improve-prompt") {
    const selectedText = info.selectionText;

    // Tell content script to show loading popup
    chrome.tabs.sendMessage(tab.id, { type: "SHOW_LOADING_POPUP" }, () => {
      // Ignore response, just ensure message is sent
    });

    try {
      const improvedPrompt = await getImprovedPrompt(selectedText);

      // Tell content script to show improved prompt
      chrome.tabs.sendMessage(
        tab.id,
        {
          type: "SHOW_IMPROVED_PROMPT",
          originalPrompt: selectedText,
          improvedPrompt: improvedPrompt,
        },
        () => {}
      );
    } catch (error) {
      chrome.tabs.sendMessage(
        tab.id,
        {
          type: "SHOW_IMPROVED_PROMPT",
          originalPrompt: selectedText,
          improvedPrompt: "❌ Error improving prompt. Please try again.",
        },
        () => {}
      );
    }
  }
});

async function getImprovedPrompt(prompt) {
//  
   const API_KEY = process.env.MY_API_KEY;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completion", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
   // model: "openrouter/horizon-beta",
     // model : " openai/gpt-oss-20b",
     // model: "z-ai/glm-4.5-air",
     model : " openai/gpt-oss-20b:free",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that improves writing prompts in short.",
        },
        {
          role: "user",
          content: `Improve this prompt:\n${prompt}`,
        },
      ],
    }),
  });

  const data = await response.json();
  console.log("OpenRouter response:", data);
  const improved = data.choices?.[0]?.message?.content;
  if (!improved) //throw new Error("No improvement received")
  {
    throw new Error(data.error?.message || " no improvement received");
  }

  return improved.trim();
}

// Listen for requests from the content script ("Suggest Another")
chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === "REQUEST_ANOTHER_IMPROVEMENT") {
    try {
      const improvedPrompt = await getImprovedPrompt(message.prompt);
      chrome.tabs.sendMessage(
        sender.tab.id,
        {
          type: "SHOW_IMPROVED_PROMPT",
          originalPrompt: message.prompt,
          improvedPrompt: improvedPrompt,
        },
        () => {}
      );
    } catch (error) {
      chrome.tabs.sendMessage(
        sender.tab.id,
        {
          type: "SHOW_IMPROVED_PROMPT",
          originalPrompt: message.prompt,
          improvedPrompt: "❌ Error improving prompt. Please try again.",
        },
        () => {}
      );
    }
  }
});