/**
 * Remove spaces to have viable ids
 */
export function cleanId(id) {
  return id.replace(' ', '_');
}