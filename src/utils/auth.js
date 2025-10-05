const API_BASE_URL = 'http://localhost:5000/api';

export const authenticateParticipant = async (participantId, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        participant_id: participantId,
        password: password
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Store participant info in sessionStorage
      sessionStorage.setItem('participant', JSON.stringify(data.data));
      return { success: true, data: data.data };
    } else {
      return { success: false, error: data.error || 'Login failed' };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Network error. Please check your connection.' };
  }
};

export const getParticipant = () => {
  try {
    const participant = sessionStorage.getItem('participant');
    return participant ? JSON.parse(participant) : null;
  } catch {
    return null;
  }
};

export const logout = () => {
  sessionStorage.removeItem('participant');
};

export const isAuthenticated = () => {
  return getParticipant() !== null;
};

export const getSessionId = () => {
  const participant = getParticipant();
  return participant?.sessionId || null;
};