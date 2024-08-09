export function transformDate(date: string, locale: string) {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString(locale, { month: "short" });
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const formattedDate = `${day} ${month} ${year} ${hours}:${minutes}`;
  return formattedDate;
}

export function formatRelativeDate(date: string, locale: string) {
  const currentDate = new Date();
  const receivedDate = new Date(date);
  const timestamp = receivedDate.getTime();
  const currentTimestamp = currentDate.getTime();
  const elapsedSeconds = Math.floor((currentTimestamp - timestamp) / 1000);

  if (elapsedSeconds < 60) {
    return `${elapsedSeconds}${locale === "tr" ? "sn" : "s"}`;
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes}${locale === "tr" ? "dk" : "m"}`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);

  if (elapsedHours < 24) {
    return `${elapsedHours}${locale === "tr" ? "sa" : "h"}`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);

  if (elapsedDays < 7) {
    return `${elapsedDays}${locale === "tr" ? "g" : "d"}`;
  }

  const elapsedWeeks = Math.floor(elapsedDays / 7);

  return `${elapsedWeeks}${locale === "tr" ? "h" : "w"}`;
}
