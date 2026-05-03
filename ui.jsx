// MealPick — UI primitives and shared bits
// Note: each component file uses uniquely-named style objects to avoid global collisions.

const mpUI = {
  // colors
  ink: 'oklch(0.22 0.02 130)',
  ink2: 'oklch(0.42 0.02 130)',
  ink3: 'oklch(0.62 0.02 130)',
  paper: 'oklch(0.985 0.008 95)',
  paper2: 'oklch(0.96 0.012 95)',
  line: 'oklch(0.90 0.012 95)',
  green: 'oklch(0.62 0.14 145)',
  greenSoft: 'oklch(0.92 0.07 145)',
  citrus: 'oklch(0.85 0.16 95)',
  citrusSoft: 'oklch(0.95 0.08 95)',
  coral: 'oklch(0.72 0.14 35)',
  // type
  display: '"Bricolage Grotesque", "Geist", -apple-system, system-ui, sans-serif',
  body: '-apple-system, "Inter", system-ui, sans-serif',
  mono: '"JetBrains Mono", "Geist Mono", ui-monospace, monospace',
};

// ── Pill / Chip ─────────────────────────────────────────────────────────────
function MPChip({ children, active, onClick, size = 'md', variant = 'default' }) {
  const padX = size === 'sm' ? 10 : 14;
  const padY = size === 'sm' ? 5 : 8;
  const fontSize = size === 'sm' ? 12 : 13;
  const bg =
    variant === 'ghost' ? 'transparent' :
    active ? mpUI.ink : mpUI.paper;
  const fg = active ? mpUI.paper : mpUI.ink;
  const border = active ? mpUI.ink : mpUI.line;
  return (
    <button
      onClick={onClick}
      style={{
        appearance: 'none', border: `1px solid ${border}`, background: bg, color: fg,
        padding: `${padY}px ${padX}px`, borderRadius: 999, fontSize, fontWeight: 500,
        fontFamily: mpUI.body, cursor: 'pointer', display: 'inline-flex',
        alignItems: 'center', gap: 6, transition: 'all .12s ease', whiteSpace: 'nowrap',
      }}>
      {children}
    </button>
  );
}

// ── Tag (small label) ───────────────────────────────────────────────────────
function MPTag({ children, color = mpUI.greenSoft, fg = mpUI.ink }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600,
      background: color, color: fg, fontFamily: mpUI.mono,
      letterSpacing: '0.02em', textTransform: 'lowercase',
    }}>{children}</span>
  );
}

// ── Stat row ────────────────────────────────────────────────────────────────
function MPStat({ label, value, accent }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: mpUI.ink3, fontFamily: mpUI.mono }}>{label}</span>
      <span style={{ fontSize: 16, fontWeight: 700, color: accent || mpUI.ink,
        fontFamily: mpUI.display, letterSpacing: '-0.01em' }}>{value}</span>
    </div>
  );
}

// ── Status bar (mock iOS) ──────────────────────────────────────────────────
function MPStatusBar({ light }) {
  const c = light ? '#fff' : mpUI.ink;
  return (
    <div style={{
      height: 44, padding: '0 22px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', fontFamily: mpUI.body, fontSize: 14,
      fontWeight: 600, color: c,
    }}>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {/* signal */}
        <svg width="16" height="10" viewBox="0 0 16 10"><g fill={c}>
          <rect x="0" y="7" width="2.5" height="3" rx="0.5"/>
          <rect x="4" y="5" width="2.5" height="5" rx="0.5"/>
          <rect x="8" y="3" width="2.5" height="7" rx="0.5"/>
          <rect x="12" y="0" width="2.5" height="10" rx="0.5"/>
        </g></svg>
        {/* wifi */}
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke={c} strokeWidth="1.4">
          <path d="M1 4 Q7 -1 13 4"/>
          <path d="M3 6 Q7 3 11 6"/>
          <circle cx="7" cy="8.5" r="0.8" fill={c}/>
        </svg>
        {/* battery */}
        <svg width="22" height="10" viewBox="0 0 22 10">
          <rect x="0.5" y="0.5" width="18" height="9" rx="2" fill="none" stroke={c} strokeOpacity="0.5"/>
          <rect x="2" y="2" width="14" height="6" rx="1" fill={c}/>
          <rect x="19.5" y="3.5" width="1.5" height="3" rx="0.5" fill={c} fillOpacity="0.5"/>
        </svg>
      </span>
    </div>
  );
}

