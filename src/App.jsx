import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, BadgeIndianRupee, BarChart3, Camera, Check, CheckCircle2,
  ChevronRight, CircleAlert, Clock3, Eye, FileText, ImagePlus, Languages, LoaderCircle,
  MapPin, Menu, RefreshCcw, ScanLine, ShieldCheck, Sparkles, Target, Upload, Users,
  WandSparkles, X,
} from 'lucide-react';
import { createDemoAudit, sampleImage } from '../shared/demoData.js';

const API = '/api';

const track = (name, properties = {}) => fetch(`${API}/events`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, ...properties }),
}).catch(() => undefined);

const Severity = ({ value }) => <span className={`severity severity-${value}`}>{value}</span>;

function Logo() {
  return <div className="logo" aria-label="AccessLens home"><span className="logo-mark"><ScanLine size={21} /></span><span>Access<span>Lens</span></span></div>;
}

function Header({ screen, onHome, onStart }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <button className="brand-button" onClick={onHome}><Logo /></button>
      <nav className={open ? 'open' : ''} aria-label="Primary navigation">
        <button className={screen === 'dashboard' ? 'active' : ''} onClick={() => { setOpen(false); onHome(); }}>Workspace</button>
        <button onClick={() => { setOpen(false); onHome(); setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 0); }}>How it works</button>
        <button className="button button-dark button-small" onClick={() => { setOpen(false); onStart(); }}><Camera size={16} /> New audit</button>
      </nav>
      <button className="mobile-menu" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button>
    </header>
  );
}

function MetricCard({ icon: Icon, label, value, detail, tone }) {
  return (
    <article className={`metric-card ${tone || ''}`}>
      <div className="metric-icon"><Icon size={19} /></div>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  );
}

function ScoreRing({ value, projected, small = false }) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className={`score-ring ${small ? 'score-ring-small' : ''}`} style={{ '--score': `${safeValue * 3.6}deg` }}>
      <div><strong>{safeValue}</strong><span>/100</span></div>
      {projected && <em>Now</em>}
    </div>
  );
}

