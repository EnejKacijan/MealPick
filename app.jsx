// MealPick — main app shell + design canvas wrapper

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#3a8c5c",
  "accentColor": "#e6c54a",
  "density": "comfortable",
  "revealMode": "stagger",
  "defaultMode": "lazy"
}/*EDITMODE-END*/;

function MealPickApp({ tweaks, setTweak, initialScreen = 'home', initialMealId, homeVariant = 'stacked', showMockStatusBar = false }) {
  const defaultState = {
    pantry: ['eggs', 'pasta', 'cheese', 'tuna', 'bread', 'rice', 'butter', 'tomato_sauce', 'garlic'],
    customIngredients: [],
    resolvedIngredients: {},
    mode: tweaks.defaultMode,
    budget: 5,
    time: 15,
    profile: {
      name: 'Enej',
      goal: 'save_money',
      servings: 1,
    },
    savedMeals: [],
    lastPicked: null,
  };
  const [state, setState] = React.useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('mealpick-state') || 'null');
      if (!saved) return defaultState;
      const profile = { ...defaultState.profile, ...(saved.profile || {}) };
      if (!FOOD_GOALS.some((goal) => goal.id === profile.goal)) {
        profile.goal = 'save_money';
      }
      return { ...defaultState, ...saved, profile };
    } catch {
      return defaultState;
    }
  });
  const [screen, setScreen] = React.useState(initialScreen);
  const [mealId, setMealId] = React.useState(initialMealId || 'tuna_pasta');
  const [apiStatus, setApiStatus] = React.useState('loading');

  React.useEffect(() => {
    const controller = new AbortController();
    const query = encodeURIComponent(state.pantry.map(resolveIngredientId).join(','));
    fetch(`/api/meals?ingredients=${query}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(`API ${response.status}`)))
      .then((data) => {
        setApiMeals(data.meals || []);
        setApiStatus(data.meals?.length ? 'live' : 'fallback');
      })
      .catch(() => {
        setApiMeals([]);
        setApiStatus('fallback');
      });
    return () => controller.abort();
  }, [state.pantry]);

  // sync mode tweak → state
  const didMount = React.useRef(false);
  React.useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    setState((s) => ({ ...s, mode: tweaks.defaultMode }));
  }, [tweaks.defaultMode]);

  React.useEffect(() => {
    localStorage.setItem('mealpick-state', JSON.stringify(state));
  }, [state]);

  // Theme colors override via CSS vars
  const styleVars = {
    '--mp-primary': tweaks.primaryColor,
    '--mp-accent': tweaks.accentColor,
  };

  const onSuggest = () => setScreen('results');
  const onPickMeal = (id) => { setMealId(id); setScreen('detail'); };
  const onConfirmMeal = (id) => {
    const meal = getMealById(id);
    if (!meal) return;
    setState((s) => ({
      ...s,
      lastPicked: {
        id,
        pickedAt: new Date().toISOString(),
      },
      savedMeals: [
        { id, pickedAt: new Date().toISOString() },
        ...(s.savedMeals || []).filter((item) => item.id !== id),
      ].slice(0, 8),
    }));
    setScreen('saved');
  };
  const onNav = (id) => {
    if (id === 'home') setScreen('home');
    if (id === 'pantry') setScreen('pantry');
    if (id === 'history') setScreen('saved');
  };

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      ...styleVars,
    }}>
      <style>{`
        /* Override green (herb) and citrus dynamically */
        .mp-app {
          --mp-primary-fallback: ${tweaks.primaryColor};
        }
      `}</style>

      {screen === 'home' && (
        <MPHomeScreen state={state} setState={setState}
          mode={state.mode} density={tweaks.density}
          onSuggest={onSuggest}
          onPantry={() => setScreen('pantry')}
          onProfile={() => setScreen('profile')}
          onNav={onNav}
          showStatusBar={showMockStatusBar}
          apiStatus={apiStatus}
          variant={homeVariant} />
      )}
      {screen === 'results' && (
        <MPResultsScreen state={state}
          revealMode={tweaks.revealMode}
          onBack={() => setScreen('home')}
          onPickMeal={onPickMeal}
          onNav={onNav}
          showStatusBar={showMockStatusBar} />
      )}
      {screen === 'detail' && (
        <MPDetailScreen mealId={mealId} state={state}
          onBack={() => setScreen('results')}
          setState={setState}
          onConfirm={() => onConfirmMeal(mealId)}
          showStatusBar={showMockStatusBar} />
      )}
      {screen === 'pantry' && (
        <MPPantryScreen state={state} setState={setState}
          onBack={() => setScreen('home')}
          onNav={onNav}
          showStatusBar={showMockStatusBar} />
      )}
      {screen === 'saved' && (
        <MPSavedScreen state={state}
          onPickMeal={onPickMeal}
          onNav={onNav}
          showStatusBar={showMockStatusBar} />
      )}
      {screen === 'profile' && (
        <MPProfileScreen state={state}
          setState={setState}
          onBack={() => setScreen('home')}
          onNav={onNav}
          showStatusBar={showMockStatusBar} />
      )}
    </div>
  );
}

// ── Phone frame (custom — not iOS bezel, just a clean device shell) ────────
function MPPhone({ children, scale = 1, label }) {
  const w = 390, h = 844;
  return (
    <div style={{
      width: w * scale, height: h * scale,
      position: 'relative',
    }}>
      <div style={{
        width: w, height: h,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        borderRadius: 48, background: '#000', padding: 10,
        boxShadow: '0 30px 60px rgba(20,30,20,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
        position: 'relative',
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: 38, overflow: 'hidden',
          position: 'relative', background: '#fff',
        }}>
          {children}
          {/* Notch */}
          <div style={{
            position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
            width: 110, height: 30, borderRadius: 18, background: '#000', zIndex: 100,
          }}/>
        </div>
      </div>
    </div>
  );
}

// ── Live full prototype (interactive) ──────────────────────────────────────
function MPLiveProto({ tweaks, setTweak, variant = 'stacked' }) {
  return (
    <MPPhone>
      <MealPickApp tweaks={tweaks} setTweak={setTweak} homeVariant={variant} />
    </MPPhone>
  );
}

// ── Static screen previews (for canvas) ────────────────────────────────────
function MPStaticScreen({ screen, mealId, tweaks, variant = 'stacked' }) {
  return (
    <MealPickApp
      tweaks={tweaks}
      setTweak={() => {}}
      initialScreen={screen}
      initialMealId={mealId}
      homeVariant={variant}
      showMockStatusBar={true}
    />
  );
}

function MPSavedScreen({ state, onPickMeal, onNav, showStatusBar = false }) {
  const ui = mpUI;
  const saved = state.savedMeals || [];
  return (
    <div style={{
      position: 'absolute', inset: 0, background: ui.paper,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: ui.body, color: ui.ink,
    }}>
      {showStatusBar && <MPStatusBar />}
      <div style={{ padding: `${showStatusBar ? 6 : 22}px 22px 16px` }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: ui.ink3, fontFamily: ui.mono,
          marginBottom: 6 }}>
          Saved
        </div>
        <h1 style={{ margin: 0, fontFamily: ui.display, fontSize: 34, fontWeight: 700,
          letterSpacing: '-0.02em', color: ui.ink, lineHeight: 1 }}>
          Eat it again.
        </h1>
        <div style={{ marginTop: 10, fontSize: 14, color: ui.ink2 }}>
          Your recent picks, minus the overthinking.
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 22px 110px' }}>
        {saved.length === 0 ? (
          <div style={{
            marginTop: 24, borderRadius: 18, background: ui.greenSoft,
            border: `1px solid ${ui.line}`, padding: 18,
          }}>
            <div style={{ fontFamily: ui.display, fontSize: 22, fontWeight: 700,
              marginBottom: 6 }}>
              Nothing saved yet.
            </div>
            <div style={{ fontSize: 14, color: ui.ink2, lineHeight: 1.4 }}>
              Pick a meal and tap "I'll eat this". It will show up here.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {saved.map((item) => {
              const meal = getMealById(item.id);
              if (!meal) return null;
              return (
                <button key={`${item.id}-${item.pickedAt}`} onClick={() => onPickMeal(meal.id)}
                  style={{
                    appearance: 'none', border: `1px solid ${ui.line}`,
                    background: ui.paper2, borderRadius: 16, padding: 12,
                    display: 'flex', alignItems: 'center', gap: 12,
                    textAlign: 'left', cursor: 'pointer',
                  }}>
                  <span style={{
                    width: 58, height: 58, borderRadius: 14, background: meal.bgTone,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 32, border: `1px solid ${ui.line}`,
                  }}>
                    {meal.emoji}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontFamily: ui.display,
                      fontSize: 18, fontWeight: 700, color: ui.ink }}>
                      {meal.name}
                    </span>
                    <span style={{ display: 'block', fontSize: 12, color: ui.ink2,
                      marginTop: 2 }}>
                      {meal.time} min · ~€{(meal.price * (state.profile?.servings || 1)).toFixed(2)} total · {mealNutrition(meal, state.profile?.servings || 1).protein}g protein
                    </span>
                  </span>
                  <span style={{ fontFamily: ui.mono, color: ui.ink3 }}>→</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <MPBottomNav active="history" onChange={onNav} />
    </div>
  );
}

function MPProfileScreen({ state, setState, onBack, onNav, showStatusBar = false }) {
  const ui = mpUI;
  const profile = state.profile || {};
  const setProfile = (patch) => {
    setState((s) => ({ ...s, profile: { ...(s.profile || {}), ...patch } }));
  };
  const resetApp = () => {
    const ok = window.confirm('Reset pantry, saved meals, and preferences?');
    if (!ok) return;
    localStorage.removeItem('mealpick-state');
    window.location.reload();
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, background: ui.paper,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      fontFamily: ui.body, color: ui.ink,
    }}>
      {showStatusBar && <MPStatusBar />}

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
          Profile
        </div>
        <h1 style={{ margin: 0, fontFamily: ui.display, fontSize: 34, fontWeight: 700,
          letterSpacing: '-0.02em', color: ui.ink, lineHeight: 1 }}>
          Your defaults.
        </h1>
        <div style={{ marginTop: 10, fontSize: 14, color: ui.ink2 }}>
          Set the stuff MealPick should remember.
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 22px 110px',
        display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          borderRadius: 18, background: ui.greenSoft, border: `1px solid ${ui.line}`,
          padding: 16, display: 'flex', gap: 14, alignItems: 'center',
        }}>
          <div style={{
            width: 54, height: 54, borderRadius: 18, background: ui.paper,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1.5px solid ${ui.ink}`, fontFamily: ui.display,
            fontSize: 22, fontWeight: 700,
          }}>
            {(profile.name || 'M').slice(0, 1).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: ui.display, fontSize: 22, fontWeight: 700,
              lineHeight: 1 }}>
              {profile.name || 'Meal picker'}
            </div>
            <div style={{ marginTop: 5, fontSize: 13, color: ui.ink2 }}>
              {FOOD_GOALS.find((g) => g.id === (profile.goal || 'save_money'))?.name || 'Save money'}
            </div>
          </div>
        </div>

        <MPProfileField label="Name" value={profile.name || ''}
          onChange={(value) => setProfile({ name: value })} />
        <div>
          <MPSectionHeader kicker="Goal" title="Food goal" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
            {FOOD_GOALS.map((goal) => {
              const active = (profile.goal || 'save_money') === goal.id;
              return (
                <button key={goal.id} onClick={() => setProfile({ goal: goal.id })}
                  style={{
                    appearance: 'none', border: `1.5px solid ${active ? ui.ink : ui.line}`,
                    background: active ? ui.greenSoft : ui.paper2,
                    borderRadius: 14, padding: '12px 14px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    textAlign: 'left', cursor: 'pointer',
                  }}>
                  <span style={{
                    width: 32, height: 32, borderRadius: 11,
                    background: active ? ui.ink : ui.paper,
                    color: active ? ui.paper : ui.ink,
                    border: `1px solid ${active ? ui.ink : ui.line}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: ui.mono, fontSize: 13, fontWeight: 800,
                  }}>
                    {goal.icon}
                  </span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: 'block', fontFamily: ui.display,
                      fontSize: 17, fontWeight: 700, color: ui.ink }}>
                      {goal.name}
                    </span>
                    <span style={{ display: 'block', fontSize: 12,
                      color: ui.ink2, marginTop: 2 }}>
                      {goal.blurb}
                    </span>
                  </span>
                  {active && <span style={{ width: 8, height: 8, borderRadius: 4,
                    background: ui.ink }} />}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <MPSectionHeader kicker="Defaults" title="Mode" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {MODES.map((m) => (
              <MPModeTile key={m.id} mode={m} density="compact"
                active={state.mode === m.id}
                onClick={() => setState((s) => ({ ...s, mode: m.id }))} />
            ))}
          </div>
        </div>

        <div style={{
          background: ui.paper2, borderRadius: 16, border: `1px solid ${ui.line}`,
          padding: 14,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: ui.display, fontSize: 18, fontWeight: 700 }}>
                Servings
              </div>
              <div style={{ fontSize: 12, color: ui.ink2 }}>
                Budget and nutrition scale with this.
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setProfile({ servings: Math.max(1, (profile.servings || 1) - 1) })}
                style={profileButtonStyle(ui)}>-</button>
              <span style={{ minWidth: 22, textAlign: 'center', fontFamily: ui.display,
                fontSize: 20, fontWeight: 700 }}>
                {profile.servings || 1}
              </span>
              <button onClick={() => setProfile({ servings: Math.min(6, (profile.servings || 1) + 1) })}
                style={profileButtonStyle(ui)}>+</button>
            </div>
          </div>
        </div>

        <button onClick={resetApp} style={{
          appearance: 'none', border: `1.5px dashed ${ui.coral}`,
          background: 'transparent', color: ui.coral, padding: '14px',
          borderRadius: 14, fontSize: 14, fontWeight: 700, cursor: 'pointer',
          fontFamily: ui.body,
        }}>
          Reset app data
        </button>
      </div>

      <MPBottomNav active="home" onChange={onNav} />
    </div>
  );
}

function MPProfileField({ label, value, onChange }) {
  const ui = mpUI;
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: ui.ink3, fontFamily: ui.mono }}>
        {label}
      </span>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', border: `1px solid ${ui.line}`, borderRadius: 14,
          background: ui.paper2, color: ui.ink, padding: '14px 14px',
          fontSize: 16, fontFamily: ui.body, outline: 'none',
        }} />
    </label>
  );
}

function profileButtonStyle(ui) {
  return {
    appearance: 'none',
    border: `1px solid ${ui.line}`,
    background: ui.paper,
    color: ui.ink,
    width: 34,
    height: 34,
    borderRadius: 12,
    cursor: 'pointer',
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1,
  };
}

// ── Root ───────────────────────────────────────────────────────────────────
function Root() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const canvasMode = new URLSearchParams(window.location.search).has('canvas');

  if (!canvasMode) {
    const debugScreen = new URLSearchParams(window.location.search).get('screen') || 'home';
    const debugMealId = new URLSearchParams(window.location.search).get('meal') || undefined;
    return (
      <div style={{
        width: '100vw', height: '100vh', background: '#f0eee9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 'min(100vw, 430px)', height: '100vh', maxHeight: 932,
          position: 'relative', background: '#fff',
          boxShadow: '0 24px 70px rgba(20, 30, 20, 0.12)',
        }}>
          <MealPickApp tweaks={tweaks} setTweak={setTweak}
            initialScreen={debugScreen}
            initialMealId={debugMealId}
            homeVariant="stacked" />
        </div>
      </div>
    );
  }

  return (
    <>
      <DesignCanvas>
        <DCSection id="proto" title="MealPick — interactive prototype"
          subtitle="Two home variants. Tap through the full flow.">
          <DCArtboard id="stacked" label="A · Stacked home" width={420} height={874}>
            <div style={{ width: 420, height: 874, display: 'flex',
              alignItems: 'center', justifyContent: 'center', background: '#f0eee9' }}>
              <MPLiveProto tweaks={tweaks} setTweak={setTweak} variant="stacked" />
            </div>
          </DCArtboard>
          <DCArtboard id="compact" label="B · Compact home" width={420} height={874}>
            <div style={{ width: 420, height: 874, display: 'flex',
              alignItems: 'center', justifyContent: 'center', background: '#f0eee9' }}>
              <MPLiveProto tweaks={tweaks} setTweak={setTweak} variant="compact" />
            </div>
          </DCArtboard>
        </DCSection>

        <DCSection id="screens" title="Static screens"
          subtitle="Each screen of the flow, isolated.">
          <DCArtboard id="home-a" label="Home · variant A" width={410} height={860}>
            <div style={{ width: 410, height: 860, display: 'flex',
              alignItems: 'center', justifyContent: 'center', background: '#f0eee9' }}>
              <MPPhone>
                <MPStaticScreen screen="home" tweaks={tweaks} variant="stacked" />
              </MPPhone>
            </div>
          </DCArtboard>
          <DCArtboard id="home-b" label="Home · variant B" width={410} height={860}>
            <div style={{ width: 410, height: 860, display: 'flex',
              alignItems: 'center', justifyContent: 'center', background: '#f0eee9' }}>
              <MPPhone>
                <MPStaticScreen screen="home" tweaks={tweaks} variant="compact" />
              </MPPhone>
            </div>
          </DCArtboard>
          <DCArtboard id="results" label="Results" width={410} height={860}>
            <div style={{ width: 410, height: 860, display: 'flex',
              alignItems: 'center', justifyContent: 'center', background: '#f0eee9' }}>
              <MPPhone>
                <MPStaticScreen screen="results" tweaks={tweaks} />
              </MPPhone>
            </div>
          </DCArtboard>
          <DCArtboard id="detail" label="Meal detail" width={410} height={860}>
            <div style={{ width: 410, height: 860, display: 'flex',
              alignItems: 'center', justifyContent: 'center', background: '#f0eee9' }}>
              <MPPhone>
                <MPStaticScreen screen="detail" mealId="tuna_pasta" tweaks={tweaks} />
              </MPPhone>
            </div>
          </DCArtboard>
          <DCArtboard id="pantry" label="Pantry" width={410} height={860}>
            <div style={{ width: 410, height: 860, display: 'flex',
              alignItems: 'center', justifyContent: 'center', background: '#f0eee9' }}>
              <MPPhone>
                <MPStaticScreen screen="pantry" tweaks={tweaks} />
              </MPPhone>
            </div>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      {/* Tweaks panel (off by default — host toggle activates it) */}
      <TweaksPanel title="MealPick · Tweaks">
        <TweakSection label="Theme">
          <TweakColor label="Primary (herb)" value={tweaks.primaryColor}
            onChange={(v) => setTweak('primaryColor', v)} />
          <TweakColor label="Accent (citrus)" value={tweaks.accentColor}
            onChange={(v) => setTweak('accentColor', v)} />
        </TweakSection>
        <TweakSection label="Behavior">
          <TweakSelect label="Default mode" value={tweaks.defaultMode}
            options={[
              { value: 'student', label: 'Student' },
              { value: 'fitness', label: 'Fitness' },
              { value: 'lazy', label: 'Lazy Day' },
              { value: 'budget', label: 'Budget' },
            ]}
            onChange={(v) => setTweak('defaultMode', v)} />
          <TweakRadio label="Density" value={tweaks.density}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'comfortable', label: 'Comfy' },
            ]}
            onChange={(v) => setTweak('density', v)} />
          <TweakSelect label="Reveal animation" value={tweaks.revealMode}
            options={[
              { value: 'instant', label: 'Instant' },
              { value: 'stagger', label: 'Stagger in' },
              { value: 'flip', label: 'Flip / pop' },
            ]}
            onChange={(v) => setTweak('revealMode', v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// Mount
const rootEl = document.getElementById('app');
ReactDOM.createRoot(rootEl).render(<Root />);
