export const randomStr = (len = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function urlShortenAndSave (url: string, linkKV: KVNamespace): Promise<string> {
  const key = randomStr()
  const exist = await linkKV.get(key)
  if (!exist) {
    await linkKV.put(key, url)
    return key
  }
  return await urlShortenAndSave(url, linkKV)
}