function Dashboard({ audits, metrics, loading, onStart, onOpen }) {
  return (
    <main>
      <section className="hero page-shell">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={14} /> Gemini-powered accessibility screening</span>
          <h1>See barriers.<br /><span>Ship fixes.</span></h1>
          <p>Turn one venue photo into visible evidence, a prioritized action plan, and a measurable path to better access.</p>
          <div className="hero-actions">
            <button className="button button-accent" onClick={onStart}>Audit a space <ArrowRight size={18} /></button>
            <span><ShieldCheck size={17} /> No certification claims. Human verification built in.</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="image-frame">
            <img src={sampleImage} alt="Synthetic example of a pharmacy entrance with two steps" />
            <div className="synthetic-label"><WandSparkles size={14} /> Synthetic demo scene</div>
            <div className="focus-box focus-one"><span>01</span></div>
            <div className="focus-box focus-two"><span>02</span></div>
          </div>
          <div className="floating-card finding-float">
            <span className="float-icon"><CircleAlert size={18} /></span>
            <div><strong>Step-only entrance</strong><span>Critical barrier · 97% confidence</span></div>
          </div>
          <div className="floating-card score-float"><strong>42</strong><span>Access score</span><i>+40 possible</i></div>
        </div>
      </section>

      <section className="metric-grid page-shell" aria-label="Impact snapshot">
        <MetricCard icon={Camera} label="Spaces audited" value={loading ? '—' : metrics.audits} detail="photos screened" />
        <MetricCard icon={Target} label="Barriers surfaced" value={loading ? '—' : metrics.barriersFound} detail="with visible evidence" tone="warm" />
        <MetricCard icon={CheckCircle2} label="Fixes completed" value={loading ? '—' : metrics.fixesCompleted} detail="tracked actions" tone="green" />
        <MetricCard icon={Users} label="Potential reach" value={loading ? '—' : metrics.estimatedPeopleHelpedMonthly} detail="people / month · estimated" tone="blue" />
      </section>

      <section className="workspace-section page-shell">
        <div className="section-heading">
          <div><span className="section-kicker">Your workspace</span><h2>Recent accessibility audits</h2></div>
          <button className="button button-outline" onClick={onStart}><ImagePlus size={17} /> New photo audit</button>
        </div>
        {loading ? (
          <div className="audit-list"><div className="skeleton skeleton-row" /><div className="skeleton skeleton-row" /></div>
        ) : audits.length ? (
          <div className="audit-list">
            {audits.slice(0, 4).map((audit) => (
              <button className="audit-row" key={audit.id} onClick={() => onOpen(audit)}>
                <img src={audit.imageUrl} alt="" />
                <div className="audit-main"><strong>{audit.venue}</strong><span><MapPin size={13} /> {audit.venueType} · {audit.sourceLabel}</span></div>
                <div className="audit-score"><span>Score</span><strong>{audit.scoreCurrent}</strong><em>→ {audit.scoreProjected}</em></div>
                <div className="audit-status"><span>{audit.barriers.length} barriers</span><small>{new Date(audit.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</small></div>
                <ChevronRight size={20} />
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state"><span><Camera /></span><h3>No audits yet</h3><p>Start with the synthetic sample. You’ll have a complete action plan in under a minute.</p><button className="button button-accent" onClick={onStart}>Run first audit</button></div>
        )}
      </section>

      <section className="how-section" id="how-it-works">
        <div className="page-shell">
          <div className="section-heading light"><div><span className="section-kicker">From evidence to action</span><h2>Three steps. One decision-ready plan.</h2></div><p>Gemini is used where it adds leverage: multimodal evidence extraction and context-aware prioritization.</p></div>
          <div className="steps-grid">
            <article><span>01</span><Camera /><h3>Capture</h3><p>Use a demo photo or upload a real entrance, aisle, counter, or washroom.</p></article>
            <article><span>02</span><ScanLine /><h3>Understand</h3><p>Gemini identifies visible barriers, affected users, severity, and confidence.</p></article>
            <article><span>03</span><Target /><h3>Act</h3><p>Get quick wins, cost bands, score impact, and a trackable improvement plan.</p></article>
          </div>
        </div>
      </section>
    </main>
  );
}

function AuditSetup({ onBack, onAnalyze }) {
  const inputRef = useRef(null);
  const [source, setSource] = useState('sample');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(sampleImage);
  const [form, setForm] = useState({ venue: 'Harbor Health Pharmacy', venueType: 'Pharmacy', visitorsPerMonth: 1200 });
  const [fileError, setFileError] = useState('');

  const chooseFile = (nextFile) => {
    if (!nextFile) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(nextFile.type) || nextFile.size > 10 * 1024 * 1024) {
      setFileError('Choose a JPG, PNG, or WebP image smaller than 10 MB.');
      return;
    }
    setFileError('');
    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
    setSource('upload');
  };

  return (
    <main className="setup-page page-shell">
      <button className="back-button" onClick={onBack}><ArrowLeft size={17} /> Back to workspace</button>
      <div className="setup-heading"><span className="eyebrow"><span>1</span> of 2 · Capture context</span><h1>What should we make easier to access?</h1><p>Start with one clear view. AccessLens only reports barriers it can support with visible evidence.</p></div>
      <div className="setup-grid">
        <section className="panel upload-panel">
          <div className="panel-title"><div><span className="section-kicker">Evidence photo</span><h2>Choose an image</h2></div><span className="required">Required</span></div>
          <button className={`sample-card ${source === 'sample' ? 'selected' : ''}`} onClick={() => { setSource('sample'); setPreview(sampleImage); setFile(null); }}>
            <img src={sampleImage} alt="Synthetic pharmacy entrance sample" />
            <span className="sample-copy"><strong>Use judging-day sample</strong><small>Controlled, offline-ready, synthetic scene</small></span>
            <span className="radio">{source === 'sample' && <Check size={14} />}</span>
          </button>
          <div className="divider"><span>or</span></div>
          <button className={`dropzone ${source === 'upload' ? 'selected' : ''}`} onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]); }}>
            <Upload size={25} /><strong>{file ? file.name : 'Drop a venue photo here'}</strong><span>{file ? `${(file.size / 1024 / 1024).toFixed(1)} MB · ready` : 'JPG, PNG or WebP · up to 10 MB'}</span>
          </button>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(event) => chooseFile(event.target.files[0])} />
          {fileError && <p className="inline-error"><CircleAlert size={15} /> {fileError}</p>}
          <div className="privacy-note"><ShieldCheck size={19} /><div><strong>Privacy by default</strong><span>Avoid faces and personal information. Uploaded photos are processed only for this audit.</span></div></div>
        </section>

        <section className="panel context-panel">
          <div className="panel-title"><div><span className="section-kicker">Venue context</span><h2>Help Gemini prioritize</h2></div></div>
          <label><span>Venue name</span><input value={form.venue} onChange={(event) => setForm({ ...form, venue: event.target.value })} placeholder="e.g. Harbor Health Pharmacy" /></label>
          <label><span>Venue type</span><select value={form.venueType} onChange={(event) => setForm({ ...form, venueType: event.target.value })}><option>Pharmacy</option><option>Café</option><option>Clinic</option><option>College</option><option>Retail store</option><option>Community venue</option><option>Other</option></select></label>
          <label><span>Estimated visitors each month</span><input type="number" min="0" max="1000000" value={form.visitorsPerMonth} onChange={(event) => setForm({ ...form, visitorsPerMonth: event.target.value })} /><small>Used only for the clearly labeled reach estimate.</small></label>
          <div className="preview-strip"><img src={preview} alt="Selected audit preview" /><div><strong>Ready to screen</strong><span>{source === 'sample' ? 'Synthetic fixture' : 'Your uploaded photo'} · English + Hindi summary</span></div><CheckCircle2 size={20} /></div>
          <button className="button button-accent button-wide" disabled={!form.venue.trim() || !form.venueType || (source === 'upload' && !file)} onClick={() => onAnalyze({ ...form, source, file })}><WandSparkles size={18} /> Analyze with Gemini <ArrowRight size={18} /></button>
          <p className="button-caption">Screening is assistive guidance, not a legal compliance audit.</p>
        </section>
      </div>
    </main>
  );
}

