import { usersData, type UserData } from "../data/profile-data/userData";

export const getCurrentUserId = (): string => {
  // preview: current user is seeded user id "1". Replace with auth lookup.
  return "1";
};

export const getUserById = (id: string): UserData | null => {
  return usersData.find((u) => u.id === id) || null;
};

export const updateUserById = (id: string, updates: Partial<UserData>) => {
  const idx = usersData.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  usersData[idx] = { ...usersData[idx], ...updates };
  return true;
};

export default { getCurrentUserId, getUserById, updateUserById };
