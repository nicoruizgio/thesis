export async function sendMessageToApi(message, videoId, type = 'video', articleData = null) {
  try {
    const body = {
      message,
      type
    };

    // Add video_id only for video type
    if (type === 'video') {
      body.video_id = videoId;
    }

    // Add article data for article type
    if (type === 'article' && articleData) {
      body.article = articleData;
    }

    const response = await fetch('http://127.0.0.1:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error('Error sending message to API:', error);
    return 'Sorry, I encountered an error while processing your message.';
  }
}