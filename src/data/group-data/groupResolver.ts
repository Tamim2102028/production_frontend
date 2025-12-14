import { preGroups } from "./preGroupData";
import { groups } from "./groupsData";

import type { Group as PreGroup } from "./preGroupData";

// groupsData does not export a named Group type; reuse the PreGroup shape as the
// common shape for fixtures. In practice both fixtures share the same shape.
export type AnyGroup = PreGroup;

/**
 * Find a group by id.
 * If the id starts with 'pg' we only look in preGroups (pre-created groups).
 * Otherwise we prefer the live groups array and fallback to preGroups.
 */
export function findGroupById(id: string): AnyGroup | undefined {
  if (!id) return undefined;
  // NOTE for future backend integration:
  // If your real backend stores both pre-created groups and live groups in a
  // single collection with identical id formats (e.g. all ids like "g123"),
  // you can simplify this function to just look up the single collection and
  // remove the `pg` prefix check. Example replacement when backend is
  // uniform:
  //    return allGroupsCollection.find(g => g.id === id);
  // For now we maintain compatibility with the local fixtures which use
  // `pg*` ids for preGroups and `g*` for live groups.

  if (id.startsWith("pg")) {
    return preGroups.find((p) => p.id === id);
  }

  const live = groups.find((g) => g.id === id);
  if (live) return live;
}

/**
 * Return all closed groups from both preGroups and live groups.
 */
export function getClosedGroups(): AnyGroup[] {
  const closedPre = preGroups.filter((p) => p.privacy === "closed");
  const closedLive = groups.filter((g) => g.privacy === "closed");
  // dedupe by id
  const map = new Map<string, AnyGroup>();
  closedPre.forEach((g) => map.set(g.id, g));
  closedLive.forEach((g) => map.set(g.id, g));
  return Array.from(map.values());
}

/**
 * Resolve a list of ids into group objects (skips missing groups).
 */
export function resolveGroupsByIds(ids: string[] | undefined): AnyGroup[] {
  if (!ids || ids.length === 0) return [];
  return ids
    .map((id) => findGroupById(id))
    .filter((g): g is AnyGroup => Boolean(g));
}

export { preGroups, groups as liveGroups };
