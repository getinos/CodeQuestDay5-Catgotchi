// content.js
console.log("Cat content script loaded!");

// Create the floating cat icon
function createCatgotchi() {
  console.log("Attempting to create catgotchi element");
  const catgotchi = document.createElement('div');
  catgotchi.id = 'catgotchi';
  catgotchi.textContent = '🐱';
  catgotchi.title = 'Click me for advice!';
  
  // Add click event to show random advice
  catgotchi.addEventListener('click', () => {
    console.log("Catgotchi clicked!");
    showHealthyAdvice(getRandomAdvice());
  });
  
  document.body.appendChild(catgotchi);
  console.log("Catgotchi created on page!");
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createCatgotchi);
} else {
  createCatgotchi();
}

// Track time spent on a page
let timeSpent = 0;
let idleTime = 0;

// Monitor mouse or keyboard activity to reset idle timer
function resetIdleTimer() {
  idleTime = 0; // Reset idle time when user is active
}

document.addEventListener('mousemove', resetIdleTimer);
document.addEventListener('keydown', resetIdleTimer);
document.addEventListener('click', resetIdleTimer);

// Function to send advice to the background script
function showHealthyAdvice(advice) {
  console.log("Sending advice:", advice);
  chrome.runtime.sendMessage({ 
    action: "healthy_advice", 
    content: advice 
  }).catch(err => {
    // Handle potential errors when sending messages
    console.error("Error sending message:", err);
  });
}

// Get random advice
function getRandomAdvice() {
  const healthAdvices = [
    "You haven't moved in a while. Stretch those paws! 😼",
    "You've been staring at the screen for too long. Take a break! 😺",
    "Don't forget to drink some water! 🐱💧",
    "Your eyes are tired. Blink a few times and look away! 👀",
    "Sitting too much? Time for a little dance! 💃🐾",
    "Remember to check your posture, hooman! Straight back like a cat! 🐈",
    "Maybe it's time for a small snack? Just like I would! 🍪",
    "How about a short walk? Even cats need exercise! 🚶‍♂️",
    "Screen brightness too high? Protect those precious eyes! 😸",
    "A short nap can do wonders! Trust me, I'm an expert! 😴"
  ];
  return healthAdvices[Math.floor(Math.random() * healthAdvices.length)];
}

// Increment time spent on page
setInterval(() => {
  timeSpent += 1;
  idleTime += 1;

  // Every minute, log the current times (for debugging)
  if (timeSpent % 60 === 0) {
    console.log(`Time spent: ${timeSpent}s, Idle time: ${idleTime}s`);
  }

  // After 30 seconds of inactivity, show a reminder to take a break
  if (idleTime >= 30 && idleTime % 30 === 0) {
    console.log("Triggering idle reminder");
    showHealthyAdvice("Cat says: You haven't moved in a while. Stretch those paws! 😼");
  }

  // After 5 minutes, remind to take a break
  if (timeSpent >= 300 && timeSpent % 300 === 0) {
    console.log("Triggering time spent reminder");
    showHealthyAdvice("Cat says: You've been working hard, take a break! 🐾");
  }
}, 1000); // Check every second