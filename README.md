
demovideo - https://github.com/Lavi098/Prompt-Enhancer-extension/blob/main/demo%20video.mp4


Prompt Enhancer is a extension that improves and refines AI prompts to make them more detailed, structured, and contextually rich. It helps users transform short or vague inputs into well-crafted prompts, ensuring better and more accurate AI-generated responses.

how it work - 
-using this extension is very simple just select the prompt u are give to any LLM,image,video generating model 
- right click on selected text and choos improve prompt with extension
- it suggest u improved prompts within seconds after that u got 3 option (accept,suggest another,cancel)
- by accepting it directly paste in place of your original prompt
- by slecting suggest another it give u another prompt
- by choosing cancel it cancel the task

  how it help user?
  by giving prompts with more context , with more info the output u are genrating will be more precise 

Project Setup
🔒 Environment Variables

This project uses a .env file to store sensitive credentials such as API keys and secret tokens.
Never commit this file to the repository.


1️⃣ Create a .env file in the project root

Example:

API_KEY=your_api_key_here
API_SECRET=your_api_secret_here


2️⃣ .gitignore is already configured

These files are ignored by Git:

.env
config.local.js


3️⃣ Share environment variables securely

Use a secure channel (e.g., password manager, encrypted file transfer) to share .env contents with collaborators.

Each developer must create their own .env locally.




🚀 Pushing Code to the Repository

Stage all non-sensitive changes:

1.git add .


Commit:

2.git commit -m "Initial commit with secure env setup"


3.Push:

git push origin main