// ── App top bar ─────────────────────────────────────────────────────────────
function MPAppBar({ title = 'MealPick' }) {
  return (
    <div style={{
      height: 48, padding: '0 22px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', borderBottom: `1px solid ${mpUI.line}`,
      background: mpUI.paper, color: mpUI.ink,
    }}>
      <div style={{ fontFamily: mpUI.display, fontSize: 18, fontWeight: 700,
        letterSpacing: '-0.01em' }}>
        {title}
      </div>
    </div>
  );
}

// ── Bottom nav ──────────────────────────────────────────────────────────────
function MPBottomNav({ active, onChange }) {
  const items = [
    { id: 'home', label: 'Pick', icon: 'M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z' },
    { id: 'pantry', label: 'Pantry', icon: 'M5 4h14v6H5zm0 10h14v6H5z' },
    { id: 'history', label: 'Saved', icon: 'M6 3h12v18l-6-3.5L6 21z' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 64, display: 'flex', justifyContent: 'space-around',
      alignItems: 'center', background: mpUI.paper,
      borderTop: `1px solid ${mpUI.line}`, paddingBottom: 6,
    }}>
      {items.map((it) => {
        const on = active === it.id;
        return (
          <button key={it.id} onClick={() => onChange(it.id)}
            style={{ appearance: 'none', border: 0, background: 'transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '6px 14px', cursor: 'pointer',
              color: on ? mpUI.ink : mpUI.ink3 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={on ? 2.2 : 1.7} strokeLinejoin="round" strokeLinecap="round">
              <path d={it.icon}/>
            </svg>
            <span style={{ fontSize: 10, fontWeight: on ? 700 : 500,
              fontFamily: mpUI.mono, textTransform: 'lowercase', letterSpacing: '0.04em' }}>
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Section header ──────────────────────────────────────────────────────────
function MPSectionHeader({ kicker, title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      marginBottom: 12, padding: '0 22px' }}>
      <div>
        {kicker && <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: mpUI.ink3, fontFamily: mpUI.mono,
          marginBottom: 4 }}>{kicker}</div>}
        <div style={{ fontSize: 18, fontWeight: 600, color: mpUI.ink,
          fontFamily: mpUI.display, letterSpacing: '-0.01em' }}>{title}</div>
      </div>
      {action}
    </div>
  );
}

// ── Mode tile ──────────────────────────────────────────────────────────────
function MPModeTile({ mode, active, onClick, density }) {
  const compact = density === 'compact';
  return (
    <button onClick={onClick}
      style={{
        appearance: 'none', border: `1.5px solid ${active ? mpUI.ink : mpUI.line}`,
        background: active ? mode.color : mpUI.paper,
        borderRadius: compact ? 14 : 18,
        padding: compact ? '10px 12px' : '14px 14px',
        cursor: 'pointer', textAlign: 'left',
        display: 'flex', flexDirection: 'column', gap: compact ? 2 : 6,
        position: 'relative', transition: 'all .15s ease',
        boxShadow: active ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: compact ? 18 : 22, color: mpUI.ink, lineHeight: 1 }}>{mode.icon}</span>
        {active && <span style={{ width: 8, height: 8, borderRadius: 4, background: mpUI.ink }}/>}
      </div>
      <div style={{ fontSize: compact ? 13 : 15, fontWeight: 700, color: mpUI.ink,
        fontFamily: mpUI.display, letterSpacing: '-0.01em' }}>{mode.name}</div>
      {!compact && (
        <div style={{ fontSize: 11, color: mpUI.ink2, fontFamily: mpUI.body }}>{mode.blurb}</div>
      )}
    </button>
  );
}

Object.assign(window, {
  mpUI, MPChip, MPTag, MPStat, MPStatusBar, MPAppBar, MPBottomNav,
  MPSectionHeader, MPModeTile,
});
