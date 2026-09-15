/** Read the Chair's numbered checklist, tolerating common Markdown headings. */
export function extractNextMoves(text: string): string[] {
  const section = /^\s*#{0,3}\s*\*{0,2}DO THIS WEEK\*{0,2}\s*:?\s*$/im.exec(text);
  if (!section) return [];
  const body = text.slice(section.index + section[0].length).split(/^\s*#{1,3}\s+/m)[0];
  return body.split(/^\s*(?:\d+[.)]|[-*•])\s+/m).slice(1)
    .map((s) => s.trim().replace(/\*\*/g, "").replace(/\s*\n\s*/g, " "))
    .filter(Boolean).slice(0, 5);
}
