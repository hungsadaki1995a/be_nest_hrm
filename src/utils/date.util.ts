export const parseDurationToSeconds = (
  raw: unknown,
  fallback: number,
): number => {
  if (raw == null) return fallback;
  if (typeof raw === 'number') return raw;
  const s =
    typeof raw === 'string' || typeof raw === 'number'
      ? String(raw).trim()
      : '';
  const m = s.match(/^(\d+)\s*([smhdwy])?$/i);
  if (!m) return fallback;
  const val = Number(m[1]);
  const unit = (m[2] || 's').toLowerCase();
  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 60 * 60 * 24 * 7,
    y: 60 * 60 * 24 * 365,
  };
  const mul = multipliers[unit] ?? 1;
  return val * mul;
};
