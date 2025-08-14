
Prompt Enhancer is a tool that improves and refines AI prompts to make them more detailed, structured, and contextually rich. It helps users transform short or vague inputs into well-crafted prompts, ensuring better and more accurate AI-generated responses.

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
