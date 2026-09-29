type ManualFrameProps = {
  html: string;
};

export default function ManualFrame({ html }: ManualFrameProps) {
  return (
    <main className="manual-app-shell">
      <iframe
        className="manual-app-frame"
        title="Meta Ads Creative Field Manual"
        srcDoc={html}
      />
    </main>
  );
}
