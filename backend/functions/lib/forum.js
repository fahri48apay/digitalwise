"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forumRoutes = void 0;
const express_1 = require("express");
const index_1 = require("./index");
const router = (0, express_1.Router)();
exports.forumRoutes = router;
// GET /forum/threads - List threads
router.get('/threads', async (req, res) => {
    try {
        const { category, limit = '20', offset = '0' } = req.query;
        let query = index_1.db.collection('forum_threads');
        if (category) {
            query = query.where('category', '==', category);
        }
        const countSnapshot = await query.count().get();
        const total = countSnapshot.data().count;
        const snapshot = await query
            .orderBy('isPinned', 'desc')
            .orderBy('lastActivityAt', 'desc')
            .limit(Number(limit))
            .offset(Number(offset))
            .get();
        const threads = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        res.json({
            success: true,
            data: threads,
            total,
            limit: Number(limit),
            offset: Number(offset),
            hasMore: Number(offset) + Number(limit) < total
        });
    }
    catch (error) {
        console.error('Error fetching threads:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch threads' });
    }
});
// GET /forum/threads/:id - Get thread with comments
router.get('/threads/:id', async (req, res) => {
    try {
        const threadDoc = await index_1.db.collection('forum_threads').doc(req.params.id).get();
        if (!threadDoc.exists) {
            res.status(404).json({ success: false, error: 'Thread not found' });
            return;
        }
        const commentsSnapshot = await index_1.db.collection('forum_threads')
            .doc(req.params.id)
            .collection('comments')
            .orderBy('createdAt', 'asc')
            .get();
        const comments = commentsSnapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        res.json({
            success: true,
            data: Object.assign(Object.assign({ id: threadDoc.id }, threadDoc.data()), { comments })
        });
    }
    catch (error) {
        console.error('Error fetching thread:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch thread' });
    }
});
// POST /forum/threads - Create thread
router.post('/threads', async (req, res) => {
    try {
        const thread = req.body;
        if (!thread.title || !thread.content) {
            res.status(400).json({ success: false, error: 'Title and content are required' });
            return;
        }
        thread.likes = 0;
        thread.commentsCount = 0;
        thread.isPinned = false;
        thread.isLocked = false;
        thread.lastActivityAt = index_1.admin.firestore.FieldValue.serverTimestamp();
        thread.createdAt = index_1.admin.firestore.FieldValue.serverTimestamp();
        thread.updatedAt = index_1.admin.firestore.FieldValue.serverTimestamp();
        const docRef = await index_1.db.collection('forum_threads').add(thread);
        res.status(201).json({ success: true, data: Object.assign({ id: docRef.id }, thread) });
    }
    catch (error) {
        console.error('Error creating thread:', error);
        res.status(500).json({ success: false, error: 'Failed to create thread' });
    }
});
// PUT /forum/threads/:id - Update thread
router.put('/threads/:id', async (req, res) => {
    try {
        const updates = req.body;
        const doc = await index_1.db.collection('forum_threads').doc(req.params.id).get();
        if (!doc.exists) {
            res.status(404).json({ success: false, error: 'Thread not found' });
            return;
        }
        updates.updatedAt = index_1.admin.firestore.FieldValue.serverTimestamp();
        await index_1.db.collection('forum_threads').doc(req.params.id).update(updates);
        res.json({ success: true, message: 'Thread updated successfully' });
    }
    catch (error) {
        console.error('Error updating thread:', error);
        res.status(500).json({ success: false, error: 'Failed to update thread' });
    }
});
// DELETE /forum/threads/:id - Delete thread
router.delete('/threads/:id', async (req, res) => {
    try {
        const doc = await index_1.db.collection('forum_threads').doc(req.params.id).get();
        if (!doc.exists) {
            res.status(404).json({ success: false, error: 'Thread not found' });
            return;
        }
        await index_1.db.collection('forum_threads').doc(req.params.id).delete();
        res.json({ success: true, message: 'Thread deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting thread:', error);
        res.status(500).json({ success: false, error: 'Failed to delete thread' });
    }
});
// POST /forum/threads/:id/like - Like/unlike thread
router.post('/threads/:id/like', async (req, res) => {
    try {
        const { userId } = req.body;
        const doc = await index_1.db.collection('forum_threads').doc(req.params.id).get();
        if (!doc.exists) {
            res.status(404).json({ success: false, error: 'Thread not found' });
            return;
        }
        const likeDoc = await index_1.db.collection('forum_threads')
            .doc(req.params.id)
            .collection('likes')
            .doc(userId)
            .get();
        if (likeDoc.exists) {
            await index_1.db.collection('forum_threads')
                .doc(req.params.id)
                .collection('likes')
                .doc(userId)
                .delete();
            await index_1.db.collection('forum_threads').doc(req.params.id).update({
                likes: index_1.admin.firestore.FieldValue.increment(-1)
            });
            res.json({ success: true, data: { liked: false } });
        }
        else {
            await index_1.db.collection('forum_threads')
                .doc(req.params.id)
                .collection('likes')
                .doc(userId)
                .set({ userId, createdAt: index_1.admin.firestore.FieldValue.serverTimestamp() });
            await index_1.db.collection('forum_threads').doc(req.params.id).update({
                likes: index_1.admin.firestore.FieldValue.increment(1)
            });
            res.json({ success: true, data: { liked: true } });
        }
    }
    catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ success: false, error: 'Failed to toggle like' });
    }
});
// POST /forum/threads/:id/comments - Add comment
router.post('/threads/:id/comments', async (req, res) => {
    try {
        const comment = req.body;
        if (!comment.content) {
            res.status(400).json({ success: false, error: 'Content is required' });
            return;
        }
        const threadDoc = await index_1.db.collection('forum_threads').doc(req.params.id).get();
        if (!threadDoc.exists) {
            res.status(404).json({ success: false, error: 'Thread not found' });
            return;
        }
        comment.threadId = req.params.id;
        comment.likes = 0;
        comment.isEdited = false;
        comment.createdAt = index_1.admin.firestore.FieldValue.serverTimestamp();
        comment.updatedAt = index_1.admin.firestore.FieldValue.serverTimestamp();
        const docRef = await index_1.db.collection('forum_threads')
            .doc(req.params.id)
            .collection('comments')
            .add(comment);
        await index_1.db.collection('forum_threads').doc(req.params.id).update({
            commentsCount: index_1.admin.firestore.FieldValue.increment(1),
            lastActivityAt: index_1.admin.firestore.FieldValue.serverTimestamp()
        });
        res.status(201).json({ success: true, data: Object.assign({ id: docRef.id }, comment) });
    }
    catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ success: false, error: 'Failed to create comment' });
    }
});
// PUT /forum/comments/:id - Update comment
router.put('/comments/:id', async (req, res) => {
    try {
        const { threadId, content } = req.body;
        const doc = await index_1.db.collection('forum_threads')
            .doc(threadId)
            .collection('comments')
            .doc(req.params.id)
            .get();
        if (!doc.exists) {
            res.status(404).json({ success: false, error: 'Comment not found' });
            return;
        }
        await index_1.db.collection('forum_threads')
            .doc(threadId)
            .collection('comments')
            .doc(req.params.id)
            .update({
            content,
            isEdited: true,
            updatedAt: index_1.admin.firestore.FieldValue.serverTimestamp()
        });
        res.json({ success: true, message: 'Comment updated successfully' });
    }
    catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ success: false, error: 'Failed to update comment' });
    }
});
// DELETE /forum/comments/:id - Delete comment
router.delete('/comments/:id', async (req, res) => {
    try {
        const { threadId } = req.body;
        const doc = await index_1.db.collection('forum_threads')
            .doc(threadId)
            .collection('comments')
            .doc(req.params.id)
            .get();
        if (!doc.exists) {
            res.status(404).json({ success: false, error: 'Comment not found' });
            return;
        }
        await index_1.db.collection('forum_threads')
            .doc(threadId)
            .collection('comments')
            .doc(req.params.id)
            .delete();
        await index_1.db.collection('forum_threads').doc(threadId).update({
            commentsCount: index_1.admin.firestore.FieldValue.increment(-1)
        });
        res.json({ success: true, message: 'Comment deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ success: false, error: 'Failed to delete comment' });
    }
});
//# sourceMappingURL=forum.js.map