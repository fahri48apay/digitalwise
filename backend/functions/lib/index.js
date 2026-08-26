"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = exports.forumRoutes = exports.sessionRoutes = exports.quizRoutes = exports.api = exports.admin = exports.auth = exports.db = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
exports.admin = admin;
// Initialize Firebase Admin
admin.initializeApp();
// Export Firestore, Auth, and Admin instances
exports.db = admin.firestore();
exports.auth = admin.auth();
// Import and export route handlers
const quiz_1 = require("./quiz");
const session_1 = require("./session");
const forum_1 = require("./forum");
const notification_1 = require("./notification");
// Create Express app for REST API
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Mount routes
app.use('/quizzes', quiz_1.quizRoutes);
app.use('/sessions', session_1.sessionRoutes);
app.use('/forum', forum_1.forumRoutes);
app.use('/notifications', notification_1.notificationRoutes);
// Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);
// Export individual functions for direct invocation
var quiz_2 = require("./quiz");
Object.defineProperty(exports, "quizRoutes", { enumerable: true, get: function () { return quiz_2.quizRoutes; } });
var session_2 = require("./session");
Object.defineProperty(exports, "sessionRoutes", { enumerable: true, get: function () { return session_2.sessionRoutes; } });
var forum_2 = require("./forum");
Object.defineProperty(exports, "forumRoutes", { enumerable: true, get: function () { return forum_2.forumRoutes; } });
var notification_2 = require("./notification");
Object.defineProperty(exports, "notificationRoutes", { enumerable: true, get: function () { return notification_2.notificationRoutes; } });
//# sourceMappingURL=index.js.map