export interface Group {
  id: string;
  name: string;
  groupFor: "students" | "teachers" | "both";
  gender?: ("male" | "female")[];
  type?: "academic" | "hall" | "jobs" | "others";
  description?: string;
  coverImage?: string;
  profileImage?: string;
  rules?: string[];
  tags?: string[];

  educationLevel?:
    | "UNIVERSITY"
    | "MEDICAL_COLLEGE"
    | "NATIONAL_UNIVERSITY"
    | "COLLEGE"
    | "POLYTECHNIC"
    | "SCHOOL";

  privacy: "public" | "private" | "closed";

  university?: {
    name: "BUET" | "DU" | "RUET" | "CUET" | "KUET";
    department?: "CSE" | "EEE" | "ME" | "CE" | "CHE";
    section?: "A" | "B" | "C";
    subsection?: "1" | "2";
    year?: 1 | 2 | 3 | 4 | 5;
    semester?: 1 | 2;
  };

  college?: {
    name:
      | "Notre Dame College"
      | "Holy Cross College"
      | "Dhaka College"
      | "Rajuk College";
    boardType?: "madrasah" | "general";
    board?: "dhaka" | "chittagong";
    department?: "science" | "commerce" | "arts";
    year?: "1" | "2" | "admission";
    version?: "bangla" | "english";
    medium?: "bangla" | "english";
  };

  // owner: Moved to groupMembers.ts - use getGroupOwner(groupId) instead
  // admins: Moved to groupMembers.ts - use getGroupAdmins(groupId) instead
  // members: Moved to groupMembers.ts - use getMembersForGroup(groupId) instead

  postCount?: number; // helpful for quick queries
  systemCreated?: boolean; // if created by app itself

  createdAt: Date;
  updatedAt: Date;
  status: "active" | "deleted";
}

