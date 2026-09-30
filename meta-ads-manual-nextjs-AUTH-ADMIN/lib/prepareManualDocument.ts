
export function prepareManualDocument(fragment: string) {
  const styleBlocks = Array.from(
    fragment.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)
  ).map((match) => match[1]);

  const scriptBlocks = Array.from(
    fragment.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)
  ).map((match) => match[1]);

  const bodyMarkup = fragment
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

  const styles = styleBlocks.join("\n");
  const scripts = scriptBlocks
    .map((script) => `<script>${script}<\/script>`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
  <style>
    html, body {
      margin: 0;
      min-height: 100%;
      background: #f4f7fb;
    }

    /*
      Prevent first-paint FOUC.
      The parent frame is covered by a loader until the iframe load event,
      and the iframe body is also hidden until the complete document exists.
    */
    body {
      visibility: hidden;
    }

    body.manual-document-ready {
      visibility: visible;
    }
  </style>
  <style>${styles}</style>
</head>
<body>
${bodyMarkup}
${scripts}
<script>
  (function () {
    function reveal() {
      document.body.classList.add("manual-document-ready");
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        requestAnimationFrame(reveal);
      }, { once: true });
    } else {
      requestAnimationFrame(reveal);
    }
  })();
<\/script>
</body>
</html>`;
}
