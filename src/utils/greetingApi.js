export async function generateGreeting(type = 'video') {
  try {
    const response = await fetch('/api/generate-greeting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.greeting;
  } catch (error) {
    console.error('Error generating greeting:', error);
    // Fallback greeting
    return type === 'video'
      ? 'Hi! How can I help you with this video?'
      : 'Hi! How can I help you with this article?';
  }
}