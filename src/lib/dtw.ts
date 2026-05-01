export type Sample = number[];

function dist(a: Sample, b: Sample): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    s += d * d;
  }
  return Math.sqrt(s);
}

export function dtw(seqA: Sample[], seqB: Sample[]): number {
  const n = seqA.length;
  const m = seqB.length;
  if (n === 0 || m === 0) return Infinity;

  const w = Math.max(Math.abs(n - m), Math.floor(Math.max(n, m) * 0.2));
  const INF = Infinity;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(INF));
  dp[0][0] = 0;

  for (let i = 1; i <= n; i++) {
    const jStart = Math.max(1, i - w);
    const jEnd = Math.min(m, i + w);
    for (let j = jStart; j <= jEnd; j++) {
      const cost = dist(seqA[i - 1], seqB[j - 1]);
      dp[i][j] = cost + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[n][m] / Math.max(n, m);
}

export function resample(seq: Sample[], targetLen: number): Sample[] {
  if (seq.length === 0) return [];
  if (seq.length === targetLen) return seq;
  const dim = seq[0].length;
  const out: Sample[] = [];
  for (let i = 0; i < targetLen; i++) {
    const t = (i * (seq.length - 1)) / (targetLen - 1);
    const lo = Math.floor(t);
    const hi = Math.min(seq.length - 1, lo + 1);
    const frac = t - lo;
    const s: Sample = new Array(dim);
    for (let d = 0; d < dim; d++) {
      s[d] = seq[lo][d] * (1 - frac) + seq[hi][d] * frac;
    }
    out.push(s);
  }
  return out;
}

export function normalize(seq: Sample[]): Sample[] {
  if (seq.length === 0) return [];
  const dim = seq[0].length;
  const means = new Array(dim).fill(0);
  const stds = new Array(dim).fill(0);
  for (const s of seq) for (let d = 0; d < dim; d++) means[d] += s[d];
  for (let d = 0; d < dim; d++) means[d] /= seq.length;
  for (const s of seq) for (let d = 0; d < dim; d++) stds[d] += (s[d] - means[d]) ** 2;
  for (let d = 0; d < dim; d++) stds[d] = Math.sqrt(stds[d] / seq.length) || 1;
  return seq.map(s => s.map((v, d) => (v - means[d]) / stds[d]));
}

export function preprocess(seq: Sample[], targetLen = 64): Sample[] {
  return normalize(resample(seq, targetLen));
}
