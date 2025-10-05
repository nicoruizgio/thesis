import supabase from './supabase';
import { getParticipant } from './auth';

const getParticipantId = () => {
  const participant = getParticipant();
  return participant?.participant_id || null;
};

// Add a simple cache to track what we've already logged
const loggedArticles = new Set();
const loggedQuestions = new Set();
const loggedFinished = new Set();

export const logParticipant = async () => {
  const participantId = getParticipantId();
  if (!participantId) {
    console.error('No participant ID found');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('participants')
      .upsert({ participant_id: participantId })
      .select();

    if (error) {
      console.error('Error logging participant:', error);
      return;
    }

    console.log('Participant logged successfully:', data);
  } catch (error) {
    console.error('Error logging participant:', error);
  }
};

export const logArticleVisit = async (articleId, articleTitle) => {
  const participantId = getParticipantId();
  if (!participantId) {
    console.error('No participant ID found');
    return;
  }

  // Create a unique key for this participant + article combination
  const logKey = `${participantId}_${articleId}`;

  // Check if we've already logged this visit in this session
  if (loggedArticles.has(logKey)) {
    console.log('Article visit already logged for this session, skipping...');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('articles_visited')
      .insert({
        participant_id: participantId,
        article_id: articleId,
        article_title: articleTitle,
        visit_type: 'visit'  // Explicitly set as visit
      })
      .select();

    if (error) {
      console.error('Error logging article visit:', error);
      return;
    }

    // Mark as logged to prevent duplicates in this session
    loggedArticles.add(logKey);
    console.log('Article visit logged successfully:', data);
  } catch (error) {
    console.error('Error logging article visit:', error);
  }
};

export const logArticleFinished = async (articleId, articleTitle) => {
  const participantId = getParticipantId();
  if (!participantId) {
    console.error('No participant ID found');
    return;
  }

  // Create a unique key for this participant + article combination
  const logKey = `${participantId}_${articleId}`;

  // Check if we've already logged this finish in this session
  if (loggedFinished.has(logKey)) {
    console.log('Article finish already logged for this session, skipping...');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('articles_visited')
      .insert({
        participant_id: participantId,
        article_id: articleId,
        article_title: articleTitle,
        visit_type: 'finish'  // Set as finish
      })
      .select();

    if (error) {
      console.error('Error logging article finished:', error);
      return;
    }

    // Mark as logged to prevent duplicates in this session
    loggedFinished.add(logKey);
    console.log('Article finished logged successfully:', data);
  } catch (error) {
    console.error('Error logging article finished:', error);
  }
};

export const logConversation = async (
  articleId,
  messageFrom,
  messageText,
  userMessageType = null,
  selectedPassage = null
) => {
  try {
    const participantId = getParticipantId();
    if (!participantId) return;

    const { data, error } = await supabase
      .from('conversations')
      .insert([{
        participant_id: participantId,
        article_id: articleId,
        message_from: messageFrom,
        message_text: messageText,
        user_message_type: userMessageType,
        selected_passage: selectedPassage
      }])
      .select();

    if (error) {
      console.error('Error logging conversation:', error);
      return;
    }
    console.log('Conversation logged successfully:', data);
  } catch (error) {
    console.error('Error logging conversation:', error);
  }
};

// Admin/Debug functions
export const getParticipantData = async (participantId) => {
  try {
    // Get participant info
    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .select('*')
      .eq('participant_id', participantId);

    // Get articles visited
    const { data: articles, error: articlesError } = await supabase
      .from('articles_visited')
      .select('*')
      .eq('participant_id', participantId)
      .order('visited_at');

    // Get generated questions
    const { data: questions, error: questionsError } = await supabase
      .from('generated_questions')
      .select('*')
      .eq('participant_id', participantId)
      .order('generated_at');

    // Get conversations
    const { data: conversations, error: conversationsError } = await supabase
      .from('conversations')
      .select('*')
      .eq('participant_id', participantId)
      .order('timestamp');

    if (participantError || articlesError || questionsError || conversationsError) {
      console.error('Error getting participant data:', {
        participantError,
        articlesError,
        questionsError,
        conversationsError
      });
      return null;
    }

    return {
      participant,
      articles_visited: articles,
      generated_questions: questions,
      conversations
    };
  } catch (error) {
    console.error('Error getting participant data:', error);
    return null;
  }
};

// Clear study data when participant completes or leaves
export const clearStudyData = () => {
  try {
    sessionStorage.removeItem('shuffled_articles');
    sessionStorage.removeItem('article_questions_cache');
    console.log('Study data cleared from sessionStorage');
  } catch (error) {
    console.error('Error clearing study data:', error);
  }
};

// You could call this when the participant finishes the study
// or add a beforeunload event listener to clear on window close
export const setupStudyDataCleanup = () => {
  const handleBeforeUnload = () => {
    clearStudyData();
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  // Return cleanup function
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};