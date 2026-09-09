const http = require('http');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data: JSON.parse(data || '{}') }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runMasterTest() {
  console.log('--- STARTING MASTER VERIFICATION ---');

  // 1. Dev Login Alex
  const loginRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/dev-login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'alex@example.com' });

  const token = loginRes.data.token;
  if (!token) throw new Error('Failed to login');
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 2. Fetch /api/auth/me
  const meRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/me',
    method: 'GET',
    headers: authHeaders
  });
  if (meRes.statusCode !== 200 || meRes.data.user?.email !== 'alex@example.com') throw new Error('/api/auth/me failed');

  // 3. Post Chat Message
  const chatRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/chat/messages',
    method: 'POST',
    headers: authHeaders
  }, { text: 'Master Test Message' });
  if (chatRes.statusCode !== 201 || chatRes.data.message?.text !== 'Master Test Message') throw new Error('Chat message failed');

  // 4. Create Memory Folder
  const folderRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/memories/folders',
    method: 'POST',
    headers: authHeaders
  }, { name: 'Master Album' });
  if (folderRes.statusCode !== 201 || folderRes.data.folder?.name !== 'Master Album') throw new Error('Create folder failed');
  const folderId = folderRes.data.folder._id;

  // 5. Upload Memory Photo
  const uploadRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/memories/upload',
    method: 'POST',
    headers: authHeaders
  }, {
    folderId,
    title: 'Our Special Memory',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7',
    mediaType: 'image',
    note: 'Master test note'
  });
  if (uploadRes.statusCode !== 201 || uploadRes.data.memory?.title !== 'Our Special Memory') throw new Error('Upload memory failed');

  // 6. Create Special Date
  const dateRes = await request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/dates',
    method: 'POST',
    headers: authHeaders
  }, {
    title: 'Master Anniversary',
    date: '2026-10-15',
    category: 'anniversary',
    notes: 'Master test date note'
  });
  if (dateRes.statusCode !== 201 || dateRes.data.date?.title !== 'Master Anniversary') throw new Error('Create date failed');

  console.log('✅ ALL 6 MASTER INTEGRATION TESTS PASSED 100% SUCCESS!');
}

runMasterTest().catch((err) => {
  console.error('❌ Verification Error:', err.message);
  process.exit(1);
});
