import type { Group } from "./preGroupData";

export const groups: Group[] = [
  {
    id: "g1",
    name: "BUET Student Hub",
    groupFor: "students",
    description: "General space for BUET students to share resources.",
    coverImage: "https://picsum.photos/seed/g1/1200/400",
    profileImage: "https://picsum.photos/seed/a/200",
    educationLevel: "UNIVERSITY",
    university: { name: "BUET", department: "CSE", year: 1 },
    privacy: "public",
    postCount: 0,
    systemCreated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "g2",
    name: "KUET Job & Internship Hub",
    groupFor: "students",
    description: "Peer learning and coding challenges for KUET students.",
    coverImage: "https://picsum.photos/seed/g2/1200/400",
    profileImage: "https://picsum.photos/seed/b/200",
    educationLevel: "UNIVERSITY",
    university: { name: "KUET", department: "CSE" },
    type: "jobs",
    privacy: "public",
    postCount: 5,
    systemCreated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "g3",
    name: "Dhaka College Study Group",
    groupFor: "students",
    description:
      "Notes, past questions and study tips for Dhaka College students.",
    coverImage: "https://picsum.photos/seed/g3/1200/400",
    profileImage: "https://picsum.photos/seed/c/200",
    educationLevel: "COLLEGE",
    college: { name: "Dhaka College", department: "science" },
    privacy: "public",
    postCount: 2,
    systemCreated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "g4",
    name: "Student Internships & Jobs",
    groupFor: "students",
    description: "Internship leads, CV tips and job posts for students.",
    coverImage: "https://picsum.photos/seed/g4/1200/400",
    profileImage: "https://picsum.photos/seed/d/200",
    educationLevel: "POLYTECHNIC",
    type: "others",
    privacy: "public",
    postCount: 10,
    systemCreated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "g5",
    name: "BUET Robotics Club",
    groupFor: "students",
    description: "Students collaborating on robotics projects.",
    coverImage: "https://picsum.photos/seed/g5/1200/400",
    profileImage: "https://picsum.photos/seed/e/200",
    educationLevel: "UNIVERSITY",
    university: { name: "BUET", department: "CSE" },
    type: "others",
    privacy: "public",
    postCount: 8,
    systemCreated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "g6",
    name: "KUET Electronics Careers",
    groupFor: "students",
    description: "Discussions around electronics and EEE topics.",
    coverImage: "https://picsum.photos/seed/g6/1200/400",
    profileImage: "https://picsum.photos/seed/f/200",
    educationLevel: "UNIVERSITY",
    university: { name: "KUET", department: "EEE" },
    type: "jobs",
    privacy: "public",
    postCount: 3,
    systemCreated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "g7",
    name: "Holy Cross Career Opportunities",
    groupFor: "students",
    description:
      "Arts, literature and cultural discussions for Holy Cross students.",
    coverImage: "https://picsum.photos/seed/g7/1200/400",
    profileImage: "https://picsum.photos/seed/g/200",
    educationLevel: "COLLEGE",
    college: { name: "Holy Cross College", department: "arts" },
    type: "jobs",
    privacy: "public",
    postCount: 1,
    systemCreated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "g8",
    name: "Campus Jobs & Startups",
    groupFor: "students",
    description: "Startups, pitch practice and entrepreneurship resources.",
    coverImage: "https://picsum.photos/seed/g8/1200/400",
    profileImage: "https://picsum.photos/seed/h/200",
    educationLevel: "COLLEGE",
    type: "jobs",
    privacy: "public",
    postCount: 4,
    systemCreated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "g9",
    name: "Community Volunteer & Job Posts",
    groupFor: "students",
    description: "Volunteer activities and blood donation events.",
    coverImage: "https://picsum.photos/seed/g9/1200/400",
    profileImage: "https://picsum.photos/seed/i/200",
    educationLevel: "COLLEGE",
    type: "jobs",
    privacy: "public",
    postCount: 0,
    systemCreated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "g10",
    name: "General Jobs & Career Discussion",
    groupFor: "students",
    description: "Open chat for all campus-related topics.",
    coverImage: "https://picsum.photos/seed/g10/1200/400",
    profileImage: "https://picsum.photos/seed/j/200",
    educationLevel: "COLLEGE",
    type: "jobs",
    privacy: "public",
    postCount: 6,
    systemCreated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
];

// Helper functions to match previous API

export function getGroupById(id: string): Group | undefined {
  return groups.find((g) => g.id === id && g.status === "active");
}

export function getGroupsByIds(ids: string[]): Group[] {
  return groups.filter((g) => ids.includes(g.id) && g.status === "active");
}

export function getGroupsByEducationLevel(
  level:
    | "UNIVERSITY"
    | "MEDICAL_COLLEGE"
    | "NATIONAL_UNIVERSITY"
    | "COLLEGE"
    | "POLYTECHNIC"
    | "SCHOOL"
): Group[] {
  return groups.filter(
    (g) => g.educationLevel === level && g.status === "active"
  );
}

export function getGroupsByUniversity(
  university: "BUET" | "KUET" | "RUET" | "CUET" | "DU"
): Group[] {
  return groups.filter(
    (g) => g.university?.name === university && g.status === "active"
  );
}

export function getActiveGroups(): Group[] {
  return groups.filter((g) => g.status === "active");
}
