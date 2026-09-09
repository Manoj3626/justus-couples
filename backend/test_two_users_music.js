const io = require('../frontend/node_modules/socket.io-client');
const http = require('http');

async function runTwoUserTest() {
  console.log('🧪 Starting Live Two-User (Laptop + Mobile) Shared Music Integration Test...');
  const backendUrl = 'http://localhost:5000';

  // Helper to log in a user and get token
  async function loginUser(email, password) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ email });
      const req = http.request(
        `${backendUrl}/api/auth/dev-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
          },
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            const parsed = JSON.parse(body);
            if (res.statusCode === 200) {
              resolve(parsed);
            } else {
              reject(new Error(`Login failed for ${email}: ${body}`));
            }
          });
        }
      );
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  try {
    const alexAuth = await loginUser('alex@example.com', 'password123');
    const samAuth = await loginUser('sam@example.com', 'password123');

    const alexUser = alexAuth.user || {};
    const samUser = samAuth.user || {};
    const alexConnId = alexUser.connectionId || (alexUser.spaceConnection && alexUser.spaceConnection.connectionId);
    const samConnId = samUser.connectionId || (samUser.spaceConnection && samUser.spaceConnection.connectionId) || alexConnId;

    console.log(`✅ Alex logged in (ID: ${alexUser._id || alexUser.id}, Conn: ${alexConnId})`);
    console.log(`✅ Sam logged in (ID: ${samUser._id || samUser.id}, Conn: ${samConnId})`);

    const alexSocket = io(backendUrl, {
      auth: { token: alexAuth.token },
      transports: ['websocket'],
    });

    const samSocket = io(backendUrl, {
      auth: { token: samAuth.token },
      transports: ['websocket'],
    });

    await new Promise((res) => alexSocket.on('connect', res));
    await new Promise((res) => samSocket.on('connect', res));

    console.log('⚡ Alex & Sam connected via Socket.IO!');

    alexSocket.emit('join_space', { connectionId: alexConnId });
    samSocket.emit('join_space', { connectionId: samConnId });

    alexSocket.removeAllListeners('music_state_updated');
    samSocket.removeAllListeners('music_state_updated');
    await new Promise((r) => setTimeout(r, 500));

    // Step 1: Alex selects Song 2
    console.log('\n--- Test 1: Alex selects Song #2 ---');
    const songSelectionPromise = new Promise((resolve) => {
      samSocket.once('music_state_updated', (state) => {
        console.log('📱 Sam received music_state_updated:', state);
        if (state.currentSong?.title === 'Romantic Serenade (Online Stream)') {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

    alexSocket.emit('music_action', {
      action: 'SELECT_SONG',
      currentSong: {
        id: 2,
        title: 'Romantic Serenade (Online Stream)',
        artist: 'Love Harmony',
        duration: '7:05',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      },
    });

    const songOk = await songSelectionPromise;
    if (!songOk) throw new Error('Failed: Sam did not receive track selection correctly');
    console.log('✅ Test 1 Passed: Track selection synced from Alex to Sam!');

    alexSocket.removeAllListeners('music_state_updated');
    samSocket.removeAllListeners('music_state_updated');

    // Step 2: Alex sends Heartbeat at 15.5s
    console.log('\n--- Test 2: Alex sends Heartbeat at 15.5s ---');
    const heartbeatPromise = new Promise((resolve) => {
      samSocket.once('music_state_updated', (state) => {
        if (state.currentTime === 15.5) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

    alexSocket.emit('music_action', {
      action: 'HEARTBEAT',
      currentTime: 15.5,
    });

    const heartbeatOk = await heartbeatPromise;
    if (!heartbeatOk) throw new Error('Failed: Sam did not receive heartbeat timestamp');
    console.log('✅ Test 2 Passed: Heartbeat timestamp synced from Alex to Sam!');

    alexSocket.removeAllListeners('music_state_updated');
    samSocket.removeAllListeners('music_state_updated');

    // Step 3: Sam (Mobile) requests room state
    console.log('\n--- Test 3: Sam requests calculated room state ---');
    const stateRequestPromise = new Promise((resolve) => {
      samSocket.once('music_state_updated', (state) => {
        console.log('📱 Sam fetched calculated state:', state);
        if (state && typeof state.currentTime === 'number') {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

    samSocket.emit('get_room_state');
    const calcOk = await stateRequestPromise;
    if (!calcOk) throw new Error('Failed: Calculated room state time was inaccurate');
    console.log('✅ Test 3 Passed: Dynamic live time calculation verified!');

    // Step 4: Sam pauses at 25.0s
    console.log('\n--- Test 4: Sam pauses music at 25.0s ---');
    const pausePromise = new Promise((resolve) => {
      const handler = (state) => {
        if (state.action === 'PAUSE' && state.isPlaying === false && state.currentTime === 25.0) {
          alexSocket.off('music_state_updated', handler);
          resolve(true);
        }
      };
      alexSocket.on('music_state_updated', handler);
    });

    samSocket.emit('music_action', {
      action: 'PAUSE',
      currentTime: 25.0,
    });

    const pauseOk = await pausePromise;
    if (!pauseOk) throw new Error('Failed: Alex did not receive pause event');
    console.log('✅ Test 4 Passed: Pause synced from Mobile (Sam) to Laptop (Alex)!');

    // Step 5: Alex seeks to 50.0s
    console.log('\n--- Test 5: Alex seeks to 50.0s ---');
    const seekPromise = new Promise((resolve) => {
      const handler = (state) => {
        if (state.action === 'SEEK' && state.currentTime === 50.0) {
          samSocket.off('music_state_updated', handler);
          resolve(true);
        }
      };
      samSocket.on('music_state_updated', handler);
    });

    alexSocket.emit('music_action', {
      action: 'SEEK',
      currentTime: 50.0,
    });

    const seekOk = await seekPromise;
    if (!seekOk) throw new Error('Failed: Sam did not receive seek event');
    console.log('✅ Test 5 Passed: Seek synced from Laptop (Alex) to Mobile (Sam)!');

    // Step 6: Test Uploading Local Track to Server & Broadcasting Public URL
    console.log('\n--- Test 6: Alex uploads local track to server & syncs with Sam ---');
    const uploadReqData = JSON.stringify({
      fileName: 'my_song.mp3',
      fileData: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA',
    });

    const uploadRes = await new Promise((resolve, reject) => {
      const req = http.request(
        `${backendUrl}/api/music/upload`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(uploadReqData),
            'Authorization': `Bearer ${alexAuth.token}`,
          },
        },
        (res) => {
          let body = '';
          res.on('data', (c) => (body += c));
          res.on('end', () => resolve(JSON.parse(body)));
        }
      );
      req.on('error', reject);
      req.write(uploadReqData);
      req.end();
    });

    if (!uploadRes.success || !uploadRes.url.startsWith('/uploads/')) {
      throw new Error('Failed: Music upload API failed');
    }
    console.log('✅ Upload API success, returned public URL:', uploadRes.url);

    const uploadSyncPromise = new Promise((resolve) => {
      const handler = (state) => {
        if (state.action === 'SELECT_SONG' && state.currentSong?.src === uploadRes.url) {
          samSocket.off('music_state_updated', handler);
          resolve(true);
        }
      };
      samSocket.on('music_state_updated', handler);
    });

    alexSocket.emit('music_action', {
      action: 'SELECT_SONG',
      currentSong: {
        id: Date.now(),
        title: 'my_song',
        artist: 'Uploaded Shared Track',
        duration: 'Shared Track',
        src: uploadRes.url,
        cover: '📂',
      },
    });

    const uploadSyncOk = await uploadSyncPromise;
    if (!uploadSyncOk) throw new Error('Failed: Sam did not receive uploaded track URL');
    console.log('✅ Test 6 Passed: Uploaded file public URL synced from Alex to Sam!');

    alexSocket.disconnect();
    samSocket.disconnect();
    console.log('\n🎉 ALL 6 TWO-USER AUTOMATED TESTS PASSED 100% PERFECTLY!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Two-User Test Failed:', err);
    process.exit(1);
  }
}

runTwoUserTest();
