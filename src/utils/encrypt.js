export async function encryptPayload(payload){
  const base64Key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

  // Convert base64 string to Uint8Array
  function base64ToBytes(b64) {
    const binary = window.atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  const rawKey = base64ToBytes(base64Key);
  const key = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit nonce
  const encodedPayload = new TextEncoder().encode(JSON.stringify(payload));

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodedPayload
  );

  // GCM appends auth tag to the end automatically
  const encryptedBytes = new Uint8Array(encryptedBuffer);

  return {
    vtext: btoa(String.fromCharCode(...encryptedBytes)),
    ivv: btoa(String.fromCharCode(...iv)),
  };
}
