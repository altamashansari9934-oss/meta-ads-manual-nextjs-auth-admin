"use client";

import { useState } from "react";

type Mode = "audience" | "lead" | "ecommerce" | "scaling" | "budget";
type Props = { panels: Record<string, string> };

const MODES = [
  { key: "audience" as Mode, label: "Audience & Creative Strategy", tabs: [
    { key:"full", label:"Full Concept", content:"audience_full" },
    { key:"quick", label:"Quick Diagnosis", content:"audience_quick" },
  ]},
  { key: "lead" as Mode, label: "Lead Generation", tabs: [
    { key:"testing", label:"Testing Framework", content:"lead_testing" },
    { key:"diagnosis", label:"Diagnosis", content:"lead_diagnosis" },
  ]},
  { key: "ecommerce" as Mode, label: "E-commerce", tabs: [
    { key:"testing", label:"Testing Framework", content:"ecommerce_testing" },
    { key:"diagnosis", label:"Diagnosis", content:"ecommerce_diagnosis" },
  ]},
  { key: "scaling" as Mode, label: "Scaling Framework", tabs: [
    { key:"framework", label:"Scaling Framework", content:"scaling_framework" },
    { key:"quick", label:"Quick Decision", content:"scaling_quick" },
  ]},
  { key: "budget" as Mode, label: "Budget Allocation", tabs: [
    { key:"full", label:"Full Concept", content:"budget_full" },
    { key:"quick", label:"Quick Diagnose", content:"budget_quick" },
  ]},
];

const defaults: Record<Mode,string> = {
  audience:"full", lead:"testing", ecommerce:"testing", scaling:"framework", budget:"full"
};

export default function ManualApp({ panels }: Props) {
  const [mode, setMode] = useState<Mode>("audience");
  const [activeTabs, setActiveTabs] = useState<Record<Mode,string>>(defaults);
  const [menuOpen, setMenuOpen] = useState(false);

  const cfg = MODES.find(x => x.key === mode)!;
  const activeTab = activeTabs[mode];
  const tabCfg = cfg.tabs.find(x => x.key === activeTab) ?? cfg.tabs[0];
  const content = panels[tabCfg.content] ?? "";

  const activateMode = (next: Mode) => {
    setMode(next);
    setMenuOpen(false);
    window.scrollTo({top:0, behavior:"smooth"});
  };

  const activatePanel = (nextMode: Mode, nextTab: string) => {
    setMode(nextMode);
    setActiveTabs(prev => ({...prev, [nextMode]: nextTab}));
    setMenuOpen(false);
    window.scrollTo({top:0, behavior:"smooth"});
  };

  return (
    <div className={`rewrite-app ${menuOpen ? "menu-open" : ""}`}>
      <aside className="rewrite-sidebar">
        <div className="brand-row">
          <div className="brand-logo">M</div>
          <div className="brand-copy"><small>META ADS</small><strong>Creative field manual</strong></div>
        </div>
        <div className="side-label">Workspaces</div>

        {MODES.map(item => (
          <div className={`side-group ${mode===item.key ? "active" : ""}`} key={item.key}>
            <button className="side-head" onClick={() => activateMode(item.key)} type="button">
              <span>{item.label}</span><span>›</span>
            </button>
            <div className="side-sub">
              {item.tabs.map(t => (
                <button
                  className={`side-link ${mode===item.key && activeTabs[item.key]===t.key ? "active" : ""}`}
                  onClick={() => activatePanel(item.key,t.key)}
                  type="button"
                  key={t.key}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </aside>

      <main className="rewrite-main">
        <header className="rewrite-topbar">
          <button className="mobile-menu" type="button" onClick={() => setMenuOpen(v=>!v)}>☰</button>
          <div className="rewrite-headcopy">
            <div className="rewrite-breadcrumb">{cfg.label.toUpperCase()} / {tabCfg.label.toUpperCase()}</div>
            <div className="rewrite-title">Creative Testing & Diagnosis</div>
          </div>
          <input className="rewrite-search" aria-label="Search manual" placeholder="Search the approved manual..." />
        </header>

        <div className="rewrite-content">
          <nav className="rewrite-mode-tabs">
            {MODES.map(item => (
              <button className={`rewrite-mode-tab ${mode===item.key ? "active" : ""}`} onClick={() => activateMode(item.key)} type="button" key={item.key}>
                {item.label}
              </button>
            ))}
          </nav>

          <nav className="rewrite-subtabs">
            {cfg.tabs.map(t => (
              <button className={`rewrite-subtab ${activeTab===t.key ? "active" : ""}`} onClick={() => activatePanel(mode,t.key)} type="button" key={t.key}>
                {t.label}
              </button>
            ))}
          </nav>

          <section key={`${mode}-${activeTab}`} className="rewrite-panel">
            <div dangerouslySetInnerHTML={{__html: content}} />
          </section>
        </div>
      </main>
    </div>
  );
}
