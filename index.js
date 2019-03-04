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

console.log(app);

app.use(bodyParser());
app.use(genres());

app.use(route.get('/status', async (ctx) => {
  const { stderr } = await exec('status');

  return { status: stderr };
}));

app.use(route.get('/stats', async (ctx) => {
  const { stdout } = await exec('stats');

  return JSON.parse(stdout);
}));

app.use(route.get('/states', async (ctx) => {
  const { stdout } = await exec('states');

  return JSON.parse(stdout);
}));

app.use(route.post('/acme-dns-01', async (ctx) => {
  const { stderr } = await exec('acme-dns-01', ctx.body);

  return { status: stderr };
}));

app.use(route.delete('/acme-dns-01-flush', async (ctx) => {
  const { stderr } = await exec('acme-dns-01-flush');

  return { status: stderr };
}));

app.use(route.put('/replace', async (ctx) => {
  const { stderr } = await exec('replace');

  return { status: stderr };
}));

app.use(route.put('/reload-zones', async (ctx) => {
  const { stderr } = await exec('reload-zones');

  return { status: stderr };
}));

app.use(route.put('/stop', async (ctx) => {
  const { stderr } = await exec('stop');

  return { status: stderr };
}));

const daemon = child.spawn('gdnsd', ['start']);

daemon.stdout.on('data', (data) => console.log('gdnsd:', data));
daemon.stderr.on('data', (data) => console.error('gdnsd:', data));

daemon.on('close', (code) => process.exit(code));

app.listen(3000);
