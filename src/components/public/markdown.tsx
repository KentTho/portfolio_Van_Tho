/**
 * Minimal, safe Markdown renderer for TRUSTED Owner content. Supports #/##/###
 * headings, `>` blockquotes and paragraphs. Renders text nodes only — no raw HTML,
 * no `dangerouslySetInnerHTML` (security §15). Rich rendering can be upgraded later.
 */
export function Markdown({ source }: { readonly source: string }) {
  const blocks = source.split(/\n{2,}/);
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        const line = block.trim();
        if (line.startsWith("### "))
          return (
            <h3 key={index} className="font-display text-xl italic text-fg">
              {line.slice(4)}
            </h3>
          );
        if (line.startsWith("## "))
          return (
            <h2 key={index} className="font-display text-2xl italic text-fg">
              {line.slice(3)}
            </h2>
          );
        if (line.startsWith("# "))
          return (
            <h1 key={index} className="font-display text-3xl italic text-fg">
              {line.slice(2)}
            </h1>
          );
        if (line.startsWith("> "))
          return (
            <blockquote key={index} className="border-l-2 border-accent/50 pl-4 text-fg-muted">
              {line.slice(2)}
            </blockquote>
          );
        return (
          <p key={index} className="leading-8 text-fg-muted">
            {line}
          </p>
        );
      })}
    </div>
  );
}
