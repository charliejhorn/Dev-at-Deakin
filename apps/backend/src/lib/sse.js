// simple sse clients registry and helpers
const clients = new Set();

function addClient(res) {
  clients.add(res);
  return () => clients.delete(res);
}

function heartbeatInterval(res) {
  const iv = setInterval(() => {
    try {
      res.write(`:\n\n`);
    } catch (_) {
      clearInterval(iv);
    }
  }, Number(process.env.SSE_HEARTBEAT_MS || 15000));
  return iv;
}

function emitJobStatus(evt) {
  const line = `event: job_status\n` + `data: ${JSON.stringify(evt)}\n\n`;
  for (const res of clients) {
    try {
      res.write(line);
    } catch (_) {
      /* ignore broken pipe */
    }
  }
}

module.exports = { addClient, heartbeatInterval, emitJobStatus };
