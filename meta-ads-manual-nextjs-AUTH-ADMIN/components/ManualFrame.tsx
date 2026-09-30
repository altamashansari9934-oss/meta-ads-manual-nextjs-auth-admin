"use client";

import { useState } from "react";

type ManualFrameProps = {
  html: string;
};

export default function ManualFrame({ html }: ManualFrameProps) {
  const [ready, setReady] = useState(false);

  return (
    <main className="manual-app-shell">
      <div
        className={`manual-frame-loader ${ready ? "is-hidden" : ""}`}
        aria-hidden={ready}
      >
        <div className="manual-loader-card">
          <div className="manual-loader-logo">M</div>
          <div className="manual-loader-copy">
            <strong>Meta Ads Manual</strong>
            <span>Loading your workspace...</span>
          </div>
          <span className="manual-loader-spinner" />
        </div>
      </div>

      <iframe
        className={`manual-app-frame ${ready ? "is-ready" : ""}`}
        title="Meta Ads Creative Field Manual"
        srcDoc={html}
        onLoad={() => setReady(true)}
      />
    </main>
  );
}
