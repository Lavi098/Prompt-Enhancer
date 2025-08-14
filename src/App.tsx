import { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  const improvePrompt = async (input: string) => {
    setLoading(true);
    setSuggestion('');
    try {
      const API_KEY = process.env.MY_API_KEY;
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b:free",
          messages: [
            { role: "system", content: "You are a helpful assistant that improves writing prompts in short." },
            { role: "user", content: `Improve this prompt:\n${input}` },
          ],
        }),
      });
        const data = await response.json();
      const improved = data.choices?.[0]?.message?.content;
      setSuggestion(improved ? improved.trim() : "❌ No improved prompt received.");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setSuggestion("❌ Error improving prompt. Please try again.");
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) improvePrompt(prompt);
  };

  return (
    <div className="app">
      <h1>Prompt Aid</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Paste or type your prompt..."
          rows={4}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Improving..." : "Improve Prompt"}
        </button>
      </form>
       {suggestion && (
        <div className="suggestion">
          <h3>Suggested Prompt:</h3>
          <p>{suggestion}</p>
        </div>
      )}
    </div>
  );
}

export default App;