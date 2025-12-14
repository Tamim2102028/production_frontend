import { usersData, type UserData } from "./userData";

/**
 * Small in-repo helpers that operate on the seeded `usersData` array.
 * These were previously colocated in `userData.ts`. The project wants
 * `userData.ts` to export only data; helpers live here instead.
 */
export const getCurrentUserId = (): string => {
  // In this preview app the current user is the first seeded user (id: "1").
  // Replace with real auth lookup when wiring to a backend.
  return "1";
};

export const getUserById = (userId: string): UserData | null => {
  return usersData.find((u) => u.id === userId) || null;
};

export const updateUserById = (
  userId: string,
  updatedData: Partial<UserData>
): boolean => {
  const idx = usersData.findIndex((u) => u.id === userId);
  if (idx === -1) return false;
  usersData[idx] = { ...usersData[idx], ...updatedData };
  return true;
};

export default { getCurrentUserId, getUserById, updateUserById };
