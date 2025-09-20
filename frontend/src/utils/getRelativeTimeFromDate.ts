export default function getRelativeTimeFromDate(from: Date) {
  const fromDate = new Date(new Date(from).toLocaleString());
  const now = new Date();

  const diffMs = fromDate.getTime() - now.getTime();

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year",   1000 * 60 * 60 * 24 * 365],
    ["month",  1000 * 60 * 60 * 24 * 30],
    ["week",   1000 * 60 * 60 * 24 * 7],
    ["day",    1000 * 60 * 60 * 24],
    ["hour",   1000 * 60 * 60],
    ["minute", 1000 * 60],
    ["second", 1000],
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, msInUnit] of units) {
    if (Math.abs(diffMs) >= msInUnit || unit === "second") {
      const diff = Math.round(diffMs / msInUnit);
      return rtf.format(diff, unit);
    }
  }
}