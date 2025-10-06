export async function getTranscript(videoId) {
  try {
    const res = await fetch(`/api/transcript/${videoId}`);
    if (!res.ok) throw new Error('Failed to fetch transcript');
    return await res.json();
  } catch (err) {
    console.error('Error fetching transcript:', err);
    return null;
  }
}