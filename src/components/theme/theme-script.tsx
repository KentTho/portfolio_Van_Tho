export function ThemeScript() {
  const code = `
    try {
      var saved = localStorage.getItem("portfolio_theme");
      var theme = saved || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
      document.documentElement.setAttribute("data-theme", theme);
    } catch (e) {}
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