const loadingStages = [
  ['Reading the space', 'Locating approach, entrance, and circulation elements'],
  ['Checking access barriers', 'Comparing visible evidence across mobility, vision, and balance needs'],
  ['Prioritizing fixes', 'Ranking actions by effort, cost, confidence, and likely impact'],
];

function AnalysisLoading({ preview = sampleImage }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setStage((value) => Math.min(2, value + 1)), 850);
    return () => clearInterval(timer);
  }, []);
  return (
    <main className="loading-page page-shell">
      <div className="analysis-preview"><img src={preview} alt="Photo being analyzed" /><div className="scan-beam" /><span><ScanLine size={17} /> Evidence scan in progress</span></div>
      <div className="loading-copy"><span className="eyebrow"><LoaderCircle className="spinner" size={15} /> Gemini multimodal analysis</span><h1>{loadingStages[stage][0]}<span className="loading-dots">...</span></h1><p>{loadingStages[stage][1]}</p><div className="progress"><i style={{ width: `${(stage + 1) * 33.33}%` }} /></div><ol>{loadingStages.map(([label], index) => <li className={index <= stage ? 'done' : ''} key={label}><span>{index < stage ? <Check size={14} /> : index + 1}</span>{label}</li>)}</ol></div>
    </main>
  );
}

function ErrorState({ message, onRetry, onOffline, onBack }) {
  return (
    <main className="error-page page-shell"><div className="error-card"><span className="error-icon"><CircleAlert /></span><span className="section-kicker">Analysis paused</span><h1>We couldn’t finish that scan.</h1><p>{message || 'The model or network did not respond. Your photo and venue details are still available.'}</p><div><button className="button button-dark" onClick={onRetry}><RefreshCcw size={17} /> Retry analysis</button><button className="button button-outline" onClick={onOffline}>Use offline judging demo</button></div><button className="text-button" onClick={onBack}>Choose a different photo</button></div></main>
  );
}

function ResultHero({ audit }) {
  return (
    <section className="result-hero">
      <div className="result-title"><span className="eyebrow"><CheckCircle2 size={14} /> Analysis complete</span><h1>{audit.venue}</h1><p>{audit.summary}</p><div className="source-chip"><Sparkles size={14} /> {audit.sourceLabel}</div></div>
      <div className="score-block"><ScoreRing value={audit.scoreCurrent} projected /><div><span>Projected after plan</span><strong>{audit.scoreProjected}<small>/100</small></strong><em>+{audit.scoreProjected - audit.scoreBefore} points</em></div></div>
    </section>
  );
}

