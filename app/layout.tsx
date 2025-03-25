import type React from "react"
import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"
import "./globals.css"
import { MantineProvider, ColorSchemeScript } from "@mantine/core"
import { Notifications } from "@mantine/notifications"

export const metadata = {
  title: "Discord Colored Text Generator",
  description: "Create colored Discord messages using ANSI color codes"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no" />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">
          <Notifications position="top-center" />
          {children}
        </MantineProvider>
      </body>
    </html>
  )
}