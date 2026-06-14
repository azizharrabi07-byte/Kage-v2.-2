export function checkWebGL(): { supported: boolean; info: string } {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
    if (!gl) return { supported: false, info: 'WebGL not supported' };
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      return { supported: true, info: renderer };
    }
    return { supported: true, info: 'WebGL supported' };
  } catch {
    return { supported: false, info: 'WebGL check failed' };
  }
}
