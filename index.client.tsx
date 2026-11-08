import type { PluginClientContext } from "@getpaseo/plugin/client";

interface StyleElement {
  textContent: string | null;
  remove(): void;
}

declare const document:
  | {
      createElement(tag: "style"): StyleElement;
      head: { appendChild(element: StyleElement): void };
    }
  | undefined;

// Paseo derives plugin-theme sidebars from `background`, so the palette alone cannot
// make them darker than the workspace. On web every sidebar surface reads this variable,
// so overriding it splits the two; native keeps Paseo's derived sidebar color.
const SIDEBAR_CSS = `
html:root.pluginDark { --colors-surface-sidebar: #181825; }
html:root.pluginLight { --colors-surface-sidebar: #e6e9ef; }
[data-testid="workspace-explorer-sidebar"] [data-testid="workspace-tabs-row"] {
  background-color: var(--colors-surface-sidebar) !important;
}
`;

function paintSidebars(): () => void {
  if (typeof document === "undefined") return () => {};
  const style = document.createElement("style");
  style.textContent = SIDEBAR_CSS;
  document.head.appendChild(style);
  return () => style.remove();
}

export default function contribute(client: PluginClientContext) {
  client.addTheme({
    id: "catppuccin-exact-dark",
    name: "Catppuccin Exact",
    appearance: "dark",
    colors: {
      background: "#1e1e2e",
      foreground: "#cdd6f4",
      raised: "#181825",
      control: "#313244",
      border: "#313244",
      accent: "#cba6f7",
      mutedForeground: "#a6adc8",
      ring: "#6c7086",
    },
  });

  client.addTheme({
    id: "catppuccin-exact-light",
    name: "Catppuccin Latte Exact",
    appearance: "light",
    colors: {
      background: "#eff1f5",
      foreground: "#4c4f69",
      raised: "#e6e9ef",
      control: "#e9ebef",
      border: "#bcc0cc",
      accent: "#7130c7",
      mutedForeground: "#616274",
      ring: "#8839ef",
    },
  });

  const removeSidebars = paintSidebars();

  return () => {
    removeSidebars();
  };
}
