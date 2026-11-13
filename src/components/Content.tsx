import type { ReactNode } from "react";
import type { Block } from "@/lib/curriculum";

type Node = { text: string; kids: Node[] };

const NUM = /(\b\d+(?:[.,]\d+)?(?:\s?[–-]\s?\d+(?:[.,]\d+)?)?\s?(?:%|mg\/kg(?:\/day)?|mg\/dL|g\/dL|mL\/kg|mEq\/L|mmol\/L|mg|µg|mcg|kg|g|cm|mm|mL|L|months?|weeks?|years?|days?|hours?|hrs?|h|min|\/min|bpm|IU)(?![A-Za-z]))/g;
function hl(s: string): ReactNode {
  return <>{s.split(NUM).map((p, i) => (i % 2 ? <mark key={i} className="num">{p}</mark> : p))}</>;
}

function label(text: string): ReactNode {
  const m = text.match(/^((?:\d+\.\s)?[^:]{2,72}?)\s?:\s+([\s\S]+)$/);
  if (m && !/[.!?]$/.test(m[1])) {
    return (
      <>
        <b className="lbl">{m[1]}:</b> {hl(m[2])}
      </>
    );
  }
  if (/^[^:]{2,72}:$/.test(text)) return <b className="lbl">{text}</b>;
  return hl(text);
}

function List({ nodes }: { nodes: Node[] }) {
  return (
    <ul>
      {nodes.map((n, i) => (
        <li key={i}>
          {label(n.text)}
          {n.kids.length > 0 && <List nodes={n.kids} />}
        </li>
      ))}
    </ul>
  );
}

export function outline(blocks: Block[]) {
  return blocks
    .map((b, i) => ({ i, t: b[0], text: b[2] }))
    .filter((x) => x.t === "h" || x.t === "s")
    .map((x) => ({ id: `b${x.i}`, text: x.text.replace(/^\d+\.\s*/, ""), major: x.t === "h" }));
}

export function Content({ blocks }: { blocks: Block[] }) {
  const out: ReactNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b[0] === "h") {
      out.push(<h2 key={i} id={`b${i}`}>{b[2].replace(/^\d+\.\s*/, "")}</h2>);
      i++;
    } else if (b[0] === "s") {
      out.push(<h3 key={i} id={`b${i}`}>{b[2].replace(/^[A-Z]\.\s*/, "").replace(/:$/, "")}</h3>);
      i++;
    } else if (b[0] === "p") {
      const isDef = /^Definition/i.test(b[2]);
      out.push(isDef ? <div key={i} className="callout">{label(b[2])}</div> : <p key={i}>{label(b[2])}</p>);
      i++;
    } else {
      const start = i;
      const root: Node[] = [];
      const stack: { lvl: number; kids: Node[] }[] = [{ lvl: -1, kids: root }];
      while (i < blocks.length && blocks[i][0] === "l") {
        const lvl = blocks[i][1];
        const node: Node = { text: blocks[i][2], kids: [] };
        while (stack.length > 1 && stack[stack.length - 1].lvl >= lvl) stack.pop();
        stack[stack.length - 1].kids.push(node);
        stack.push({ lvl, kids: node.kids });
        i++;
      }
      // promote a leading "Definition" bullet to a callout
      const [first, ...rest] = root;
      if (first && /^Definition/i.test(first.text) && first.kids.length === 0) {
        out.push(<div key={`d${start}`} className="callout">{label(first.text)}</div>);
        if (rest.length) out.push(<List key={`l${start}`} nodes={rest} />);
      } else {
        out.push(<List key={`l${start}`} nodes={root} />);
      }
    }
  }
  return <div className="curric">{out}</div>;
}