// Sample Pre Groups data
export const preGroups: Group[] = [
  // Pre-created closed university groups
  {
    id: "pg1",
    name: "BUET Official: CSE Freshers",
    groupFor: "students",
    type: "academic",
    description: "Closed group pre-created for BUET CSE freshmen (official).",
    coverImage: "https://picsum.photos/seed/g1/1200/400",
    profileImage: "https://picsum.photos/seed/g1p/200/200",
    educationLevel: "UNIVERSITY",
    university: { name: "BUET", department: "CSE", year: 1 },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg2",
    name: "BUET Official: MME Batch",
    groupFor: "students",
    type: "academic",
    coverImage: "https://picsum.photos/seed/g2/1200/400",
    profileImage: "https://picsum.photos/seed/g2p/200/200",
    educationLevel: "UNIVERSITY",
    // MME not in enum, omit department to keep type-safe
    university: { name: "BUET" },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },

  // Pre-created closed college (HSC) groups
  {
    id: "pg3",
    name: "Dhaka College - Science (Official)",
    groupFor: "students",
    type: "academic",
    description: "Closed official group for Dhaka College Science students.",
    coverImage: "https://picsum.photos/seed/g3/1200/400",
    profileImage: "https://picsum.photos/seed/g3p/200/200",
    educationLevel: "COLLEGE",
    college: { name: "Dhaka College", department: "science" },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg4",
    name: "Notre Dame - Commerce (Official)",
    groupFor: "students",
    type: "academic",
    coverImage: "https://picsum.photos/seed/g4/1200/400",
    profileImage: "https://picsum.photos/seed/g4p/200/200",
    educationLevel: "COLLEGE",
    college: { name: "Notre Dame College", department: "commerce" },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },

  // Open university groups (user-created/system)
  {
    id: "pg5",
    name: "BUET Architecture Club",
    groupFor: "students",
    type: "academic",
    description:
      "Open community for BUET Architecture students to share resources.",
    coverImage: "https://picsum.photos/seed/g5/1200/400",
    profileImage: "https://picsum.photos/seed/g5p/200/200",
    educationLevel: "UNIVERSITY",
    university: { name: "BUET" },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg6",
    name: "KUET EEE Study Circle",
    groupFor: "students",
    type: "academic",
    description: "Open study group for KUET EEE students.",
    coverImage: "https://picsum.photos/seed/g6/1200/400",
    profileImage: "https://picsum.photos/seed/g6p/200/200",
    educationLevel: "UNIVERSITY",
    university: { name: "KUET", department: "EEE" },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg7",
    name: "RUET ME Projects",
    groupFor: "students",
    type: "academic",
    description: "Project help and discussion for RUET ME students.",
    coverImage: "https://picsum.photos/seed/g7/1200/400",
    profileImage: "https://picsum.photos/seed/g7p/200/200",
    educationLevel: "UNIVERSITY",
    university: { name: "RUET", department: "ME" },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },

  // Open college groups
  {
    id: "pg8",
    name: "Dhaka College - Study Group",
    groupFor: "students",
    type: "academic",
    description: "Open study community for Dhaka College students.",
    coverImage: "https://picsum.photos/seed/g8/1200/400",
    profileImage: "https://picsum.photos/seed/g8p/200/200",
    educationLevel: "COLLEGE",
    college: { name: "Dhaka College", department: "science" },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg9",
    name: "Rajuk College - Commerce Hub",
    groupFor: "students",
    type: "academic",
    description: "Open discussion space for commerce students.",
    coverImage: "https://picsum.photos/seed/g9/1200/400",
    profileImage: "https://picsum.photos/seed/g9p/200/200",
    educationLevel: "COLLEGE",
    college: { name: "Rajuk College", department: "commerce" },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },

  // Jobs-like / polytechnic groups
  {
    id: "pg10",
    name: "Software Engineering Jobs",
    groupFor: "students",
    type: "academic",
    description: "Job posts and discussions for software roles.",
    coverImage: "https://picsum.photos/seed/g10/1200/400",
    educationLevel: "POLYTECHNIC",
    privacy: "public",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg11",
    name: "Banking Careers",
    groupFor: "students",
    type: "academic",
    description: "Banking job circulars and exam tips.",
    coverImage: "https://picsum.photos/seed/g11/1200/400",
    educationLevel: "POLYTECHNIC",
    privacy: "private",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },

  // Additional open university groups
  {
    id: "pg12",
    name: "BUET Robotics Club",
    groupFor: "students",
    type: "academic",
    description: "Students collaborating on robotics projects.",
    coverImage: "https://picsum.photos/seed/g12/1200/400",
    educationLevel: "UNIVERSITY",
    university: { name: "BUET", department: "CSE" },
    privacy: "public",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg13",
    name: "KUET Coding Circle",
    groupFor: "students",
    type: "academic",
    description: "Peer learning and coding challenges for KUET students.",
    coverImage: "https://picsum.photos/seed/g13/1200/400",
    educationLevel: "UNIVERSITY",
    university: { name: "KUET", department: "CSE" },
    privacy: "public",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg14",
    name: "RUET Alumni Connect",
    groupFor: "students",
    type: "academic",
    description: "Alumni and current students networking group.",
    coverImage: "https://picsum.photos/seed/g14/1200/400",
    educationLevel: "UNIVERSITY",
    university: { name: "RUET" },
    privacy: "public",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },

  // Additional college open groups
  {
    id: "pg15",
    name: "Holy Cross Literature Club",
    groupFor: "students",
    description: "Arts and literature discussions for Holy Cross students.",
    coverImage: "https://picsum.photos/seed/g15/1200/400",
    educationLevel: "COLLEGE",
    college: { name: "Holy Cross College", department: "arts" },
    privacy: "public",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg16",
    name: "Saint Joseph Study Group",
    groupFor: "students",
    description: "Peer study and notes sharing for Saint Joseph students.",
    coverImage: "https://picsum.photos/seed/g16/1200/400",
    educationLevel: "COLLEGE",
    college: {
      name: "Holy Cross College",
      department: "arts",
    },
    privacy: "public",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },

  // Student careers / internships (university-facing)
  {
    id: "pg17",
    name: "Student Careers & Internships",
    groupFor: "students",
    description: "Resources and internship postings for students.",
    coverImage: "https://picsum.photos/seed/g17/1200/400",
    educationLevel: "UNIVERSITY",
    privacy: "public",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg18",
    name: "Freelance & Remote Opportunities",
    groupFor: "students",
    description: "Jobs and tips for freelancing students.",
    coverImage: "https://picsum.photos/seed/g18/1200/400",
    educationLevel: "POLYTECHNIC",
    privacy: "public",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },

  // Final entries
  {
    id: "pg19",
    name: "General Discussion",
    groupFor: "students",
    description: "A general chat area for students across institutions.",
    coverImage: "https://picsum.photos/seed/g19/1200/400",
    educationLevel: "COLLEGE",
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg20",
    name: "Internship Circle",
    groupFor: "students",
    description: "Students sharing internship leads and CV tips.",
    coverImage: "https://picsum.photos/seed/g20/1200/400",
    educationLevel: "POLYTECHNIC",
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg21",
    name: "CUET EEE Projects",
    groupFor: "students",
    description: "Project help for CUET EEE students.",
    coverImage: "https://picsum.photos/seed/g21/1200/400",
    educationLevel: "UNIVERSITY",
    university: { name: "CUET", department: "EEE" },
    privacy: "public",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg22",
    name: "Career Prep - Campus",
    groupFor: "students",
    description: "Interview prep and career talks for campus students.",
    coverImage: "https://picsum.photos/seed/g22/1200/400",
    educationLevel: "UNIVERSITY",
    privacy: "public",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg23",
    name: "RUET Research Group",
    groupFor: "students",
    description: "Research collaboration for RUET students and faculty.",
    coverImage: "https://picsum.photos/seed/g23/1200/400",
    educationLevel: "UNIVERSITY",
    university: { name: "RUET", department: "CSE" },
    privacy: "private",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg24",
    name: "Student Entrepreneurship",
    groupFor: "students",
    description: "Startups and entrepreneurship for students.",
    coverImage: "https://picsum.photos/seed/g24/1200/400",
    educationLevel: "COLLEGE",
    privacy: "public",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg25",
    name: "Community Volunteers",
    groupFor: "students",
    description: "Volunteer and blood donation events in campus areas.",
    coverImage: "https://picsum.photos/seed/g25/1200/400",
    educationLevel: "COLLEGE",
    privacy: "public",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  // BUET / KUET × CSE / EEE × section A/B × subsection 1/2 combinations
  {
    id: "pg26",
    name: "BUET CSE A-1",
    groupFor: "students",
    type: "hall",
    gender: ["male"],
    description: "BUET CSE students (section A, subsection 1).",
    coverImage: "https://picsum.photos/seed/g26/1200/400",
    educationLevel: "UNIVERSITY",
    university: {
      name: "BUET",
      department: "CSE",
      section: "A",
      subsection: "1",
    },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg27",
    name: "BUET CSE A-2",
    groupFor: "students",
    type: "hall",
    gender: ["male"],
    description: "BUET CSE students (section A, subsection 2).",
    coverImage: "https://picsum.photos/seed/g27/1200/400",
    educationLevel: "UNIVERSITY",
    university: {
      name: "BUET",
      department: "CSE",
      section: "A",
      subsection: "2",
    },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg28",
    name: "BUET CSE B-1",
    groupFor: "students",
    type: "hall",
    gender: ["female"],
    description: "BUET CSE students (section B, subsection 1).",
    coverImage: "https://picsum.photos/seed/g28/1200/400",
    educationLevel: "UNIVERSITY",
    university: {
      name: "BUET",
      department: "CSE",
      section: "B",
      subsection: "1",
    },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg29",
    name: "BUET CSE B-2",
    groupFor: "students",
    type: "hall",
    gender: ["female"],
    description: "BUET CSE students (section B, subsection 2).",
    coverImage: "https://picsum.photos/seed/g29/1200/400",
    educationLevel: "UNIVERSITY",
    university: {
      name: "BUET",
      department: "CSE",
      section: "B",
      subsection: "2",
    },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg30",
    name: "BUET EEE A-1",
    groupFor: "students",
    description: "BUET EEE students (section A, subsection 1).",
    coverImage: "https://picsum.photos/seed/g30/1200/400",
    educationLevel: "UNIVERSITY",
    university: {
      name: "BUET",
      department: "EEE",
      section: "A",
      subsection: "1",
    },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg31",
    name: "BUET EEE A-2",
    groupFor: "students",
    description: "BUET EEE students (section A, subsection 2).",
    coverImage: "https://picsum.photos/seed/g31/1200/400",
    educationLevel: "UNIVERSITY",
    university: {
      name: "BUET",
      department: "EEE",
      section: "A",
      subsection: "2",
    },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg32",
    name: "BUET EEE B-1",
    groupFor: "students",
    description: "BUET EEE students (section B, subsection 1).",
    coverImage: "https://picsum.photos/seed/g32/1200/400",
    educationLevel: "UNIVERSITY",
    university: {
      name: "BUET",
      department: "EEE",
      section: "B",
      subsection: "1",
    },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg33",
    name: "BUET EEE B-2",
    groupFor: "students",
    description: "BUET EEE students (section B, subsection 2).",
    coverImage: "https://picsum.photos/seed/g33/1200/400",
    educationLevel: "UNIVERSITY",
    university: {
      name: "BUET",
      department: "EEE",
      section: "B",
      subsection: "2",
    },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg34",
    name: "KUET CSE A-1",
    groupFor: "students",
    description: "KUET CSE students (section A, subsection 1).",
    coverImage: "https://picsum.photos/seed/g34/1200/400",
    educationLevel: "UNIVERSITY",
    university: {
      name: "KUET",
      department: "CSE",
      section: "A",
      subsection: "1",
    },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg35",
    name: "KUET CSE A-2",
    groupFor: "students",
    description: "KUET CSE students (section A, subsection 2).",
    coverImage: "https://picsum.photos/seed/g35/1200/400",
    educationLevel: "UNIVERSITY",
    university: {
      name: "KUET",
      department: "CSE",
      section: "A",
      subsection: "2",
    },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg36",
    name: "KUET CSE B-1",
    groupFor: "students",
    description: "KUET CSE students (section B, subsection 1).",
    coverImage: "https://picsum.photos/seed/g36/1200/400",
    educationLevel: "UNIVERSITY",
    university: {
      name: "KUET",
      department: "CSE",
      section: "B",
      subsection: "1",
    },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg37",
    name: "KUET CSE B-2",
    groupFor: "students",
    description: "KUET CSE students (section B, subsection 2).",
    coverImage: "https://picsum.photos/seed/g37/1200/400",
    educationLevel: "UNIVERSITY",
    university: {
      name: "KUET",
      department: "CSE",
      section: "B",
      subsection: "2",
    },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg38",
    name: "KUET EEE A-1",
    groupFor: "students",
    description: "KUET EEE students (section A, subsection 1).",
    coverImage: "https://picsum.photos/seed/g38/1200/400",
    educationLevel: "UNIVERSITY",
    university: {
      name: "KUET",
      department: "EEE",
      section: "A",
      subsection: "1",
    },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg39",
    name: "KUET EEE A-2",
    groupFor: "students",
    description: "KUET EEE students (section A, subsection 2).",
    coverImage: "https://picsum.photos/seed/g39/1200/400",
    educationLevel: "UNIVERSITY",
    university: {
      name: "KUET",
      department: "EEE",
      section: "A",
      subsection: "2",
    },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
  {
    id: "pg40",
    name: "KUET EEE B-1",
    groupFor: "students",
    description: "KUET EEE students (section B, subsection 1).",
    coverImage: "https://picsum.photos/seed/g40/1200/400",
    educationLevel: "UNIVERSITY",
    university: {
      name: "KUET",
      department: "EEE",
      section: "B",
      subsection: "1",
    },
    privacy: "closed",
    systemCreated: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "active",
  },
];

// Helper functions

// Get a specific group by ID (if active)
export function getGroupById(id: string): Group | undefined {
  return preGroups.find(
    (group: Group) => group.id === id && group.status === "active"
  );
}

// Get multiple groups by their IDs (only active ones)
export function getGroupsByIds(ids: string[]): Group[] {
  return preGroups.filter(
    (group: Group) => ids.includes(group.id) && group.status === "active"
  );
}

// Get groups by education level
export function getGroupsByEducationLevel(
  level:
    | "UNIVERSITY"
    | "MEDICAL_COLLEGE"
    | "NATIONAL_UNIVERSITY"
    | "COLLEGE"
    | "POLYTECHNIC"
    | "SCHOOL"
): Group[] {
  return preGroups.filter(
    (group) => group.educationLevel === level && group.status === "active"
  );
}

// Get groups by university
export function getGroupsByUniversity(
  university: "BUET" | "KUET" | "RUET" | "CUET" | "DU"
): Group[] {
  return preGroups.filter(
    (group) =>
      group.university?.name === university && group.status === "active"
  );
}
