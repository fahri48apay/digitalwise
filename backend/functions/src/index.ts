import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Export Firestore, Auth, and Admin instances
export const db = admin.firestore();
export const auth = admin.auth();
export { admin };

// Import and export route handlers
import { quizRoutes } from './quiz';
import { sessionRoutes } from './session';
import { forumRoutes } from './forum';
import { notificationRoutes } from './notification';

// Create Express app for REST API
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Health check
app.get('/health', (req: any, res: any) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount routes
app.use('/quizzes', quizRoutes);
app.use('/sessions', sessionRoutes);
app.use('/forum', forumRoutes);
app.use('/notifications', notificationRoutes);

// Export the Express app as a Cloud Function
export const api = functions.https.onRequest(app);

// Export individual functions for direct invocation
export { quizRoutes } from './quiz';
export { sessionRoutes } from './session';
export { forumRoutes } from './forum';
export { notificationRoutes } from './notification';
