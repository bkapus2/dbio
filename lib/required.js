export default function required(str) {
  throw new Error(`${str} is a required parameter`)
}