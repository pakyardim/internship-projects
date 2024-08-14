export function getTokenFromCookies() {
  const match = document.cookie.match(new RegExp("(^| )auth-token=([^;]+)"));
  return match ? match[2] : null;
}
