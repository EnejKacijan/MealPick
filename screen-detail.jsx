// MealPick — Meal detail screen

function MPDetailScreen({ mealId, state, setState, onBack, onConfirm, showStatusBar = false }) {
  const ui = mpUI;
  const meal = getMealById(mealId);
  if (!meal) return null;
  const servings = state.profile?.servings || 1;
  const nutrition = mealNutrition(meal, servings, state.resolvedIngredients || {});
  const totalPrice = meal.price * servings;
  const have = meal.ingredients.filter((i) => state.pantry.includes(i));
  const need = meal.ingredients.filter((i) => !state.pantry.includes(i));
  const optionalHave = (meal.optional || []).filter((i) => state.pantry.includes(i));
  const buyCost = meal.ingredients.length
    ? totalPrice * (need.length / meal.ingredients.length)
    : 0;
  const saved = (state.savedMeals || []).some((item) => item.id === mealId);
  const toggleSaved = () => {
    setState((s) => ({
      ...s,
      savedMeals: saved
        ? (s.savedMeals || []).filter((item) => item.id !== mealId)
        : [{ id: mealId, pickedAt: new Date().toISOString() }, ...(s.savedMeals || [])].slice(0, 8),
    }));
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, background: ui.paper,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: ui.body, color: ui.ink,
    }}>
      <div style={{ background: meal.bgTone }}>
        {showStatusBar && <MPStatusBar />}
      </div>

      {/* Hero */}
      <div style={{ background: meal.bgTone, padding: `${showStatusBar ? 6 : 18}px 18px 18px`,
        borderBottom: `1.5px solid ${ui.ink}`, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onBack} style={{
            appearance: 'none', border: `1.5px solid ${ui.ink}`, background: ui.paper,
            width: 38, height: 38, borderRadius: 19, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: ui.ink,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button onClick={toggleSaved} style={{
            appearance: 'none', border: `1.5px solid ${ui.ink}`, background: ui.paper,
            width: 38, height: 38, borderRadius: 19, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: ui.ink,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path fill={saved ? 'currentColor' : 'none'} d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 16 }}>
          <div style={{ fontSize: 90, lineHeight: 1, transform: 'rotate(-6deg)',
            filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.12))' }}>{meal.emoji}</div>
          <div style={{ flex: 1, paddingBottom: 6 }}>
            <div style={{ display: 'flex', gap: 5, marginBottom: 6, flexWrap: 'wrap' }}>
              {meal.tags.slice(0, 3).map((t) => (
                <MPTag key={t} color={ui.paper}>{t}</MPTag>
              ))}
            </div>
            <h1 style={{ margin: 0, fontFamily: ui.display, fontSize: 28, fontWeight: 700,
              letterSpacing: '-0.02em', color: ui.ink, lineHeight: 1 }}>{meal.name}</h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 18, padding: '14px 16px',
          background: ui.paper, borderRadius: 14, border: `1.5px solid ${ui.ink}` }}>
          <MPStat label="cost" value={`€${totalPrice.toFixed(2)}`} />
          <MPStat label="time" value={`${meal.time}m`} />
          <MPStat label="protein" value={`${nutrition.protein}g`} />
          <MPStat label="kcal" value={nutrition.kcal} />
          <MPStat label="have" value={`${have.length}/${meal.ingredients.length}`}
            accent={ui.green} />
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px 110px' }}>
        {/* Why */}
        <div style={{
          padding: '12px 14px', background: ui.greenSoft, borderRadius: 12,
          fontSize: 14, color: ui.ink, marginBottom: 18, fontStyle: 'italic',
        }}>
          "{meal.why}"
        </div>

        {/* Ingredients */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: ui.ink3, fontFamily: ui.mono,
            marginBottom: 10 }}>Ingredients</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {meal.ingredients.map((id) => {
              const has = have.includes(id);
              const it = getPantryItem(id);
              return (
                <div key={id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10,
                  background: has ? ui.greenSoft : ui.paper,
                  border: `1px solid ${has ? 'transparent' : ui.line}`,
                  borderLeft: has ? `3px solid ${ui.green}` : `3px dashed ${ui.coral}`,
                }}>
                  <span style={{ fontSize: 22 }}>{it.emoji}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: ui.ink }}>
                    {it.name}
                  </span>
                  <span style={{ fontFamily: ui.mono, fontSize: 11, fontWeight: 600,
                    color: has ? ui.green : ui.coral }}>
                    {has ? '✓ have' : '+ buy'}
                  </span>
                </div>
              );
            })}
            {meal.optional && meal.optional.length > 0 && (
              <div style={{ fontSize: 11, fontFamily: ui.mono, color: ui.ink3,
                marginTop: 4, padding: '0 4px' }}>
                Optional: {meal.optional.map((i) => (PANTRY_INDEX[i]?.name || i)).join(', ')}
                {optionalHave.length > 0 &&
                  <span style={{ color: ui.green }}> · {optionalHave.length} on hand</span>}
              </div>
            )}
          </div>
        </div>

        {/* Steps */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: ui.ink3, fontFamily: ui.mono,
            marginBottom: 10 }}>Steps</div>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none',
            display: 'flex', flexDirection: 'column', gap: 8 }}>
            {meal.steps.map((step, i) => (
              <li key={i} style={{
                display: 'flex', gap: 12, padding: '12px 14px', background: ui.paper2,
                borderRadius: 12,
              }}>
                <span style={{ fontFamily: ui.display, fontSize: 18, fontWeight: 700,
                  color: ui.green, lineHeight: 1, minWidth: 18 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 14, color: ui.ink, lineHeight: 1.45,
                  paddingTop: 1 }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Cost breakdown */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: ui.ink3, fontFamily: ui.mono,
            marginBottom: 10 }}>Price breakdown</div>
          <div style={{ background: ui.paper2, borderRadius: 12, padding: '12px 14px',
            display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: ui.ink2 }}>From your pantry</span>
              <span style={{ fontFamily: ui.mono, fontWeight: 600,
                color: ui.green }}>−€{(totalPrice - buyCost).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: ui.ink2 }}>Need to buy ({need.length})</span>
              <span style={{ fontFamily: ui.mono, fontWeight: 600, color: ui.coral }}>
                +€{buyCost.toFixed(2)}
              </span>
            </div>
            <div style={{ height: 1, background: ui.line, margin: '4px 0' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between',
              fontSize: 15, fontWeight: 700 }}>
              <span style={{ color: ui.ink, fontFamily: ui.display }}>
                {servings} serving{servings === 1 ? '' : 's'} total
              </span>
              <span style={{ fontFamily: ui.display, color: ui.ink }}>~€{totalPrice.toFixed(2)}</span>
            </div>
            {servings > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between',
                fontSize: 12, color: ui.ink2 }}>
                <span>Per portion</span>
                <span style={{ fontFamily: ui.mono }}>~€{meal.price.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 18px 30px', background: ui.paper,
        borderTop: `1px solid ${ui.line}` }}>
        <button onClick={onConfirm}
          style={{
            width: '100%', appearance: 'none', border: 0, cursor: 'pointer',
            background: ui.green, color: ui.paper, padding: '18px 22px',
            borderRadius: 16, fontSize: 17, fontWeight: 700,
            fontFamily: ui.display, letterSpacing: '-0.01em',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(40,80,40,0.20)',
          }}>
          <span>I'll eat this</span>
          <span style={{ fontFamily: ui.mono, fontSize: 12, opacity: 0.85 }}>
            Start cooking →
          </span>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { MPDetailScreen });
