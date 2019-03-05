const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const genres = require('koa-res');
const route = require('koa-route');
const child = require('child_process');
const util = require('util');
const process = require('process');

const exec = util.promisify(child.exec);
const gdnsdctl = (cmd, params = []) => exec(`gdnsdctl ${cmd} ${params.join(' ')}`);

const app = new Koa();

app.use(bodyParser());
app.use(genres());

app.use(route.get('/status', async (ctx) => {
  const { stderr } = await gdnsdctl('status');

  return { status: stderr };
}));

app.use(route.get('/stats', async (ctx) => {
  const { stdout } = await gdnsdctl('stats');
  console.log(stdout);

  return JSON.parse(stdout);
}));

app.use(route.get('/states', async (ctx) => {
  const { stdout } = await gdnsdctl('states');

  return JSON.parse(stdout);
}));

app.use(route.post('/acme-dns-01', async (ctx) => {
  const { stderr } = await gdnsdctl('acme-dns-01', ctx.body);

  return { status: stderr };
}));

app.use(route.delete('/acme-dns-01-flush', async (ctx) => {
  const { stderr } = await gdnsdctl('acme-dns-01-flush');

  return { status: stderr };
}));

app.use(route.put('/replace', async (ctx) => {
  const { stderr } = await gdnsdctl('replace');

  return { status: stderr };
}));

app.use(route.put('/reload-zones', async (ctx) => {
  const { stderr } = await gdnsdctl('reload-zones');

  return { status: stderr };
}));

app.use(route.put('/stop', async (ctx) => {
  const { stderr } = await gdnsdctl('stop');

  return { status: stderr };
}));

const daemon = child.spawn('gdnsd', ['start']);

daemon.stdout.on('data', (data) => console.log('gdnsd:', data.toString()));
daemon.stderr.on('data', (data) => console.error('gdnsd:', data.toString()));

daemon.on('close', (code) => process.exit(code));

app.listen(3000);
