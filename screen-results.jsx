// MealPick — Results screen
// Top pick (hero) + 2 alternates. Reveal animation modes: stagger | flip | instant.

function MPResultsScreen({ state, onBack, onPickMeal, onNav, revealMode = 'stagger', showStatusBar = false }) {
  const ui = mpUI;
  const [shown, setShown] = React.useState(3);
  const [flipped, setFlipped] = React.useState(revealMode !== 'flip');
  const [batch, setBatch] = React.useState(0);
  const servings = state.profile?.servings || 1;
  const foodGoal = state.profile?.goal || 'save_money';
  const picks = React.useMemo(
    () => suggestMeals({
      pantry: state.pantry, mode: state.mode,
      maxBudget: state.budget, maxTime: state.time,
      servings,
      foodGoal,
      resolvedIngredients: state.resolvedIngredients || {},
      offset: batch,
    }),
    [state.pantry, state.mode, state.budget, state.time, servings, foodGoal, batch]
  );

  // Reveal sequence
  React.useEffect(() => {
    if (revealMode === 'instant') { setShown(3); setFlipped(true); return; }
    setShown(3); setFlipped(revealMode !== 'flip');
    const t1 = setTimeout(() => setShown(3), 120);
    const t2 = setTimeout(() => setShown(3), 260);
    const t3 = setTimeout(() => setShown(3), 380);
    const tf = setTimeout(() => setFlipped(true), revealMode === 'flip' ? 700 : 0);
    return () => [t1, t2, t3, tf].forEach(clearTimeout);
  }, [revealMode, state.mode, state.budget, state.time, state.pantry, servings, foodGoal]);

  if (picks.length === 0) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: ui.paper, padding: 22 }}>
        {showStatusBar && <MPStatusBar />}
        <div style={{ marginTop: 80, fontFamily: ui.display, fontSize: 28, color: ui.ink }}>
          Your fridge is empty.
        </div>
      </div>
    );
  }

  const top = picks[0];
  const rest = picks.slice(1);
  const topNutrition = top.nutrition || mealNutrition(top.meal);

  return (
    <div style={{
      position: 'absolute', inset: 0, background: ui.paper2,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: ui.body, color: ui.ink,
    }}>
      {showStatusBar && <MPStatusBar />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10,
        padding: `${showStatusBar ? 6 : 18}px 18px 12px` }}>
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
        <div style={{ flex: 1, fontSize: 11, fontFamily: ui.mono,
          color: ui.ink2, letterSpacing: '0.04em' }}>
            €{state.budget.toFixed(2)} total · {servings} serving{servings === 1 ? '' : 's'} · {
              FOOD_GOALS.find((g) => g.id === foodGoal)?.name.toLowerCase()
            } · <b style={{ color: ui.ink }}>{
            MODES.find((m) => m.id === state.mode)?.name.toLowerCase()}</b>
        </div>
        <button onClick={() => { setShown(3); setFlipped(revealMode !== 'flip'); setBatch((b) => b + 1); setTimeout(() => { setShown(3); setFlipped(true); }, 50); }}
          style={{
            appearance: 'none', border: `1px solid ${ui.line}`, background: ui.paper,
            padding: '8px 12px', borderRadius: 999, cursor: 'pointer',
            fontSize: 12, fontWeight: 600, fontFamily: ui.body, color: ui.ink,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>
          </svg>
          Reshuffle
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 190px' }}>

        {/* Verdict line */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: ui.ink3, fontFamily: ui.mono,
            marginBottom: 4 }}>
            Top pick
          </div>
          <div style={{ fontFamily: ui.display, fontSize: 28, fontWeight: 700,
            letterSpacing: '-0.02em', lineHeight: 1, color: ui.ink }}>
            Eat this.
          </div>
        </div>

        {/* HERO CARD */}
        <div style={{
          opacity: shown >= 1 ? 1 : 0,
          transform: shown >= 1 ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
          transition: 'opacity .45s ease, transform .55s cubic-bezier(.2,.8,.2,1)',
          marginBottom: 16,
        }}>
          <MPHeroCard pick={top} flipped={flipped} onClick={() => onPickMeal(top.meal.id)} />
        </div>

        {/* ALTERNATES */}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: ui.ink3, fontFamily: ui.mono,
          marginBottom: 10, padding: '8px 4px 0' }}>
          Or, instead
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rest.map((p, i) => (
            <div key={p.meal.id} style={{
              opacity: shown >= 2 + i ? 1 : 0,
              transform: shown >= 2 + i ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity .35s ease, transform .45s cubic-bezier(.2,.8,.2,1)',
            }}>
              <MPAltCard pick={p} onClick={() => onPickMeal(p.meal.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: 64, left: 0, right: 0,
        padding: '14px 18px 14px', display: 'flex', gap: 8,
        background: `linear-gradient(to top, ${ui.paper2} 60%, ${ui.paper2}00)` }}>
        <button onClick={() => onPickMeal(top.meal.id)}
          style={{
            flex: 1, appearance: 'none', border: 0, cursor: 'pointer',
            background: ui.ink, color: ui.paper, padding: '16px 20px',
            borderRadius: 16, fontSize: 16, fontWeight: 700,
            fontFamily: ui.display, letterSpacing: '-0.01em',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(20,30,20,0.18)',
          }}>
          <span>I'll eat this</span>
          <span style={{ fontFamily: ui.mono, fontSize: 11, opacity: 0.65 }}>→</span>
        </button>
      </div>

      <MPBottomNav active="home" onChange={onNav} />
    </div>
  );
}

