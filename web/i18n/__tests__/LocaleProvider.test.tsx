import { render, screen, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LocaleProvider, useLocale, useT } from "@/i18n/LocaleProvider";

const STORAGE_KEY = "portfolio.locale";

function Probe() {
  const { locale, setLocale } = useLocale();
  const t = useT();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="brand">{t.nav.brand}</span>
      <button onClick={() => setLocale("no")}>to-no</button>
      <button onClick={() => setLocale("en")}>to-en</button>
    </div>
  );
}

beforeEach(() => window.localStorage.clear());
afterEach(() => window.localStorage.clear());

describe("LocaleProvider", () => {
  it("defaults to English", () => {
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("locale")).toHaveTextContent("en");
    expect(screen.getByTestId("brand")).toHaveTextContent("Portfolio");
  });

  it("restores a stored locale and serves its messages", () => {
    window.localStorage.setItem(STORAGE_KEY, "no");
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("locale")).toHaveTextContent("no");
    expect(screen.getByTestId("brand")).toHaveTextContent("Portefølje");
  });

  it("setLocale switches messages and persists", () => {
    render(
      <LocaleProvider>
        <Probe />
      </LocaleProvider>,
    );
    act(() => screen.getByText("to-no").click());
    expect(screen.getByTestId("brand")).toHaveTextContent("Portefølje");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("no");
  });
});
