const ATTRIBUTE_LINE = /^\{:\s+([.#][\w-]+(?:\s+[.#][\w-]+)*)\s*\}$/;

function attributesFrom(value) {
  const properties = {};
  const classes = [];
  for (const token of value.trim().split(/\s+/)) {
    if (token.startsWith('.')) classes.push(token.slice(1));
    if (token.startsWith('#')) properties.id = token.slice(1);
  }
  if (classes.length) properties.className = classes;
  return properties;
}

export default function remarkKramdownAttributes() {
  return (tree) => {
    function attachAttributes(parent) {
      if (!Array.isArray(parent.children)) return;

      for (let index = parent.children.length - 1; index >= 0; index -= 1) {
        const child = parent.children[index];
        if (child?.type !== 'paragraph' || child.children?.length !== 1 || child.children[0]?.type !== 'text') continue;
        const match = child.children[0].value.match(ATTRIBUTE_LINE);
        if (!match || index === 0) continue;
        const previous = parent.children[index - 1];
        previous.data ??= {};
        previous.data.hProperties = { ...(previous.data.hProperties ?? {}), ...attributesFrom(match[1]) };
        parent.children.splice(index, 1);
      }

      for (const child of parent.children) attachAttributes(child);
    }

    attachAttributes(tree);
  };
}
