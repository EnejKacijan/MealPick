// MealPick — Pantry screen

function MPPantryScreen({ state, setState, onBack, onNav, showStatusBar = false }) {
  const ui = mpUI;
  const [customDraft, setCustomDraft] = React.useState('');
  const pantrySet = new Set(state.pantry);
  const fridge = PANTRY_DEFAULTS.filter((i) => i.category === 'fridge');
  const cupboard = PANTRY_DEFAULTS.filter((i) => i.category === 'cupboard');
  const total = state.pantry.length;

  const customItems = (state.customIngredients || []).map((name) => ({
    id: `custom:${name}`,
    name: name.replaceAll('_', ' '),
    emoji: '+',
    category: 'custom',
  }));
  const toggle = (id) => {
    setState((s) => ({
      ...s,
      pantry: pantrySet.has(id) ? s.pantry.filter((x) => x !== id) : [...s.pantry, id],
    }));
  };
  const addCustom = async () => {
    const name = normalizeIngredientName(customDraft);
    if (!name) return;
    const knownId = resolveIngredientId(`custom:${name}`);
    const id = `custom:${name}`;
    let resolved = null;
    if (knownId === id) {
      try {
        const response = await fetch(`/api/ingredients/resolve?query=${encodeURIComponent(customDraft.trim())}`);
        if (response.ok) {
          const data = await response.json();
          resolved = data.ingredient;
        }
      } catch {
        resolved = { id, name: name.replaceAll('_', ' '), category: 'other', kcal: 80, protein: 2, cost: 0.75 };
      }
    }
    setState((s) => ({
      ...s,
      customIngredients: knownId === id
        ? Array.from(new Set([...(s.customIngredients || []), name]))
        : (s.customIngredients || []),
      resolvedIngredients: resolved
        ? { ...(s.resolvedIngredients || {}), [id]: resolved }
        : (s.resolvedIngredients || {}),
      pantry: s.pantry.includes(knownId) || s.pantry.includes(id)
        ? s.pantry
        : [...s.pantry, knownId === id ? id : knownId],
    }));
    setCustomDraft('');
  };

  const Section = ({ title, items }) => (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'baseline', marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: ui.ink3, fontFamily: ui.mono }}>
          {title}
        </span>
        <span style={{ fontSize: 11, fontFamily: ui.mono, color: ui.ink3 }}>
          {items.filter((i) => pantrySet.has(i.id)).length}/{items.length}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {items.map((it) => {
          const on = pantrySet.has(it.id);
          return (
            <button key={it.id} onClick={() => toggle(it.id)}
              style={{
                appearance: 'none', cursor: 'pointer', textAlign: 'left',
                border: `1.5px solid ${on ? ui.ink : ui.line}`,
                background: on ? ui.greenSoft : ui.paper,
                borderRadius: 14, padding: '10px 12px',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all .12s ease',
              }}>
              <span style={{ fontSize: 22 }}>{it.emoji}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: ui.ink }}>
                {it.name}
              </span>
              <span style={{
                width: 20, height: 20, borderRadius: 10,
                border: `1.5px solid ${on ? ui.ink : ui.ink3}`,
                background: on ? ui.ink : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: ui.paper,
              }}>
                {on && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7"/>
                  </svg>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'absolute', inset: 0, background: ui.paper,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: ui.body, color: ui.ink,
    }}>
      {showStatusBar && <MPStatusBar />}

      {/* Header */}
      <div style={{ padding: `${showStatusBar ? 6 : 22}px 22px 16px` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <button onClick={onBack} style={{
            appearance: 'none', border: `1px solid ${ui.line}`, background: ui.paper,
            width: 38, height: 38, borderRadius: 19, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: ui.ink,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: ui.ink3, fontFamily: ui.mono,
          marginBottom: 6 }}>
          Pantry
        </div>
        <h1 style={{ margin: 0, fontFamily: ui.display, fontSize: 32, fontWeight: 700,
          letterSpacing: '-0.02em', color: ui.ink, lineHeight: 1 }}>
          What you've got.
        </h1>
        <div style={{ marginTop: 10, fontSize: 14, color: ui.ink2 }}>
          Saved as default — edit any time. <span style={{
            fontFamily: ui.mono, color: ui.green, fontWeight: 600 }}>{total} items</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 22px 110px' }}>
        <Section title="Fridge" items={fridge} />
        <Section title="Cupboard" items={cupboard} />
        {customItems.length > 0 && <Section title="Custom" items={customItems} />}
        <div style={{
          border: `1.5px dashed ${ui.line}`, borderRadius: 16,
          padding: 10, display: 'flex', gap: 8, background: ui.paper2,
        }}>
          <input value={customDraft}
            onChange={(e) => setCustomDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addCustom(); }}
            placeholder="Add ingredient"
            style={{
              flex: 1, minWidth: 0, border: 0, background: 'transparent',
              color: ui.ink, fontSize: 15, fontFamily: ui.body, outline: 'none',
              padding: '8px 6px',
            }} />
          <button onClick={addCustom} disabled={!customDraft.trim()} style={{
            appearance: 'none', border: 0, borderRadius: 12,
            background: customDraft.trim() ? ui.ink : ui.line,
            color: ui.paper, padding: '8px 14px', fontSize: 13,
            fontWeight: 700, fontFamily: ui.body,
            cursor: customDraft.trim() ? 'pointer' : 'default',
          }}>
            Add
          </button>
        </div>
      </div>

      <MPBottomNav active="pantry" onChange={onNav} />
    </div>
  );
}

Object.assign(window, { MPPantryScreen });
