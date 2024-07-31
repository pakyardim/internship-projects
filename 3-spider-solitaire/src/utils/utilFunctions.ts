export const convertSecsToTime = (secs: number): string => {
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  const seconds = Math.floor(secs % 60);

  return `${hours > 0 ? hours + ":" : ""}${
    minutes < 10 && hours > 0 ? "0" + minutes : minutes
  }:${seconds < 10 ? "0" + seconds : seconds}`;
};