// ── Hero card ──────────────────────────────────────────────────────────────
function MPHeroCard({ pick, flipped, onClick }) {
  const ui = mpUI;
  const m = pick.meal;
  const servings = pick.servings || 1;
  const totalPrice = pick.totalPrice ?? m.price * servings;
  const nutrition = pick.nutrition || mealNutrition(m, servings, {});
  const has = m.ingredients.filter((i) => !pick.need.includes(i));
  const need = pick.need;
  return (
    <div onClick={onClick} style={{
      borderRadius: 24, overflow: 'hidden', cursor: 'pointer',
      border: `1.5px solid ${ui.ink}`, background: m.bgTone,
      boxShadow: '0 12px 30px rgba(40,45,30,0.12), 0 2px 0 ${ui.ink} inset',
      position: 'relative',
    }}>
      {/* Big art block */}
      <div style={{
        height: 160, position: 'relative',
        background: `linear-gradient(135deg, ${m.bgTone} 0%, ${ui.greenSoft} 120%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: `1.5px solid ${ui.ink}`,
      }}>
        <div style={{
          fontSize: 88, lineHeight: 1,
          transform: flipped ? 'scale(1) rotate(-6deg)' : 'scale(0.4) rotate(180deg)',
          transition: 'transform .8s cubic-bezier(.2,1.3,.4,1)',
          filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.12))',
        }}>{m.emoji}</div>
        {/* Ribbon */}
        <div style={{
          position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6,
        }}>
          <MPTag color={ui.ink} fg={ui.paper}>★ top pick</MPTag>
          {pick.modeMatch && <MPTag color={ui.paper}>matches mode</MPTag>}
        </div>
        {/* corner price */}
        <div style={{
          position: 'absolute', bottom: 12, right: 12, padding: '6px 10px',
          background: ui.paper, borderRadius: 999, border: `1.5px solid ${ui.ink}`,
          fontFamily: ui.display, fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em',
        }}>~€{totalPrice.toFixed(2)}</div>
      </div>

      <div style={{ padding: '16px 18px 18px', background: ui.paper }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: 10 }}>
          <h2 style={{ margin: 0, fontFamily: ui.display, fontSize: 26,
            fontWeight: 700, letterSpacing: '-0.02em', color: ui.ink, lineHeight: 1 }}>
            {m.name}
          </h2>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontFamily: ui.mono, fontSize: 12, color: ui.ink2, fontWeight: 600 }}>
              {m.time} min
            </span>
            <span style={{ fontFamily: ui.mono, fontSize: 12, color: ui.green, fontWeight: 700 }}>
              {nutrition.protein}g protein
            </span>
          </div>
        </div>

        <div style={{ fontSize: 14, color: ui.ink2, fontStyle: 'italic',
          marginBottom: 14, lineHeight: 1.4 }}>
          "{m.why}"
        </div>

        {/* Ingredient strip */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: ui.green, fontFamily: ui.mono,
              marginBottom: 6 }}>
              ✓ already have
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {has.map((id) => {
                const it = getPantryItem(id);
                return (
                  <span key={id} style={{
                    fontSize: 12, padding: '3px 9px', borderRadius: 999,
                    background: ui.greenSoft, color: ui.ink, fontWeight: 500,
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    <span>{it.emoji}</span>{it.name}
                  </span>
                );
              })}
            </div>
          </div>
          {need.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: ui.coral, fontFamily: ui.mono,
                marginBottom: 6 }}>
                + need to buy
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {need.map((id) => {
                  const it = getPantryItem(id);
                  return (
                    <span key={id} style={{
                      fontSize: 12, padding: '3px 9px', borderRadius: 999,
                      background: ui.paper, color: ui.ink, fontWeight: 500,
                      border: `1px dashed ${ui.coral}`,
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      <span>{it.emoji}</span>{it.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Alt card (compact) ─────────────────────────────────────────────────────
function MPAltCard({ pick, onClick }) {
  const ui = mpUI;
  const m = pick.meal;
  const servings = pick.servings || 1;
  const totalPrice = pick.totalPrice ?? m.price * servings;
  const nutrition = pick.nutrition || mealNutrition(m, servings, {});
  return (
    <div onClick={onClick} style={{
      display: 'flex', gap: 12, padding: 12, borderRadius: 16,
      background: ui.paper, border: `1px solid ${ui.line}`, cursor: 'pointer',
      alignItems: 'center', transition: 'transform .12s ease, box-shadow .12s ease',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 14, flexShrink: 0,
        background: m.bgTone, border: `1px solid ${ui.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, lineHeight: 1,
      }}>{m.emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'baseline', gap: 8 }}>
          <h3 style={{ margin: 0, fontFamily: ui.display, fontSize: 17,
            fontWeight: 700, letterSpacing: '-0.01em', color: ui.ink,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {m.name}
          </h3>
          <span style={{ fontFamily: ui.display, fontSize: 16, fontWeight: 700,
            color: ui.ink, letterSpacing: '-0.01em', flexShrink: 0 }}>
            €{totalPrice.toFixed(2)}
          </span>
        </div>
        <div style={{ fontSize: 12, color: ui.ink2, marginTop: 2 }}>
          {m.why}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
          <span style={{ fontFamily: ui.mono, fontSize: 11, color: ui.ink3, fontWeight: 600 }}>
            {m.time}min
          </span>
          <span style={{ width: 3, height: 3, borderRadius: 2, background: ui.ink3 }}/>
          <span style={{ fontFamily: ui.mono, fontSize: 11, color: ui.green, fontWeight: 600 }}>
            {pick.haveCount}/{m.ingredients.length} on hand
          </span>
          <span style={{ width: 3, height: 3, borderRadius: 2, background: ui.ink3 }}/>
          <span style={{ fontFamily: ui.mono, fontSize: 11, color: ui.ink2, fontWeight: 600 }}>
            {nutrition.kcal} kcal
          </span>
          {pick.need.length > 0 && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: 2, background: ui.ink3 }}/>
              <span style={{ fontFamily: ui.mono, fontSize: 11, color: ui.coral, fontWeight: 600 }}>
                +{pick.need.length} to buy
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MPResultsScreen });
