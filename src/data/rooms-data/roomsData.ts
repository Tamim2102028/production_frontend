export interface Room {
  id: string;
  name: string;
  coverImage?: string; // optional url/path to an image
  createdAt?: string; // ISO date string
  lastActivityAt?: string; // ISO date string
  isDeleted?: boolean; // creator can permanently delete (default: false)
  deletedAt?: string; // ISO date string when deleted
  // Additional room metadata
  university?: string;
  department?: string;
  year?: string;
  semester?: string;
  section?: string;
  subsection?: string;
}

export const sampleRooms: Room[] = [
  {
    id: "r1",
    name: "Math Study Group",
    coverImage: "https://picsum.photos/seed/r1/800/450",
    createdAt: "2024-09-10T10:00:00.000Z",
    lastActivityAt: new Date().toISOString(),
  },
  {
    id: "r2",
    name: "Frontend Helpers",
    coverImage: "https://picsum.photos/seed/r2/800/450",
    createdAt: "2025-01-15T08:30:00.000Z",
  },
  {
    id: "r3",
    name: "Private Study Room",
    coverImage: "https://picsum.photos/seed/r3/800/450",
    createdAt: "2025-06-02T12:00:00.000Z",
  },
  {
    id: "r4",
    name: "Exam Prep — 2025",
    coverImage: "https://picsum.photos/seed/r4/800/450",
    createdAt: "2025-03-20T15:45:00.000Z",
  },
  {
    id: "r5",
    name: "Gaming Lounge",
    coverImage: "https://picsum.photos/seed/r5/800/450",
    createdAt: "2024-12-01T20:00:00.000Z",
  },
  {
    id: "r6",
    name: "Career & Internships",
    coverImage: "https://picsum.photos/seed/r6/800/450",
    createdAt: "2025-02-11T09:20:00.000Z",
  },
  {
    id: "r7",
    name: "Study-Buddy Pairing",
    coverImage: "https://picsum.photos/seed/r7/800/450",
    createdAt: "2025-07-07T07:07:07.000Z",
  },
  {
    id: "r8",
    name: "Alumni Network",
    coverImage: "https://picsum.photos/seed/r8/800/450",
    createdAt: "2023-11-11T11:11:11.000Z",
    isDeleted: true,
    deletedAt: "2025-10-01T00:00:00.000Z",
  },
];

export default sampleRooms;
