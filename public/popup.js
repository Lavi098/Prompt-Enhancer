document.getElementById("improveBtn").addEventListener("click", () => {
  const input = document.getElementById("inputPrompt").value.trim();

  // Just a fake improvement logic for now
  const improved = `Improved: ${input.charAt(0).toUpperCase()}${input.slice(1)}. Please respond thoroughly and clearly.`;

  document.getElementById("outputPrompt").value = improved;
});
