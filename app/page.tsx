"use client"

import { useState, useRef, useEffect } from "react"
import { Container, Title, Text, Button, Group, Stack, Box, Paper, Tooltip, rem, useMantineTheme } from "@mantine/core"
import { notifications } from "@mantine/notifications"


const fgColors = [
  { code: 30, color: "#4f545c", label: "Dark Gray (33%)" },
  { code: 31, color: "#dc322f", label: "Red" },
  { code: 32, color: "#859900", label: "Yellowish Green" },
  { code: 33, color: "#b58900", label: "Gold" },
  { code: 34, color: "#268bd2", label: "Light Blue" },
  { code: 35, color: "#d33682", label: "Pink" },
  { code: 36, color: "#2aa198", label: "Teal" },
  { code: 37, color: "#ffffff", label: "White" },
]

const bgColors = [
  { code: 40, color: "#002b36", label: "Blueish Black" },
  { code: 41, color: "#cb4b16", label: "Rust Brown" },
  { code: 42, color: "#586e75", label: "Gray (40%)" },
  { code: 43, color: "#657b83", label: "Gray (45%)" },
  { code: 44, color: "#839496", label: "Light Gray (55%)" },
  { code: 45, color: "#6c71c4", label: "Blurple" },
  { code: 46, color: "#93a1a1", label: "Light Gray (60%)" },
  { code: 47, color: "#fdf6e3", label: "Cream White" },
]


function nodesToANSI(
  nodes: NodeListOf<ChildNode> | Array<ChildNode>,
  states: { fg: number; bg: number; st: number }[],
): string {
  let text = ""

  for (const node of Array.from(nodes)) {

    if (node.nodeType === 3) {
      text += node.textContent
      continue
    }


    if (node.nodeName === "BR") {
      text += "\n"
      continue
    }


    if (node.nodeName === "SPAN" && (node as HTMLElement).className.includes("ansi-")) {
      const ansiCode = +(node as HTMLElement).className.split("-")[1]
      const newState = { ...states[states.length - 1] }

      if (ansiCode < 30) newState.st = ansiCode
      if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode
      if (ansiCode >= 40) newState.bg = ansiCode

      states.push(newState)
      text += `\x1b[${newState.st};${ansiCode >= 40 ? newState.bg : newState.fg}m`
      text += nodesToANSI(node.childNodes, states)
      states.pop()

      text += `\x1b[0m`

      const prevState = states[states.length - 1]
      if (prevState.fg !== 2) text += `\x1b[${prevState.st};${prevState.fg}m`
      if (prevState.bg !== 2) text += `\x1b[${prevState.st};${prevState.bg}m`
    }
  }

  return text
}

