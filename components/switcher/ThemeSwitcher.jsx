/* next-themes */
import { useTheme } from "next-themes";

/* utils */
import { themes } from "@/data/utils";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <ul>
      {themes.map((t) => (
        <div
          key={t.label}
          className="form-control"
          onClick={() => setTheme(t.value)}
        >
          <label className="label cursor-pointer gap-4">
            <span className="label-text">{t.label}</span>
            <input
              type="radio"
              name="theme-radios"
              className="radio theme-controller"
              value={t.value}
              checked={theme == t.value}
              onChange={(e) => setTheme(e.target.value)} // checked property must accompanied with onChange event !!!
            />
          </label>
        </div>
      ))}
    </ul>
  );
}
