import { db } from './db.js';

(async () => {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected:', result.rows[0]);
    await db.end();
    process.exit(0);
  } catch (err) {
  console.error('❌ FULL ERROR:', err);
  process.exit(1);
}
})();


// Run  - node db.test.js