export default function Home() {
  const theme = useMantineTheme()
  const editorRef = useRef<HTMLDivElement>(null)
  const [copyCount, setCopyCount] = useState(0)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML =
        'Welcome to <span class="ansi-33">Rebane</span>\'s <span class="ansi-45"><span class="ansi-37">Discord</span></span> <span class="ansi-31">C</span><span class="ansi-32">o</span><span class="ansi-33">l</span><span class="ansi-34">o</span><span class="ansi-35">r</span><span class="ansi-36">e</span><span class="ansi-37">d</span> Text Generator!'
    }
  }, [])

  const applyStyle = (ansiCode: number) => {
    if (!editorRef.current) return

    if (ansiCode === 0) {
      editorRef.current.innerHTML = editorRef.current.innerText
      return
    }

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const selectedText = range.toString()
    if (!selectedText) return

    const span = document.createElement("span")
    span.innerText = selectedText
    span.classList.add(`ansi-${ansiCode}`)

    range.deleteContents()
    range.insertNode(span)

    range.selectNodeContents(span)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  const handleEditorInput = () => {
    if (!editorRef.current) return

    const content = editorRef.current.innerHTML
    const sanitized = content.replace(/<(\/?(br|span|span class="ansi-[0-9]*"))>/g, "[$1]")

    if (sanitized.includes("<") || sanitized.includes(">")) {
      editorRef.current.innerHTML = sanitized
        .replace(/<.*?>/g, "")
        .replace(/[<>]/g, "")
        .replace(/\[(\/?(br|span|span class="ansi-[0-9]*"))\]/g, "<$1>")
    }
  }


  const handleCopy = () => {
    if (!editorRef.current) return

    const formattedText = "```ansi\n" + nodesToANSI(editorRef.current.childNodes, [{ fg: 2, bg: 2, st: 2 }]) + "\n```"

    navigator.clipboard.writeText(formattedText)

  
    const copyMessages = [
      "Copied!",
      "Double Copy!",
      "Triple Copy!",
      "Dominating!!",
      "Rampage!!",
      "Mega Copy!!",
      "Unstoppable!!",
      "Wicked Sick!!",
      "Monster Copy!!!",
      "GODLIKE!!!",
      "BEYOND GODLIKE!!!!",
    ]

    const newCount = Math.min(copyCount + 1, copyMessages.length - 1)
    setCopyCount(newCount)

    notifications.show({
      title: copyMessages[newCount],
      message: "Text copied to clipboard with Discord formatting",
      color: newCount <= 8 ? "teal" : "red",
      autoClose: 2000,
    })

    // Reset copy count after 2 seconds
    setTimeout(() => setCopyCount(0), 2000)
  }

  // Create color buttons
  const renderColorButtons = (colors: typeof fgColors, label: string) => (
    <Box>
      <Text fw={700} mb="xs">
        {label}
      </Text>
      <Group justify="center">
        {colors.map((color) => (
          <Tooltip key={color.code} label={color.label} withArrow>
            <Button
              onClick={() => applyStyle(color.code)}
              style={{ backgroundColor: color.color }}
              w={rem(36)}
              h={rem(36)}
              p={0}
            />
          </Tooltip>
        ))}
      </Group>
    </Box>
  )

  return (
    <Container py="xl" size="lg">
      <Stack gap="lg">
        <Title order={1} ta="center">
          Rebane&apos;s Discord{" "}
          <Text span c="#5865F2" inherit>
            Colored
          </Text>{" "}
          Text Generator
        </Title>

        <Box>
          <Title order={3} ta="center">
            About
          </Title>
          <Text ta="center" size="md" mt="xs">
            This is a simple app that creates colored Discord messages using the ANSI color codes available on the
            latest Discord desktop versions.
          </Text>
          <Text ta="center" size="md" mt="xs">
            To use this, write your text, select parts of it and assign colors to them, then copy it using the button
            below, and send in a Discord message.
          </Text>
        </Box>

        <Box>
          <Title order={3} ta="center">
            Source Code
          </Title>
          <Text ta="center" size="md" mt="xs">
            This app runs entirely in your browser and the source code is freely available on{" "}
            <Text component="a" href="https://github.com" c="#00AFF4" inherit>
              GitHub
            </Text>
            . Shout out to kkrypt0nn for{" "}
            <Text
              component="a"
              href="https://gist.github.com/kkrypt0nn/a02506f3712ff2d1c8ca7c9e0aed7c06"
              c="#00AFF4"
              inherit
            >
              this guide
            </Text>
            .
          </Text>
        </Box>

        <Title order={2} ta="center">
          Create your text
        </Title>

        <Group justify="center">
          <Button onClick={() => applyStyle(0)}>Reset All</Button>
          <Button onClick={() => applyStyle(1)} fw={700}>
            Bold
          </Button>
          <Button onClick={() => applyStyle(4)} style={{ textDecoration: "underline" }}>
            Line
          </Button>
        </Group>

        {renderColorButtons(fgColors, "FG")}
        {renderColorButtons(bgColors, "BG")}

        <Paper
          withBorder
          p="md"
          style={{
            backgroundColor: "#2F3136",
            minHeight: 200,
            textAlign: "left",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            fontSize: "0.875rem",
            lineHeight: "1.125rem",
            color: "#B9BBBE",
          }}
        >
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                document.execCommand("insertLineBreak")
                e.preventDefault()
              }
            }}
            style={{ outline: "none", minHeight: "100%" }}
          />
        </Paper>

        <Group justify="center">
          <Button size="lg" onClick={handleCopy}>
            Copy text as Discord formatted
          </Button>
        </Group>

        <Text size="xs" c="dimmed" ta="center">
          This is an unofficial tool, it is not made or endorsed by Discord.
        </Text>
      </Stack>
    </Container>
  )
}

