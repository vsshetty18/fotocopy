// ====================================================
// Background Removal Service
// ====================================================

export async function removeImageBackground(buffer: Buffer): Promise<Buffer> {
  const { removeBackground } = await import("@imgly/background-removal-node");

  const blob = new Blob([buffer]);
  const resultBlob = await removeBackground(blob);
  const arrayBuffer = await resultBlob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
