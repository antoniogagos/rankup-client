export function getPath(path: string, moduleUrl: string): string {
  return new URL(`../../assets/${path}`, moduleUrl).href;
}
