import { Router, Request, Response } from 'express';
import { db, admin } from './index';

const router = Router();

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// POST /sessions - Start quiz session
router.post('/', async (req: Request, res: Response) => {
  try {
    const { quizId, studentId } = req.body;
    
    if (!quizId || !studentId) {
      res.status(400).json({ success: false, error: 'Quiz ID and Student ID are required' });
      return;
    }
    
    const quizDoc = await db.collection('quizzes').doc(quizId).get();
    if (!quizDoc.exists) {
      res.status(404).json({ success: false, error: 'Quiz not found' });
      return;
    }
    
    const quiz = quizDoc.data()!;
    
    if (quiz.status !== 'published') {
      res.status(400).json({ success: false, error: 'Quiz is not published' });
      return;
    }
    
    const questionsSnapshot = await db.collection('questions')
      .where('quizId', '==', quizId)
      .where('status', '==', 'published')
      .get();
    
    if (questionsSnapshot.empty) {
      res.status(400).json({ success: false, error: 'No published questions found for this quiz' });
      return;
    }
    
    const questions = questionsSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));
    
    let questionOrder: string[];
    let processedQuestions = questions;
    
    if (quiz.mode === 'dynamic') {
      questionOrder = shuffleArray(questions.map((q: any) => q.id));
      if (quiz.shuffleOptions) {
        processedQuestions = questions.map((q: any) => ({
          ...q,
          options: shuffleArray(q.options)
        }));
      }
    } else {
      questionOrder = quiz.questionIds || questions.map((q: any) => q.id);
    }
    
    const session = {
      studentId,
      quizId,
      mode: quiz.mode,
      shuffledQuestionIds: questionOrder,
      currentIndex: 0,
      answers: [],
      score: 0,
      passed: false,
      xpEarned: 0,
      startedAt: admin.firestore.FieldValue.serverTimestamp(),
      timeSpent: 0
    };
    
    const docRef = await db.collection('sessions').add(session);
    
    await db.collection('quizzes').doc(quizId).update({
      totalAttempts: admin.firestore.FieldValue.increment(1)
    });
    
    res.status(201).json({
      success: true,
      data: { id: docRef.id, ...session, questions: processedQuestions }
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ success: false, error: 'Failed to create session' });
  }
});

// POST /sessions/:id/answer - Submit answer
router.post('/:id/answer', async (req: Request, res: Response) => {
  try {
    const { questionId, optionId, timeSpent } = req.body;
    
    if (!questionId || !optionId) {
      res.status(400).json({ success: false, error: 'Question ID and Option ID are required' });
      return;
    }
    
    const sessionDoc = await db.collection('sessions').doc(req.params.id).get();
    if (!sessionDoc.exists) {
      res.status(404).json({ success: false, error: 'Session not found' });
      return;
    }
    
    const session = sessionDoc.data()!;
    
    const questionDoc = await db.collection('questions').doc(questionId).get();
    if (!questionDoc.exists) {
      res.status(404).json({ success: false, error: 'Question not found' });
      return;
    }
    
    const question = questionDoc.data()!;
    
    const selectedOption = question.options.find((o: any) => o.id === optionId);
    if (!selectedOption) {
      res.status(400).json({ success: false, error: 'Invalid option ID' });
      return;
    }
    
    const isCorrect = selectedOption.isCorrect;
    
    const answer = {
      questionId,
      selectedOptionId: optionId,
      isCorrect,
      timeSpent: timeSpent || 0
    };
    
    const newAnswers = [...session.answers, answer];
    const correctCount = newAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / newAnswers.length) * 100);
    
    await db.collection('sessions').doc(req.params.id).update({
      answers: newAnswers,
      currentIndex: session.currentIndex + 1,
      score,
      timeSpent: admin.firestore.FieldValue.increment(timeSpent || 0)
    });
    
    await db.collection('questions').doc(questionId).update({
      totalAttempts: admin.firestore.FieldValue.increment(1),
      correctCount: admin.firestore.FieldValue.increment(isCorrect ? 1 : 0)
    });
    
    const xpEarned = isCorrect ? (question.xpReward || 0) : 0;
    
    res.json({
      success: true,
      data: {
        isCorrect,
        explanation: question.explanation,
        correctAnswer: question.options.find((o: any) => o.isCorrect)?.id,
        xpEarned,
        feedback: selectedOption.feedback
      }
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ success: false, error: 'Failed to submit answer' });
  }
});

// POST /sessions/:id/complete - Complete quiz session
router.post('/:id/complete', async (req: Request, res: Response) => {
  try {
    const sessionDoc = await db.collection('sessions').doc(req.params.id).get();
    if (!sessionDoc.exists) {
      res.status(404).json({ success: false, error: 'Session not found' });
      return;
    }
    
    const session = sessionDoc.data()!;
    
    const quizDoc = await db.collection('quizzes').doc(session.quizId).get();
    const quiz = quizDoc.data()!;
    
    const correctCount = session.answers.filter((a: any) => a.isCorrect).length;
    const totalQuestions = session.shuffledQuestionIds.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= quiz.passingScore;
    const xpEarned = passed ? quiz.xpReward : 0;
    
    await db.collection('sessions').doc(req.params.id).update({
      score,
      passed,
      xpEarned,
      completedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    const quizStats = await db.collection('sessions')
      .where('quizId', '==', session.quizId)
      .where('completedAt', '!=', null)
      .get();
    
    const totalScore = quizStats.docs.reduce((sum: number, doc: any) => {
      return sum + (doc.data().score || 0);
    }, 0);
    const averageScore = Math.round(totalScore / quizStats.size);
    
    await db.collection('quizzes').doc(session.quizId).update({ averageScore });
    
    res.json({
      success: true,
      data: {
        sessionId: req.params.id,
        score,
        passed,
        xpEarned,
        correctCount,
        totalQuestions,
        passingScore: quiz.passingScore,
        timeSpent: session.timeSpent
      }
    });
  } catch (error) {
    console.error('Error completing session:', error);
    res.status(500).json({ success: false, error: 'Failed to complete session' });
  }
});

// GET /sessions/:id - Get session details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const doc = await db.collection('sessions').doc(req.params.id).get();
    
    if (!doc.exists) {
      res.status(404).json({ success: false, error: 'Session not found' });
      return;
    }
    
    res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch session' });
  }
});

export { router as sessionRoutes };
