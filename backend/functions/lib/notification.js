"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = require("express");
const index_1 = require("./index");
const router = (0, express_1.Router)();
exports.notificationRoutes = router;
// GET /notifications - List user notifications
router.get('/', async (req, res) => {
    try {
        const { userId, limit = '20', offset = '0', unreadOnly = 'false' } = req.query;
        if (!userId) {
            res.status(400).json({ success: false, error: 'User ID is required' });
            return;
        }
        let query = index_1.db.collection('notifications')
            .where('userId', '==', userId);
        if (unreadOnly === 'true') {
            query = query.where('isRead', '==', false);
        }
        const countSnapshot = await query.count().get();
        const total = countSnapshot.data().count;
        const snapshot = await query
            .orderBy('createdAt', 'desc')
            .limit(Number(limit))
            .offset(Number(offset))
            .get();
        const notifications = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        res.json({
            success: true,
            data: notifications,
            total,
            limit: Number(limit),
            offset: Number(offset),
            hasMore: Number(offset) + Number(limit) < total
        });
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
    }
});
// POST /notifications - Create notification
router.post('/', async (req, res) => {
    try {
        const notification = req.body;
        if (!notification.userId || !notification.title || !notification.body) {
            res.status(400).json({ success: false, error: 'User ID, title, and body are required' });
            return;
        }
        notification.isRead = false;
        notification.createdAt = index_1.admin.firestore.FieldValue.serverTimestamp();
        const docRef = await index_1.db.collection('notifications').add(notification);
        res.status(201).json({ success: true, data: Object.assign({ id: docRef.id }, notification) });
    }
    catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ success: false, error: 'Failed to create notification' });
    }
});
// PUT /notifications/:id - Mark as read
router.put('/:id', async (req, res) => {
    try {
        const { isRead = true } = req.body;
        await index_1.db.collection('notifications').doc(req.params.id).update({
            isRead,
            readAt: isRead ? index_1.admin.firestore.FieldValue.serverTimestamp() : null
        });
        res.json({ success: true, message: 'Notification updated' });
    }
    catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ success: false, error: 'Failed to update notification' });
    }
});
// POST /notifications/mark-all-read - Mark all as read
router.post('/mark-all-read', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({ success: false, error: 'User ID is required' });
            return;
        }
        const snapshot = await index_1.db.collection('notifications')
            .where('userId', '==', userId)
            .where('isRead', '==', false)
            .get();
        const batch = index_1.db.batch();
        snapshot.docs.forEach((doc) => {
            batch.update(doc.ref, {
                isRead: true,
                readAt: index_1.admin.firestore.FieldValue.serverTimestamp()
            });
        });
        await batch.commit();
        res.json({ success: true, message: `${snapshot.size} notifications marked as read` });
    }
    catch (error) {
        console.error('Error marking all as read:', error);
        res.status(500).json({ success: false, error: 'Failed to mark notifications as read' });
    }
});
// DELETE /notifications/:id - Delete notification
router.delete('/:id', async (req, res) => {
    try {
        await index_1.db.collection('notifications').doc(req.params.id).delete();
        res.json({ success: true, message: 'Notification deleted' });
    }
    catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ success: false, error: 'Failed to delete notification' });
    }
});
// POST /notifications/clear - Clear all notifications for user
router.post('/clear', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            res.status(400).json({ success: false, error: 'User ID is required' });
            return;
        }
        const snapshot = await index_1.db.collection('notifications')
            .where('userId', '==', userId)
            .get();
        const batch = index_1.db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        res.json({ success: true, message: `${snapshot.size} notifications cleared` });
    }
    catch (error) {
        console.error('Error clearing notifications:', error);
        res.status(500).json({ success: false, error: 'Failed to clear notifications' });
    }
});
// POST /notifications/bulk - Send notification to multiple users
router.post('/bulk', async (req, res) => {
    try {
        const { userIds, title, body, type, data } = req.body;
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            res.status(400).json({ success: false, error: 'User IDs array is required' });
            return;
        }
        if (!title || !body) {
            res.status(400).json({ success: false, error: 'Title and body are required' });
            return;
        }
        const batch = index_1.db.batch();
        const notifications = [];
        userIds.forEach((userId) => {
            const notificationRef = index_1.db.collection('notifications').doc();
            const notification = {
                userId,
                title,
                body,
                type: type || 'system',
                data: data || {},
                isRead: false,
                createdAt: index_1.admin.firestore.FieldValue.serverTimestamp()
            };
            batch.set(notificationRef, notification);
            notifications.push(Object.assign({ id: notificationRef.id }, notification));
        });
        await batch.commit();
        res.status(201).json({
            success: true,
            message: `${notifications.length} notifications created`,
            data: notifications
        });
    }
    catch (error) {
        console.error('Error creating bulk notifications:', error);
        res.status(500).json({ success: false, error: 'Failed to create notifications' });
    }
});
//# sourceMappingURL=notification.js.map