const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { WebSocketServer } = require('ws');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  const wss = new WebSocketServer({ server, path: '/ws' });

  const rooms = new Map();
  const clients = new Map();

  function genCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return rooms.has(code) ? genCode() : code;
  }

  function broadcast(room, msg, exclude) {
    const r = rooms.get(room);
    if (!r) return;
    const data = typeof msg === 'string' ? msg : JSON.stringify(msg);
    for (const [ws] of r.members) {
      if (ws !== exclude && ws.readyState === 1) ws.send(data);
    }
  }

  wss.on('connection', (ws) => {
    ws._alive = true;
    ws.on('pong', () => { ws._alive = true; });

    ws.on('message', (raw) => {
      let msg;
      try { msg = JSON.parse(raw); } catch { return; }

      switch (msg.type) {
        case 'create': {
          const code = genCode();
          rooms.set(code, { host: ws, members: new Map([[ws, { id: 'host', name: msg.name || 'Host' }]]), state: null });
          clients.set(ws, { room: code, id: 'host' });
          ws.send(JSON.stringify({ type: 'created', code, id: 'host' }));
          console.log(`[WS] Room ${code} created by ${msg.name || 'Host'}`);
          break;
        }

        case 'join': {
          const code = (msg.code || '').toUpperCase();
          const room = rooms.get(code);
          if (!room) { ws.send(JSON.stringify({ type: 'error', msg: 'Room not found' })); break; }
          if (room.members.size >= 4) { ws.send(JSON.stringify({ type: 'error', msg: 'Room full' })); break; }
          const id = 'p' + room.members.size;
          room.members.set(ws, { id, name: msg.name || ('Player ' + room.members.size) });
          clients.set(ws, { room: code, id });
          ws.send(JSON.stringify({ type: 'joined', code, id, members: Array.from(room.members.values()).map(m => ({ id: m.id, name: m.name })) }));
          broadcast(code, { type: 'member_joined', id, name: msg.name || id, members: Array.from(room.members.values()).map(m => ({ id: m.id, name: m.name })) }, ws);
          console.log(`[WS] ${msg.name || id} joined room ${code} as ${id}`);
          break;
        }

        case 'state': {
          const ci = clients.get(ws);
          if (!ci) break;
          const room = rooms.get(ci.room);
          if (!room || ci.id !== 'host') break;
          room.state = msg.data;
          broadcast(ci.room, { type: 'state', data: msg.data }, ws);
          break;
        }

        case 'input': {
          const ci = clients.get(ws);
          if (!ci || ci.id === 'host') break;
          const room = rooms.get(ci.room);
          if (!room) break;
          if (room.host && room.host.readyState === 1) {
            room.host.send(JSON.stringify({ type: 'input', id: ci.id, data: msg.data }));
          }
          break;
        }

        case 'ping': {
          ws.send(JSON.stringify({ type: 'pong', t: Date.now() }));
          break;
        }

        case 'chat': {
          const ci = clients.get(ws);
          if (!ci) break;
          const room = rooms.get(ci.room);
          if (!room) break;
          broadcast(ci.room, { type: 'chat', id: ci.id, name: room.members.get(ws)?.name, msg: (msg.msg || '').slice(0, 200) });
          break;
        }

        case 'leave': {
          handleDisconnect(ws);
          break;
        }
      }
    });

    ws.on('close', () => handleDisconnect(ws));
    ws.on('error', () => handleDisconnect(ws));
  });

  function handleDisconnect(ws) {
    const ci = clients.get(ws);
    if (!ci) return;
    const room = rooms.get(ci.room);
    if (room) {
      room.members.delete(ws);
      if (room.members.size === 0) {
        rooms.delete(ci.room);
        console.log(`[WS] Room ${ci.room} destroyed (empty)`);
      } else if (ci.id === 'host') {
        broadcast(ci.room, { type: 'host_left' });
        rooms.delete(ci.room);
        console.log(`[WS] Room ${ci.room} destroyed (host left)`);
      } else {
        broadcast(ci.room, { type: 'member_left', id: ci.id, name: room.members.get(ws)?.name });
      }
    }
    clients.delete(ws);
  }

  // Heartbeat every 30s
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws._alive) return ws.terminate();
      ws._alive = false;
      ws.ping();
    });
  }, 30000);
  wss.on('close', () => clearInterval(interval));

  server.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
