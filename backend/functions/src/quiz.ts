import { Router, Request, Response } from 'express';
import { db, admin } from './index';

const router = Router();

// GET /quizzes - List all quizzes
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, status, limit = '10', offset = '0' } = req.query;
    
    let query: any = db.collection('quizzes');
    
    if (category) {
      query = query.where('category', '==', category);
    }
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const countSnapshot = await query.count().get();
    const total = countSnapshot.data().count;
    
    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(Number(limit))
      .offset(Number(offset))
      .get();
    
    const quizzes = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({
      success: true,
      data: quizzes,
      total,
      limit: Number(limit),
      offset: Number(offset),
      hasMore: Number(offset) + Number(limit) < total
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch quizzes' });
  }
});

// GET /quizzes/:id - Get quiz by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const doc = await db.collection('quizzes').doc(req.params.id).get();
    
    if (!doc.exists) {
      res.status(404).json({ success: false, error: 'Quiz not found' });
      return;
    }
    
    res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch quiz' });
  }
});

// POST /quizzes - Create quiz (admin only)
router.post('/', async (req: Request, res: Response) => {
  try {
    const quiz = req.body;
    
    if (!quiz.title || !quiz.category) {
      res.status(400).json({ success: false, error: 'Title and category are required' });
      return;
    }
    
    quiz.totalAttempts = 0;
    quiz.averageScore = 0;
    quiz.status = quiz.status || 'draft';
    quiz.createdAt = admin.firestore.FieldValue.serverTimestamp();
    quiz.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    const docRef = await db.collection('quizzes').add(quiz);
    
    res.status(201).json({ success: true, data: { id: docRef.id, ...quiz } });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ success: false, error: 'Failed to create quiz' });
  }
});

// PUT /quizzes/:id - Update quiz
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    
    const doc = await db.collection('quizzes').doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404).json({ success: false, error: 'Quiz not found' });
      return;
    }
    
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    await db.collection('quizzes').doc(req.params.id).update(updates);
    
    res.json({ success: true, message: 'Quiz updated successfully' });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ success: false, error: 'Failed to update quiz' });
  }
});

// DELETE /quizzes/:id - Delete quiz
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const doc = await db.collection('quizzes').doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404).json({ success: false, error: 'Quiz not found' });
      return;
    }
    
    await db.collection('quizzes').doc(req.params.id).delete();
    
    res.json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ success: false, error: 'Failed to delete quiz' });
  }
});

// GET /quizzes/:id/questions - Get questions for a quiz
router.get('/:id/questions', async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('questions')
      .where('quizId', '==', req.params.id)
      .where('status', '==', 'published')
      .orderBy('createdAt', 'asc')
      .get();
    
    const questions = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({ success: true, data: questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch questions' });
  }
});

// POST /quizzes/:id/questions - Add question to quiz
router.post('/:id/questions', async (req: Request, res: Response) => {
  try {
    const question = req.body;
    
    if (!question.question || !question.options || question.options.length < 2) {
      res.status(400).json({ success: false, error: 'Question text and at least 2 options are required' });
      return;
    }
    
    question.quizId = req.params.id;
    question.correctCount = 0;
    question.totalAttempts = 0;
    question.status = question.status || 'published';
    question.createdAt = admin.firestore.FieldValue.serverTimestamp();
    question.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    const docRef = await db.collection('questions').add(question);
    
    await db.collection('quizzes').doc(req.params.id).update({
      questionIds: admin.firestore.FieldValue.arrayUnion(docRef.id),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(201).json({ success: true, data: { id: docRef.id, ...question } });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ success: false, error: 'Failed to create question' });
  }
});

export { router as quizRoutes };
