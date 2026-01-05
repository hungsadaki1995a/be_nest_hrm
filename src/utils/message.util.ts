export function getMessage(msg: string, keys: string[] = []) {
  let result = msg;

  for (let i = 0; i < keys.length; i++) {
    result = result.replace(`{${i}}`, keys[i]);
  }

  return result;
}
