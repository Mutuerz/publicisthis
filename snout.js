// Browser runtime for the neural image checks (preview only; phones use
// LiteRT): Snout in ./snout/ and Community Forensics in ./commfor/.
// The model weights are stored as base64 fp16 chunks and widened to fp32 here.
(function () {
  function loadScript(src) {
    return new Promise((ok, fail) => {
      const s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = fail;
      document.head.appendChild(s);
    });
  }
  function halfTable() {
    const t = new Float32Array(65536);
    for (let h = 0; h < 65536; h++) {
      const s = h & 0x8000 ? -1 : 1, e = (h >> 10) & 0x1f, f = h & 0x3ff;
      t[h] = e === 0 ? s * Math.pow(2, -14) * (f / 1024)
        : e === 31 ? (f ? NaN : s * Infinity)
        : s * Math.pow(2, e - 15) * (1 + f / 1024);
    }
    return t;
  }
  async function fetchB64(url) {
    const s = atob(await (await fetch(url)).text());
    const u = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
    return u.buffer;
  }
  let ortReady = null;
  function loadOrt(base) {
    if (!ortReady) ortReady = (async () => {
      await loadScript(base + 'ort/ort.wasm.min.js');
      ort.env.wasm.wasmPaths = new URL(base + 'ort/', document.baseURI).href;
      if (!self.crossOriginIsolated) ort.env.wasm.numThreads = 1;
    })();
    return ortReady;
  }
  // Each model folder holds <name>.json (graph, external, parts, and
  // optionally input/output names), the graph and fp16 weight chunks.
  const models = {};
  async function load(base, name) {
    const m = models[name] || (models[name] = {});
    if (m.session) return true;
    if (!m.loading) m.loading = (async () => {
      const meta = await (await fetch(base + name + '.json')).json();
      // ONNX Runtime ships once, in snout/ort/.
      await loadOrt('snout/');
      const parts = await Promise.all(meta.parts.map(p => fetchB64(base + p)));
      const total = parts.reduce((a, b) => a + b.byteLength, 0) / 2;
      const f32 = new Float32Array(total);
      const t = halfTable();
      let o = 0;
      for (const p of parts) {
        const u = new Uint16Array(p);
        for (let i = 0; i < u.length; i++) f32[o++] = t[u[i]];
      }
      const graph = new Uint8Array(await fetchB64(base + meta.graph));
      m.session = await ort.InferenceSession.create(graph, {
        executionProviders: ['wasm'],
        externalData: [{ path: meta.external, data: new Uint8Array(f32.buffer) }],
      });
      m.input = meta.input || 'crops';
      m.output = meta.output || 'logits';
      return true;
    })();
    try { return await m.loading; } catch (e) { console.warn(name + ' unavailable', e); m.loading = null; return false; }
  }
  async function run(name, data, n, size) {
    const m = models[name];
    const out = await m.session.run({ [m.input]: new ort.Tensor('float32', data, [n, size, size, 3]) });
    return out[m.output].data;
  }
  window.neuralModels = { load, run };
  // Older builds call window.snout directly.
  window.snout = {
    load: (base) => load(base, 'snout_v1'),
    run: (data, n) => run('snout_v1', data, n, 224),
  };
})();
