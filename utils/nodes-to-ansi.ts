interface ANSIState {
  fg: number
  bg: number
  st: number
}

export function nodesToANSI(nodes: NodeListOf<ChildNode> | Array<ChildNode>, states: ANSIState[]): string {
  let text = ""

  for (const node of nodes) {
    // Text node
    if (node.nodeType === 3) {
      text += node.textContent
      continue
    }

    // Line break
    if (node.nodeName === "BR") {
      text += "\n"
      continue
    }

    // Element node with ANSI class
    if (node.nodeName === "SPAN" && (node as HTMLElement).className.includes("ansi-")) {
      const ansiCode = +(node as HTMLElement).className.split("-")[1]
      const newState = Object.assign({}, states[states.length - 1])

      // Style code (bold, underline)
      if (ansiCode < 30) newState.st = ansiCode
      // Foreground color
      if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode
      // Background color
      if (ansiCode >= 40) newState.bg = ansiCode

      states.push(newState)
      text += `\x1b[${newState.st};${ansiCode >= 40 ? newState.bg : newState.fg}m`
      text += nodesToANSI(node.childNodes, states)
      states.pop()

      text += `\x1b[0m`

      // Restore previous state if needed
      const prevState = states[states.length - 1]
      if (prevState.fg !== 2) text += `\x1b[${prevState.st};${prevState.fg}m`
      if (prevState.bg !== 2) text += `\x1b[${prevState.st};${prevState.bg}m`
    }
  }

  return text
}

