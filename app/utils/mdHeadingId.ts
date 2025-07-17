export default function (text: string) {
  return text.trim().toLowerCase().replace(/[^\w]+/g, '-')
}
