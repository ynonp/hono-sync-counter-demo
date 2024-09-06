import { Hono } from "hono"
import { streamSSE, SSEStreamingApi } from 'hono/streaming'
import { serveStatic } from 'hono/deno'

const app = new Hono();

const clients: Array<SSEStreamingApi> = [];

app.use('/client/*', serveStatic({ root: './'}));

app.post('/count', async (c) => {  
  console.log(`POST /count`);
  const { value } = await c.req.json();
  console.log(`Got ${value}`);

  clients.forEach(c => {
    c.writeSSE({ data: value });
  })
  
  return c.json({ message: 'Value received' });
})

app.get('/count', (c) => {
  return streamSSE(c, async (stream) => {
    stream.writeln("data: Start\n\n");
    clients.push(stream);
    const id = clients.length - 1;

    stream.onAbort(() => {
      clients.splice(id, 1);
      console.log(`removed client ${id}`);
    });
    
    while(true) {
      await stream.sleep(1000);
    }
  })
})

Deno.serve(app.fetch)
