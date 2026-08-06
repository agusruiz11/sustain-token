import { useEffect, useState } from 'react';

/* Caché a nivel de módulo: el hash de un contenido dado no cambia nunca, así que
   se calcula una sola vez por sesión aunque el componente se remonte. */
const cache = new Map();

async function digest(text) {
  if (cache.has(text)) return cache.get(text);
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  cache.set(text, hex);
  return hex;
}

/**
 * Calcula el SHA-256 real del contenido de un archivo con Web Crypto.
 *
 * No es un hash simulado: el contenido de los artefactos JSON se genera desde
 * los datos reales de la acción, así que este hash identifica de verdad a ese
 * archivo. Es lo que permite que "verificar integridad" haga algo real.
 *
 * `crypto.subtle` sólo existe en contextos seguros (https y localhost). Si no
 * está disponible se devuelve estado 'unsupported' en lugar de romper.
 *
 * Todo lo que se puede saber sin esperar —caché, ausencia de contenido, falta de
 * soporte— se deriva durante el render. El estado existe únicamente para que el
 * resultado asíncrono provoque un re-render, así se evitan renders en cascada.
 *
 * @returns {{ hash: string|null, status: 'idle'|'computing'|'ready'|'unsupported' }}
 */
export function useSha256(text) {
  const [computed, setComputed] = useState(null);

  useEffect(() => {
    // Nada que esperar: ya está en caché, no hay contenido, o no hay Web Crypto.
    if (text == null || cache.has(text) || !globalThis.crypto?.subtle) return;

    let vigente = true;
    digest(text).then((hex) => {
      // El archivo pudo cambiar mientras se calculaba: descartar el resultado viejo.
      if (vigente) setComputed({ text, hash: hex });
    });
    return () => { vigente = false; };
  }, [text]);

  if (text == null) return { hash: null, status: 'idle' };
  if (cache.has(text)) return { hash: cache.get(text), status: 'ready' };
  if (!globalThis.crypto?.subtle) return { hash: null, status: 'unsupported' };
  if (computed?.text === text) return { hash: computed.hash, status: 'ready' };
  return { hash: null, status: 'computing' };
}
