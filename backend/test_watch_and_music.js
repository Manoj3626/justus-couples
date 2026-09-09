const io = require('../frontend/node_modules/socket.io-client');
const http = require('http');

const API_BASE = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

function apiPost(path, data, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const bodyText = JSON.stringify(data || {});
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(bodyText),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(url, { method: 'POST', headers }, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => (responseBody += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve(parsed);
        } catch (e) {
          resolve(responseBody);
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(bodyText);
    req.end();
  });
}

(async () => {
  console.log('🧪 Starting Expanded Two-User Music + Watch Video Integration Test...\n');

  try {
    // Step 1: Login Alex & Sam
    const alexRes = await apiPost('/auth/dev-login', { email: 'alex@example.com' });
    const alexToken = alexRes.token;
    const alexConnId = alexRes.user.connectionId || '6aa0dcfc1f233433962c19cf';

    const samRes = await apiPost('/auth/dev-login', { email: 'sam@example.com' });
    const samToken = samRes.token;
    const samConnId = samRes.user.connectionId || '6aa0dcfc1f233433962c19cf';

    console.log(`✅ Alex logged in (${alexRes.user._id || alexRes.user.id}, Conn: ${alexConnId})`);
    console.log(`✅ Sam logged in (${samRes.user._id || samRes.user.id}, Conn: ${samConnId})`);

    // Step 2: Connect Sockets & Join Space Room
    const alexSocket = io(SOCKET_URL, { auth: { token: alexToken }, transports: ['websocket'] });
    const samSocket = io(SOCKET_URL, { auth: { token: samToken }, transports: ['websocket'] });

    await Promise.all([
      new Promise((res) => alexSocket.on('connect', res)),
      new Promise((res) => samSocket.on('connect', res)),
    ]);

    alexSocket.emit('join_space', { connectionId: alexConnId });
    samSocket.emit('join_space', { connectionId: samConnId });

    await new Promise((res) => setTimeout(res, 500));
    console.log('⚡ Both Alex & Sam connected & joined room via Socket.IO!\n');

    // TEST 1: Music Track Selection Sync (Alex -> Sam)
    console.log('--- Test 1: Music Track Selection Sync (Alex -> Sam) ---');
    const test1Promise = new Promise((resolve) => {
      samSocket.once('music_state_updated', (data) => {
        console.log('📱 Sam received music_state_updated:', data.action);
        resolve(data.action === 'SELECT_SONG' && data.senderName === 'Alex');
      });
    });

    alexSocket.emit('music_action', {
      action: 'SELECT_SONG',
      currentSong: { id: 2, title: 'Romantic Serenade', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' }
    });
    const t1Ok = await test1Promise;
    if (!t1Ok) throw new Error('Test 1 failed');
    console.log('✅ Test 1 Passed: Music selection synced from Alex to Sam!\n');
    await new Promise((r) => setTimeout(r, 200));

    // TEST 2: Video Selection Sync (Sam -> Alex)
    console.log('--- Test 2: Video Selection Sync (Sam -> Alex) ---');
    const test2Promise = new Promise((resolve) => {
      alexSocket.once('video_state_updated', (data) => {
        console.log('💻 Alex received video_state_updated:', data.action);
        resolve(data.action === 'SELECT_VIDEO' && data.senderName === 'Sam');
      });
    });

    samSocket.emit('video_action', {
      action: 'SELECT_VIDEO',
      currentVideo: { id: 2, title: 'For Bigger Blazes', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }
    });
    const t2Ok = await test2Promise;
    if (!t2Ok) throw new Error('Test 2 failed');
    console.log('✅ Test 2 Passed: Video selection synced from Sam to Alex!\n');
    await new Promise((r) => setTimeout(r, 200));

    // TEST 3: Video Play Sync (Sam -> Alex)
    console.log('--- Test 3: Video Play Sync (Sam -> Alex) ---');
    const test3Promise = new Promise((resolve) => {
      alexSocket.once('video_state_updated', (data) => {
        console.log('💻 Alex received video_state_updated:', data.action);
        resolve(data.action === 'PLAY' && data.senderName === 'Sam' && data.isPlaying === true);
      });
    });

    samSocket.emit('video_action', { action: 'PLAY', currentTime: 15.0 });
    const t3Ok = await test3Promise;
    if (!t3Ok) throw new Error('Test 3 failed');
    console.log('✅ Test 3 Passed: Video play synced from Sam to Alex!\n');
    await new Promise((r) => setTimeout(r, 200));

    // TEST 4: Video Seek (-10s / +10s / Seek) Sync (Alex -> Sam)
    console.log('--- Test 4: Video Seek (+10s) Sync (Alex -> Sam) ---');
    const test4Promise = new Promise((resolve) => {
      samSocket.once('video_state_updated', (data) => {
        console.log('📱 Sam received video_state_updated:', data.action, 'at time:', data.currentTime);
        resolve(data.action === 'SEEK' && data.senderName === 'Alex' && data.currentTime === 25.0);
      });
    });

    alexSocket.emit('video_action', { action: 'SEEK', currentTime: 25.0 });
    const t4Ok = await test4Promise;
    if (!t4Ok) throw new Error('Test 4 failed');
    console.log('✅ Test 4 Passed: Video 10s skip/seek synced from Alex to Sam!\n');
    await new Promise((r) => setTimeout(r, 200));

    // TEST 5: Video Pause Sync (Alex -> Sam)
    console.log('--- Test 5: Video Pause Sync (Alex -> Sam) ---');
    const test5Promise = new Promise((resolve) => {
      samSocket.once('video_state_updated', (data) => {
        console.log('📱 Sam received video_state_updated:', data.action);
        resolve(data.action === 'PAUSE' && data.senderName === 'Alex' && data.isPlaying === false);
      });
    });

    alexSocket.emit('video_action', { action: 'PAUSE', currentTime: 25.0 });
    const t5Ok = await test5Promise;
    if (!t5Ok) throw new Error('Test 5 failed');
    console.log('✅ Test 5 Passed: Video pause synced from Alex to Sam!\n');
    await new Promise((r) => setTimeout(r, 200));

    // TEST 6: Watch Live Chat Sync (Alex -> Sam)
    console.log('--- Test 6: Watch Live Chat Sync (Alex -> Sam) ---');
    const test6Promise = new Promise((resolve) => {
      samSocket.once('new_chat_message', (msg) => {
        console.log('📱 Sam received new_chat_message:', msg.text);
        resolve(msg.text === 'Watching this video live together!');
      });
    });

    alexSocket.emit('send_chat_message', { text: 'Watching this video live together!' });
    const t6Ok = await test6Promise;
    if (!t6Ok) throw new Error('Test 6 failed');
    console.log('✅ Test 6 Passed: Live Chat message received while watching video!\n');

    alexSocket.disconnect();
    samSocket.disconnect();

    console.log('🎉 ALL 6 TWO-USER MUSIC & VIDEO INTEGRATION TESTS PASSED 100% PERFECTLY!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
})();
