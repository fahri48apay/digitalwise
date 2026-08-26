const admin = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

let app;
if (process.env.FIRESTORE_EMULATOR_HOST) {
  console.log(`🔗 Connecting to emulator: ${process.env.FIRESTORE_EMULATOR_HOST}`);
  app = admin.initializeApp({ projectId: 'digitalwise-demo' });
} else if (process.env.SERVICE_ACCOUNT_PATH) {
  const serviceAccount = JSON.parse(fs.readFileSync(
    path.resolve(process.cwd(), process.env.SERVICE_ACCOUNT_PATH), 'utf8'
  ));
  console.log(`🔑 Using service account: ${serviceAccount.project_id}`);
  app = admin.initializeApp({ credential: admin.cert(serviceAccount) });
} else {
  console.error('❌ Set FIRESTORE_EMULATOR_HOST or SERVICE_ACCOUNT_PATH');
  process.exit(1);
}

const db = getFirestore(app);

const seedData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../seed/initial-questions.json'), 'utf8')
);

async function seed() {
  console.log('\n🌱 Starting seed...\n');

  console.log('📝 Creating quizzes...');
  for (const quiz of seedData.quizzes) {
    const { id, ...quizData } = quiz;
    quizData.createdAt = FieldValue.serverTimestamp();
    quizData.updatedAt = FieldValue.serverTimestamp();
    await db.collection('quizzes').doc(id).set(quizData);
    console.log(`  ✅ Quiz: ${quiz.title}`);
  }

  console.log('\n❓ Creating questions...');
  for (const question of seedData.questions) {
    const { id, ...questionData } = question;
    questionData.createdAt = FieldValue.serverTimestamp();
    questionData.updatedAt = FieldValue.serverTimestamp();
    await db.collection('questions').doc(id).set(questionData);
    console.log(`  ✅ ${question.question.substring(0, 50)}...`);
  }

  console.log('\n🔗 Linking questions to quiz...');
  const quiz = seedData.quizzes[0];
  const questionIds = seedData.questions.map(q => q.id);
  await db.collection('quizzes').doc(quiz.id).update({ questionIds });
  console.log(`  ✅ ${quiz.title} → ${questionIds.length} questions`);

  console.log('\n👤 Creating demo users...');
  await db.collection('users').doc('kirana-demo').set({
    displayName: 'Kirana Putri',
    email: 'kirana@digitalwise.demo',
    xp: 890, level: 4, streak: 5,
    badges: ['phishing-detective'],
    completedMissions: ['mission-1'],
    settings: { darkMode: false, notifications: true, language: 'id' },
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });
  console.log('  ✅ Kirana Putri (kirana-demo)');

  await db.collection('users').doc('admin-demo').set({
    displayName: 'Admin Utama',
    email: 'admin@digitalwise.id',
    xp: 0, level: 0, streak: 0,
    badges: [], completedMissions: [],
    role: 'admin',
    settings: { darkMode: false, notifications: true, language: 'id' },
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });
  console.log('  ✅ Admin Utama (admin-demo)');

  console.log('\n💬 Creating sample forum thread...');
  await db.collection('forum_threads').doc('thread-demo-1').set({
    title: 'Tips Menghindari Phishing Email',
    content: 'Halo semuanya! Sharing tips nih tentang cara mengenali email phishing.',
    category: 'Keamanan',
    authorId: 'kirana-demo', authorName: 'Kirana Putri',
    likes: 12, commentsCount: 3,
    isPinned: false, isLocked: false,
    lastActivityAt: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });
  console.log('  ✅ Thread: Tips Menghindari Phishing Email');

  console.log('\n🎉 Seed completed!\n');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
