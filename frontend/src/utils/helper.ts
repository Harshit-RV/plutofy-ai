class Helper {
  static convertMongoTimestampToLocal = (mongoTimestamp: Date): string => {
    const date = new Date(mongoTimestamp);
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    // Determine AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? hours : 12;
  
    const formattedDate = `${String(hours).padStart(2, '0')}:${minutes} ${period}, ${day}/${month}/${year} `;
  
    return formattedDate;
  };

  static getRelativeTimeFromDate(from: Date) {
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

  static truncateString(str: string, length: number = 50): string {
    return str.length > length ? str.slice(0, length) + "..." : str;
  }
}

export default Helper;