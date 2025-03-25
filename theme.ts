import { createTheme } from "@mantine/core"

export const theme = createTheme({
  primaryColor: "indigo",
  colors: {
    discord: [
      "#7289DA",
      "#677BC4",
      "#5C6FB1",
      "#5865F2", // Discord blurple
      "#4E5AE0",
      "#4752C4",
      "#3C45A5",
      "#343C8C",
      "#2D3480",
      "#272C70",
    ],
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5c5f66",
      "#373A40",
      "#2C2E33",
      "#25262b",
      "#1A1B1E",
      "#141517",
      "#101113",
    ],
  },
  components: {
    Container: {
      defaultProps: {
        size: "lg",
      },
    },
  },
})