function EvidenceView({ audit, activeBarrier, setActiveBarrier }) {
  return (
    <section className="evidence-grid">
      <div className="evidence-image">
        <img src={audit.imageUrl} alt={`Entrance audit for ${audit.venue}`} />
        {audit.barriers.map((barrier, index) => <button key={barrier.id} aria-label={`Show ${barrier.title}`} className={`annotation ${activeBarrier === index ? 'active' : ''}`} style={{ left: `${barrier.region.x}%`, top: `${barrier.region.y}%`, width: `${barrier.region.width}%`, height: `${barrier.region.height}%` }} onClick={() => setActiveBarrier(index)}><span>{index + 1}</span></button>)}
        <div className="synthetic-label"><Eye size={14} /> Tap numbered evidence</div>
      </div>
      <div className="finding-panel">
        <div className="panel-title"><div><span className="section-kicker">Visible evidence</span><h2>{audit.barriers.length} barriers surfaced</h2></div><span className="confidence">{Math.round(audit.confidence * 100)}% overall confidence</span></div>
        <div className="finding-list">
          {audit.barriers.map((barrier, index) => (
            <button className={`finding-item ${activeBarrier === index ? 'active' : ''}`} key={barrier.id} onClick={() => setActiveBarrier(index)}>
              <span className="finding-number">{index + 1}</span><div><div className="finding-title"><strong>{barrier.title}</strong><Severity value={barrier.severity} /></div><p>{barrier.evidence}</p><small>Affects: {barrier.affected}</small></div><span className="finding-confidence">{Math.round(barrier.confidence * 100)}%</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ActionPlan({ audit, onToggle }) {
  const completeCount = audit.recommendations.filter((item) => item.completed).length;
  return (
    <section className="action-section">
      <div className="section-heading"><div><span className="section-kicker">Prioritized action plan</span><h2>Start with the fixes that move the score</h2></div><div className="plan-progress"><strong>{completeCount}/{audit.recommendations.length}</strong><span>actions completed</span></div></div>
      <div className="recommendation-list">
        {audit.recommendations.map((item) => (
          <article className={`recommendation ${item.completed ? 'completed' : ''}`} key={item.id}>
            <button className="check-button" aria-label={`${item.completed ? 'Reopen' : 'Complete'} ${item.title}`} onClick={() => onToggle(item)}>{item.completed && <Check size={16} />}</button>
            <span className="priority">P{item.priority}</span>
            <div className="recommendation-main"><strong>{item.title}</strong><p>{item.action}</p><div><span><BadgeIndianRupee size={14} /> {item.costBand}</span><span><Clock3 size={14} /> {item.effort}</span></div></div>
            <div className="score-gain"><span>Score impact</span><strong>+{item.scoreGain}</strong></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Results({ audit, onBack, onNew, onAuditChange }) {
  const [activeBarrier, setActiveBarrier] = useState(0);
  const [language, setLanguage] = useState('English');
  const [updating, setUpdating] = useState('');
  const completed = audit.recommendations.filter((item) => item.completed).length;

  const onToggle = async (item) => {
    setUpdating(item.id);
    const optimistic = { ...audit, recommendations: audit.recommendations.map((rec) => rec.id === item.id ? { ...rec, completed: !rec.completed } : rec) };
    optimistic.scoreCurrent = Math.min(optimistic.scoreProjected, optimistic.scoreBefore + optimistic.recommendations.filter((rec) => rec.completed).reduce((sum, rec) => sum + rec.scoreGain, 0));
    onAuditChange(optimistic);
    try {
      const response = await fetch(`${API}/audits/${audit.id}/recommendations/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completed: !item.completed }) });
      if (!response.ok) throw new Error('Could not save action');
      onAuditChange(await response.json());
    } catch {
      onAuditChange(optimistic);
    } finally {
      setUpdating('');
    }
  };

  return (
    <main className="results-page page-shell">
      <div className="result-toolbar"><button className="back-button" onClick={onBack}><ArrowLeft size={17} /> Workspace</button><div><button className="button button-outline button-small" onClick={() => window.print()}><FileText size={16} /> Export plan</button><button className="button button-dark button-small" onClick={onNew}><Camera size={16} /> New audit</button></div></div>
      <ResultHero audit={audit} />
      <div className="result-tabs"><button className="active">Evidence & plan</button><button onClick={() => document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' })}>Impact</button><button className="language-button" onClick={() => setLanguage(language === 'English' ? 'हिन्दी' : 'English')}><Languages size={15} /> {language}</button></div>
      {language === 'हिन्दी' && <div className="translation-note"><Languages size={18} /><div><strong>सरल हिन्दी सारांश</strong><p>{audit.summaryHi}</p></div></div>}
      <EvidenceView audit={audit} activeBarrier={activeBarrier} setActiveBarrier={setActiveBarrier} />
      <ActionPlan audit={audit} onToggle={onToggle} updating={updating} />
      <section className="impact-section" id="impact">
        <div><span className="section-kicker">Measurable outcome</span><h2>From a score to a story judges can verify.</h2><p>Every metric shows its basis. Estimated reach is directional and never presented as observed fact.</p></div>
        <div className="impact-cards">
          <article><span>Current score</span><strong>{audit.scoreCurrent}</strong><small>+{audit.scoreCurrent - audit.scoreBefore} from completed actions</small></article>
          <article><span>Barriers addressed</span><strong>{completed}<small> / {audit.barriers.length}</small></strong><small>completion tracked in this plan</small></article>
          <article><span>Potential monthly reach</span><strong>{audit.impact.estimatedPeopleHelpedMonthly}</strong><small>illustrative estimate · see method</small></article>
        </div>
        <details><summary>How is reach estimated?</summary><p>{audit.impact.method}</p></details>
      </section>
      <div className="disclaimer"><ShieldCheck size={20} /><div><strong>Human verification checkpoint</strong><span>{audit.analysis.disclaimer}</span></div><span>{audit.analysis.mode === 'live_gemini' ? `Live ${audit.analysis.model}` : 'Deterministic offline demo'}</span></div>
    </main>
  );
}

export default function App() {
  const [screen, setScreen] = useState('dashboard');
  const [audits, setAudits] = useState([]);
  const [metrics, setMetrics] = useState({ audits: 0, barriersFound: 0, fixesCompleted: 0, estimatedPeopleHelpedMonthly: 0 });
  const [loading, setLoading] = useState(true);
  const [activeAudit, setActiveAudit] = useState(null);
  const [error, setError] = useState('');
  const [lastRequest, setLastRequest] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(sampleImage);

  const refresh = async () => {
    setLoading(true);
    try {
      const [auditResponse, metricResponse] = await Promise.all([fetch(`${API}/audits`), fetch(`${API}/metrics`)]);
      if (!auditResponse.ok || !metricResponse.ok) throw new Error('API unavailable');
      setAudits(await auditResponse.json());
      setMetrics(await metricResponse.json());
    } catch {
      setAudits([createDemoAudit({ id: 'offline-seed' })]);
      setMetrics({ audits: 1, barriersFound: 4, fixesCompleted: 0, estimatedPeopleHelpedMonthly: 96 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const start = () => { setScreen('setup'); setError(''); track('audit_started'); window.scrollTo(0, 0); };
  const home = () => { setScreen('dashboard'); setActiveAudit(null); refresh(); window.scrollTo(0, 0); };
  const openAudit = (audit) => { setActiveAudit(audit); setScreen('result'); track('audit_opened', { auditId: audit.id }); window.scrollTo(0, 0); };

  const analyze = async (request) => {
    setLastRequest(request);
    setError('');
    setLoadingPreview(request.file ? URL.createObjectURL(request.file) : sampleImage);
    setScreen('loading');
    const formData = new FormData();
    formData.append('venue', request.venue);
    formData.append('venueType', request.venueType);
    formData.append('visitorsPerMonth', request.visitorsPerMonth);
    if (request.source === 'sample') formData.append('sampleId', 'pharmacy-entrance');
    if (request.file) formData.append('image', request.file);
    try {
      const [response] = await Promise.all([
        fetch(`${API}/audits/analyze`, { method: 'POST', body: formData }),
        new Promise((resolve) => setTimeout(resolve, 2600)),
      ]);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Analysis failed.');
      setActiveAudit(data);
      setAudits((items) => [data, ...items]);
      setScreen('result');
      window.scrollTo(0, 0);
    } catch (analysisError) {
      setError(analysisError.message);
      setScreen('error');
    }
  };

  const useOffline = () => {
    const audit = createDemoAudit({ venue: lastRequest?.venue, venueType: lastRequest?.venueType, visitorsPerMonth: lastRequest?.visitorsPerMonth, id: `offline-${Date.now()}`, mode: 'offline_client_fixture' });
    setActiveAudit(audit);
    setAudits((items) => [audit, ...items]);
    setScreen('result');
    track('offline_fallback_used');
  };

  const content = useMemo(() => {
    if (screen === 'setup') return <AuditSetup onBack={home} onAnalyze={analyze} />;
    if (screen === 'loading') return <AnalysisLoading preview={loadingPreview} />;
    if (screen === 'error') return <ErrorState message={error} onRetry={() => analyze(lastRequest)} onOffline={useOffline} onBack={() => setScreen('setup')} />;
    if (screen === 'result' && activeAudit) return <Results audit={activeAudit} onBack={home} onNew={start} onAuditChange={(updated) => { setActiveAudit(updated); setAudits((items) => items.map((item) => item.id === updated.id ? updated : item)); }} />;
    return <Dashboard audits={audits} metrics={metrics} loading={loading} onStart={start} onOpen={openAudit} />;
  }, [screen, audits, metrics, loading, activeAudit, error, lastRequest, loadingPreview]);

  return <><Header screen={screen} onHome={home} onStart={start} />{content}<footer><Logo /><p>AI-assisted accessibility screening for faster, more inclusive decisions.</p><span>Built for Hack Days Turbhe · Synthetic data is always labeled.</span></footer></>;
}
