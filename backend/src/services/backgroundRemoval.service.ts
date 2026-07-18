// ====================================================
// Background Removal Service
// Uses @imgly/background-removal-node (runs entirely
// in Node via ONNX runtime). Lazy-loaded (dynamic import)
// so a problem with this heavy native module doesn't
// crash the entire server at startup — it only affects
// this one feature if something goes wrong.
// ====================================================

export async function removeImageBackground(buffer: Buffer): Promise<Buffer> {
  // Dynamic import — only loads this heavy native module
  // when someone actually calls this function, not when
  // the server boots.
  const { removeBackground } = await import("@imgly/background-removal-node");

  const blob = new Blob([buffer]);
  const resultBlob = await removeBackground(blob);
  const arrayBuffer = await resultBlob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
