// MealPick — Home screen (input)
// Two layout variants ("stacked" and "compact") via the `variant` prop.

function MPHomeScreen({ state, setState, mode, density, onSuggest, onPantry, onProfile, onNav, showStatusBar = false, apiStatus = 'fallback', variant = 'stacked' }) {
  const ui = mpUI;
  const compact = density === 'compact';
  const ingCount = state.pantry.length;

  // Greeting copy — direct & blunt
  const headline = variant === 'compact'
    ? "What's it gonna be?"
    : "Stop thinking.";
  const sub = variant === 'compact'
    ? 'Three picks. Ten seconds.'
    : 'Eat this.';

  return (
    <div style={{
      position: 'absolute', inset: 0, background: ui.paper,
      display: 'flex', flexDirection: 'column',
      fontFamily: ui.body, color: ui.ink, overflow: 'hidden',
    }}>
      {showStatusBar && <MPStatusBar />}

      {/* Top: greeting + meta */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 190,
        display: 'flex', flexDirection: 'column', gap: compact ? 16 : 22 }}>
        {!showStatusBar && <div style={{ padding: '18px 22px 0',
          fontFamily: ui.display, fontSize: 20, fontWeight: 700,
          letterSpacing: '-0.01em', color: ui.ink }}>
          MealPick
        </div>}

        <div style={{ padding: `${showStatusBar ? 6 : 4}px 22px 0`, display: 'flex',
        justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: ui.display, fontSize: variant === 'compact' ? 30 : 38,
              fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.98,
              margin: 0, color: ui.ink }}>
              {headline}<br/>
              <span style={{ color: ui.green }}>{sub}</span>
            </h1>
          </div>
          <button onClick={onProfile} aria-label="Open profile" style={{
            appearance: 'none', border: `1px solid ${ui.line}`, background: ui.paper,
            width: 38, height: 38, borderRadius: 19, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: ui.ink,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="8" r="3"/>
              <path d="M5 21a7 7 0 0 1 14 0"/>
            </svg>
          </button>
        </div>

        {/* MODES */}
        <div>
          <MPSectionHeader kicker="01 / mood" title="Pick a mode" />
          <div style={{ padding: '0 22px', display: 'grid',
            gridTemplateColumns: '1fr 1fr', gap: compact ? 8 : 10 }}>
            {MODES.map((m) => (
              <MPModeTile key={m.id} mode={m} density={density}
                active={mode === m.id}
                onClick={() => setState((s) => ({ ...s, mode: m.id }))} />
            ))}
          </div>
        </div>

        {/* BUDGET + TIME — two big sliders */}
        <div>
          <MPSectionHeader kicker="02 / limits" title="Budget & time" />
          <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column',
            gap: compact ? 10 : 14 }}>
            <MPSlider label={`Max budget · ${state.profile?.servings || 1} serving${(state.profile?.servings || 1) === 1 ? '' : 's'} total`} value={state.budget} min={1} max={30} step={0.5}
              format={(v) => `€${v.toFixed(2)}`}
              onChange={(v) => setState((s) => ({ ...s, budget: v }))} />
            <MPSlider label="Max time" value={state.time} min={5} max={45} step={1}
              format={(v) => `${v} min`}
              onChange={(v) => setState((s) => ({ ...s, time: v }))} />
          </div>
        </div>

        {/* PANTRY peek */}
        <div>
          <MPSectionHeader kicker="03 / fridge" title="What's at home?"
            action={
              <button onClick={onPantry} style={{ appearance: 'none', border: 0,
                background: 'transparent', color: ui.ink2, fontSize: 12, fontWeight: 600,
                fontFamily: ui.body, cursor: 'pointer' }}>
                edit ↗
              </button>
            } />
          <div style={{ padding: '0 22px' }}>
            <div style={{
              borderRadius: 18, padding: '14px 16px',
              background: ui.greenSoft, border: `1px solid ${ui.line}`,
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'baseline' }}>
                <span style={{ fontSize: 12, fontFamily: ui.mono, fontWeight: 600,
                  color: ui.ink2, letterSpacing: '0.04em' }}>
                  {ingCount} ingredients · saved pantry
                </span>
                <span style={{ fontSize: 11, fontFamily: ui.mono, color: ui.ink3 }}>
                  per session
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {state.pantry.slice(0, 8).map((id) => {
                  const it = getPantryItem(id);
                  if (!it) return null;
                  return (
                    <span key={id} style={{
                      background: ui.paper, borderRadius: 999, padding: '4px 10px',
                      fontSize: 12, fontWeight: 500, color: ui.ink,
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      border: `1px solid ${ui.line}`,
                    }}>
                      <span>{it.emoji}</span>{it.name}
                    </span>
                  );
                })}
                {ingCount > 8 && (
                  <span style={{ fontSize: 12, fontFamily: ui.mono, color: ui.ink2,
                    padding: '4px 4px' }}>
                    +{ingCount - 8} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ position: 'absolute', bottom: 64, left: 0, right: 0,
        padding: '12px 22px 14px',
        background: `linear-gradient(to top, ${ui.paper} 60%, ${ui.paper}00)` }}>
        <button onClick={onSuggest}
          style={{
            width: '100%', appearance: 'none', border: 0, cursor: 'pointer',
            background: ui.ink, color: ui.paper, padding: '18px 22px',
            borderRadius: 18, fontSize: 17, fontWeight: 700,
            fontFamily: ui.display, letterSpacing: '-0.01em',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(20,30,20,0.18)',
          }}>
          <span>Suggest a meal</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: ui.mono, fontSize: 12, opacity: 0.7, fontWeight: 600 }}>
            ↵ go
          </span>
        </button>
      </div>

      <MPBottomNav active="home" onChange={onNav} />
    </div>
  );
}

// ── Custom slider with tick markers ─────────────────────────────────────────
function MPSlider({ label, value, min, max, step, format, onChange }) {
  const ui = mpUI;
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: ui.ink2 }}>{label}</span>
        <span style={{ fontSize: 18, fontWeight: 700, fontFamily: ui.display,
          color: ui.ink, letterSpacing: '-0.01em' }}>{format(value)}</span>
      </div>
      <div style={{ position: 'relative', height: 22, display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 6,
          background: ui.paper2, borderRadius: 999, border: `1px solid ${ui.line}`,
        }}/>
        <div style={{
          position: 'absolute', left: 0, height: 6, width: `${pct}%`,
          background: ui.ink, borderRadius: 999,
        }}/>
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: 'absolute', left: 0, right: 0, width: '100%', margin: 0,
            opacity: 0, cursor: 'pointer', height: 22,
          }}/>
        <div style={{
          position: 'absolute', left: `calc(${pct}% - 11px)`,
          width: 22, height: 22, borderRadius: 11, background: ui.paper,
          border: `2px solid ${ui.ink}`, pointerEvents: 'none',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}/>
      </div>
    </div>
  );
}

Object.assign(window, { MPHomeScreen });
