"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRoutes = void 0;
const express_1 = require("express");
const index_1 = require("./index");
const router = (0, express_1.Router)();
exports.sessionRoutes = router;
// Fisher-Yates shuffle
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
// POST /sessions - Start quiz session
router.post('/', async (req, res) => {
    try {
        const { quizId, studentId } = req.body;
        if (!quizId || !studentId) {
            res.status(400).json({ success: false, error: 'Quiz ID and Student ID are required' });
            return;
        }
        const quizDoc = await index_1.db.collection('quizzes').doc(quizId).get();
        if (!quizDoc.exists) {
            res.status(404).json({ success: false, error: 'Quiz not found' });
            return;
        }
        const quiz = quizDoc.data();
        if (quiz.status !== 'published') {
            res.status(400).json({ success: false, error: 'Quiz is not published' });
            return;
        }
        const questionsSnapshot = await index_1.db.collection('questions')
            .where('quizId', '==', quizId)
            .where('status', '==', 'published')
            .get();
        if (questionsSnapshot.empty) {
            res.status(400).json({ success: false, error: 'No published questions found for this quiz' });
            return;
        }
        const questions = questionsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        let questionOrder;
        let processedQuestions = questions;
        if (quiz.mode === 'dynamic') {
            questionOrder = shuffleArray(questions.map((q) => q.id));
            if (quiz.shuffleOptions) {
                processedQuestions = questions.map((q) => (Object.assign(Object.assign({}, q), { options: shuffleArray(q.options) })));
            }
        }
        else {
            questionOrder = quiz.questionIds || questions.map((q) => q.id);
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
            startedAt: index_1.admin.firestore.FieldValue.serverTimestamp(),
            timeSpent: 0
        };
        const docRef = await index_1.db.collection('sessions').add(session);
        await index_1.db.collection('quizzes').doc(quizId).update({
            totalAttempts: index_1.admin.firestore.FieldValue.increment(1)
        });
        res.status(201).json({
            success: true,
            data: Object.assign(Object.assign({ id: docRef.id }, session), { questions: processedQuestions })
        });
    }
    catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ success: false, error: 'Failed to create session' });
    }
});
// POST /sessions/:id/answer - Submit answer
router.post('/:id/answer', async (req, res) => {
    var _a;
    try {
        const { questionId, optionId, timeSpent } = req.body;
        if (!questionId || !optionId) {
            res.status(400).json({ success: false, error: 'Question ID and Option ID are required' });
            return;
        }
        const sessionDoc = await index_1.db.collection('sessions').doc(req.params.id).get();
        if (!sessionDoc.exists) {
            res.status(404).json({ success: false, error: 'Session not found' });
            return;
        }
        const session = sessionDoc.data();
        const questionDoc = await index_1.db.collection('questions').doc(questionId).get();
        if (!questionDoc.exists) {
            res.status(404).json({ success: false, error: 'Question not found' });
            return;
        }
        const question = questionDoc.data();
        const selectedOption = question.options.find((o) => o.id === optionId);
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
        await index_1.db.collection('sessions').doc(req.params.id).update({
            answers: newAnswers,
            currentIndex: session.currentIndex + 1,
            score,
            timeSpent: index_1.admin.firestore.FieldValue.increment(timeSpent || 0)
        });
        await index_1.db.collection('questions').doc(questionId).update({
            totalAttempts: index_1.admin.firestore.FieldValue.increment(1),
            correctCount: index_1.admin.firestore.FieldValue.increment(isCorrect ? 1 : 0)
        });
        const xpEarned = isCorrect ? (question.xpReward || 0) : 0;
        res.json({
            success: true,
            data: {
                isCorrect,
                explanation: question.explanation,
                correctAnswer: (_a = question.options.find((o) => o.isCorrect)) === null || _a === void 0 ? void 0 : _a.id,
                xpEarned,
                feedback: selectedOption.feedback
            }
        });
    }
    catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({ success: false, error: 'Failed to submit answer' });
    }
});
// POST /sessions/:id/complete - Complete quiz session
router.post('/:id/complete', async (req, res) => {
    try {
        const sessionDoc = await index_1.db.collection('sessions').doc(req.params.id).get();
        if (!sessionDoc.exists) {
            res.status(404).json({ success: false, error: 'Session not found' });
            return;
        }
        const session = sessionDoc.data();
        const quizDoc = await index_1.db.collection('quizzes').doc(session.quizId).get();
        const quiz = quizDoc.data();
        const correctCount = session.answers.filter((a) => a.isCorrect).length;
        const totalQuestions = session.shuffledQuestionIds.length;
        const score = Math.round((correctCount / totalQuestions) * 100);
        const passed = score >= quiz.passingScore;
        const xpEarned = passed ? quiz.xpReward : 0;
        await index_1.db.collection('sessions').doc(req.params.id).update({
            score,
            passed,
            xpEarned,
            completedAt: index_1.admin.firestore.FieldValue.serverTimestamp()
        });
        const quizStats = await index_1.db.collection('sessions')
            .where('quizId', '==', session.quizId)
            .where('completedAt', '!=', null)
            .get();
        const totalScore = quizStats.docs.reduce((sum, doc) => {
            return sum + (doc.data().score || 0);
        }, 0);
        const averageScore = Math.round(totalScore / quizStats.size);
        await index_1.db.collection('quizzes').doc(session.quizId).update({ averageScore });
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
    }
    catch (error) {
        console.error('Error completing session:', error);
        res.status(500).json({ success: false, error: 'Failed to complete session' });
    }
});
// GET /sessions/:id - Get session details
router.get('/:id', async (req, res) => {
    try {
        const doc = await index_1.db.collection('sessions').doc(req.params.id).get();
        if (!doc.exists) {
            res.status(404).json({ success: false, error: 'Session not found' });
            return;
        }
        res.json({ success: true, data: Object.assign({ id: doc.id }, doc.data()) });
    }
    catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch session' });
    }
});
//# sourceMappingURL=session.js.map