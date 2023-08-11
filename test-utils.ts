export function html(str: string): string {
  return str
    // Remove all new redundant spaces
    .replace(/^\s+</, '<')
    .replace(/>\s+$/, '>')
    .replace(/>,\s+</g, '>, <')
    .replace(/>\s+</g, '><');
}
