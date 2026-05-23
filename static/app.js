const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendButton = document.querySelector('.chat-input-area button');

async function handleSendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;

    // 1. Append User Message to UI
    const userMessage = document.createElement('p');
    userMessage.className = 'user-msg';
    userMessage.style.marginTop = "10px";
    userMessage.style.color = "#38bdf8"; // Vibrant sky blue for you
    userMessage.innerHTML = `<strong>You:</strong> ${text}`;
    chatBox.appendChild(userMessage);
    
    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // 2. Add a temporary "Thinking..." indicator
    const typingIndicator = document.createElement('p');
    typingIndicator.style.marginTop = "10px";
    typingIndicator.style.color = "#94a3b8";
    typingIndicator.innerHTML = `<strong>AI:</strong> Thinking...`;
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 3. POST the message to our Flask backend route (/api/chat)
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        
        const data = await response.json();
        
        // Remove the "Thinking..." text
        chatBox.removeChild(typingIndicator);
        
        // Append the real live Gemini response!
        const botMessage = document.createElement('p');
        botMessage.className = 'bot-msg';
        botMessage.style.marginTop = "10px";
        botMessage.innerHTML = `<strong>AI:</strong> ${data.reply}`;
        chatBox.appendChild(botMessage);
        
    } catch (error) {
        chatBox.removeChild(typingIndicator);
        const errorMessage = document.createElement('p');
        errorMessage.style.color = "#ef4444";
        errorMessage.innerHTML = `<strong>AI:</strong> Error connecting to Python backend server.`;
        chatBox.appendChild(errorMessage);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Event Listeners for UI interaction
sendButton.addEventListener('click', handleSendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSendMessage(); });