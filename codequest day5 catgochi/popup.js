// popup.js
document.addEventListener('DOMContentLoaded', function() {
    console.log("Popup loaded");
    
    // Load advice from storage right away
    chrome.storage.local.get("cat_advice", (data) => {
      console.log("Retrieved advice from storage:", data);
      if (data.cat_advice) {
        document.getElementById('advice-text').textContent = data.cat_advice;
      } else {
        document.getElementById('advice-text').textContent = "Cat is quiet for now... 😺";
      }
    });
    
    // Add click event for the send button
    document.getElementById('send-btn').addEventListener('click', async () => {
      const userInput = document.getElementById('user-input').value.trim();
      const adviceText = document.getElementById('advice-text');
      const API_KEY = "AIzaSyAKyKvLgfA-xEKHw7UN4qGLvf8NLWQVXVk";
      const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";
      
      if (!userInput) {
        adviceText.textContent = "Cat says: You didn't say anything! 😾";
        return;
      }
      
      // Show loading state
      adviceText.textContent = "Cat is thinking... 🐱";
      
      const escapedInput = userInput.replace(/"/g, '\\"');
      const prompt = `
      You're a smart cat friend in a browser extension. A user is typing something casually.
      
      Your job is to analyze the message and decide the correct action from some of the pre-defined functions of the extension. If nothing matches with the tasks, reply accordingly as a friend be mean but not that mean be helpfull in a cat personality with action 3, and let the content be a sarcastic or playful response that fits the situation and again be helpful and kind .
      
      Respond in **strict JSON only**, with two fields:
      - "action": a number (1 for save to-do, 2 for show to-do, 3 for anything else to say to the user)
      - "content": the main content or task text (e.g., the todo item or query)
      
      Here are some examples:
      - "Add 'clean my room' to my list" → { "action": 1, "content": "clean my room" }
      - "What's on my to-do?" → { "action": 2, "content": "" }
      - "Give me some sarcastic life advice" → { "action": 3, "content": "anything that you think is correct" }
      - "Remind me to water plants" → { "action": 1, "content": "water plants" }
      
      Now analyze this input: "${escapedInput}"
      If you can't recognize the task, respond with a sarcastic remark like "What do you think I am, a magic cat?" or "Not sure what to do with that, but hey, try again!" and set action to 3.
      Respond only in valid JSON.
      `;
      
      try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.9,
              topK: 1,
              topP: 1,
              maxOutputTokens: 100
            }
          })
        });
        
        const data = await response.json();
        let replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        
        // Clean up possible markdown formatting like ```json ... ```
        replyText = replyText.trim().replace(/^```json\s*|\s*```$/g, '');
        
        console.log("Gemini raw output:", replyText);
        
        try {
          const parsed = JSON.parse(replyText);
          const action = parseInt(parsed.action);
          const content = parsed.content || "";
          
          if ([1, 2, 3].includes(action)) {
            handleGeminiResponse(action, content);
          } else {
            displayText("Cat got confused... 😿");
          }
        } catch (jsonError) {
          console.error("Invalid JSON from Gemini:", replyText);
          displayText("Cat said something weird... 😹");
        }
      } catch (error) {
        console.error("Error:", error);
        displayText("Cat had a furball. Try again later 🐾");
      }
    });
    
    // Also listen for advice from content.js via background
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log("Popup received message:", message);
      if (message.action === "healthy_advice") {
        displayText(message.content);
        // Save to storage to ensure persistence
        chrome.storage.local.set({ "cat_advice": message.content }, function() {
          console.log("Advice saved to storage from popup");
        });
      }
    });
  });
  
  function handleGeminiResponse(action, content) {
    switch (action) {
      case 1:
        updateTodo(content);
        break;
      case 2:
        showTodos();
        break;
      case 3:
        showHealthyAdvice(`Cat says: ${content}`);
        break;
      default:
        displayText("Cat got confused... 😿");
    }
    document.getElementById('user-input').value = '';
  }
  
  function updateTodo(task) {
    const todos = JSON.parse(localStorage.getItem("todos") || "[]");
    todos.push(task);
    localStorage.setItem("todos", JSON.stringify(todos));
    showHealthyAdvice(`Cat added "${task}" to your list 📝`);
  }
  
  function showTodos() {
    const todos = JSON.parse(localStorage.getItem("todos") || "[]");
    displayText(
      todos.length > 0
        ? `Your to-do list:\n${todos.map((item, i) => `${i + 1}. ${item}`).join("\n")}`
        : "Your to-do list is empty 😺"
    );
  }
  
  function displayText(text) {
    document.getElementById('advice-text').textContent = text;
  }
  
  // New function to show healthy advice and trigger notifications
  function showHealthyAdvice(advice) {
    // Display in popup
    displayText(advice);
    
    // Store in local storage
    chrome.storage.local.set({ "cat_advice": advice }, function() {
      console.log("Advice saved to storage");
    });
    
    // Send to background script to show notification
    chrome.runtime.sendMessage({ 
      action: "healthy_advice", 
      content: advice 
    }).catch(err => {
      // This error is expected if background script is not fully initialized
      console.log("Could not send to background (probably not ready yet)");
    });
  }