const API_KEY = "AIzaSyAKyKvLgfA-xEKHw7UN4qGLvf8NLWQVXVk"; 
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";

// Create prompt for Gemini
const prompt = (catFact, userQuery) => `
You are a sarcastic cat. Give life advice based on the fact: "${catFact}" and this user's problem: "${userQuery}". 
The advice should be humorous, insulting, and not true. Keep it under 70 words. 
Example: "Cats sleep for 70% of their lives." 
"Unlike you, they actually look cute doing it." (Advice phrased like a cat's perspective)
`;

// Make the API call
async function getGeminiAdvice(catFact, userQuery) {
  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt(catFact, userQuery)
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.9, // Adjusts creativity
        topK: 1,          // Top-k sampling to limit the choice
        topP: 1,          // Nucleus sampling
        maxOutputTokens: 2048 // Maximum length of generated content
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("API Error:", errorData);
    throw new Error(`Gemini API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Something went wrong... Meow!";
}

// Usage Example
const catFact = "Cats sleep for 70% of their lives.";
const userQuery = "I'm feeling tired and lazy.";
getGeminiAdvice(catFact, userQuery)
  .then(advice => console.log("Cat's advice: ", advice))
  .catch(error => console.error("Error fetching advice:", error));
