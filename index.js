const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const genres = require("koa-res");
const route = require("koa-route");
const child = require("child_process");
const util = require("util");
const process = require("process");
const zonefile = require("dns-zonefile");
const fs = require("fs").promises;

const exec = util.promisify(child.exec);
const gdnsdctl = (cmd, params = []) =>
  exec(`gdnsdctl ${cmd} ${params.join(" ")}`);

const app = new Koa();

app.use(bodyParser());
app.use(genres());

app.use(
  route.get("/status", async (ctx) => {
    const { stderr } = await gdnsdctl("status");

    ctx.body = { status: stderr };
  })
);

app.use(
  route.get("/stats", async (ctx) => {
    const { stdout } = await gdnsdctl("stats");

    ctx.body = JSON.parse(stdout);
  })
);

app.use(
  route.get("/states", async (ctx) => {
    const { stdout } = await gdnsdctl("states");

    ctx.body = JSON.parse(stdout);
  })
);

app.use(
  route.post("/acme-dns-01", async (ctx) => {
    const { stderr } = await gdnsdctl("acme-dns-01", ctx.request.body);

    ctx.body = { status: stderr };
  })
);

app.use(
  route.delete("/acme-dns-01-flush", async (ctx) => {
    const { stderr } = await gdnsdctl("acme-dns-01-flush");

    ctx.body = { status: stderr };
  })
);

app.use(
  route.put("/replace", async (ctx) => {
    const { stderr } = await gdnsdctl("replace");

    ctx.body = { status: stderr };
  })
);

app.use(
  route.put("/reload-zones", async (ctx) => {
    const { stderr } = await gdnsdctl("reload-zones");

    ctx.body = { status: stderr };
  })
);

app.use(
  route.put("/stop", async (ctx) => {
    const { stderr } = await gdnsdctl("stop");

    ctx.body = { status: stderr };
  })
);

app.use(
  route.post("/zone", async (ctx) => {
    const output = zonefile.generate(ctx.request.body);
    await fs.writeFile(
      `/etc/gdnsd/zones/${ctx.request.body.$origin}.zone`,
      output
    );

    const { stderr } = await gdnsdctl("reload-zones");

    ctx.body = { status: stderr };
  })
);

app.use(
  route.delete("/zone/:origin", async (ctx) => {
    await fs.rm(`/etc/gdnsd/zones/${ctx.params.origin}.zone`);

    const { stderr } = await gdnsdctl("reload-zones");

    ctx.body = { status: stderr };
  })
);

const daemon = child.spawn("gdnsd", ["start"]);

daemon.stdout.on("data", (data) => console.log("gdnsd:", data.toString()));
daemon.stderr.on("data", (data) => console.error("gdnsd:", data.toString()));

daemon.on("close", (code) => process.exit(code));

app.listen(3000);
