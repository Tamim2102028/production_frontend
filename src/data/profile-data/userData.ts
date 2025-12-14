export interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  avatar: string;
  bio?: string;
  status?: boolean;
  userType: ("student" | "teacher" | "system" | "other")[];
  gender?: "male" | "female";
  religion?: "Islam" | "Hindu" | "Christian" | "Other";

  educationLevel: "UNIVERSITY" | "COLLEGE";

  // optional office hours for users who are teachers
  officeHours?: {
    id: string;
    start: string; // ISO
    end: string; // ISO
    location?: string;
  }[];

  university?: {
    name: "BUET" | "DU" | "RUET" | "CUET" | "KUET";
    title?:
      | "Lecturer"
      | "Assistant Professor"
      | "Associate Professor"
      | "Professor";
    department?: "CSE" | "EEE" | "ME" | "CE" | "CHE";
    section?: "A" | "B" | "C";
    subsection?: "1" | "2";
    roll?: string;
    year?: 1 | 2 | 3 | 4 | 5;
    semester?: 1 | 2;
    isCr?: boolean;
  };

  college?: {
    name:
      | "Notre Dame College"
      | "Holy Cross College"
      | "Dhaka College"
      | "Rajuk College";
    boardType?: "madrasah" | "general";
    board?: "dhaka" | "chittagong" | "rajshahi";
    department?: "science" | "commerce" | "arts";
    year?: "1" | "2" | "admission";
    section?: string;
    roll?: string;
    version?: "bangla" | "english";
    medium?: "bangla" | "english";
    sscBatch?: string;
  };

  // ❌ Removed: friends, pendingRequests, sentRequests
  // ✅ Now handled by separate friendships.ts and friendRequests.ts files

  saved?: string[];

  preJoinedGroup?: string[];
  joinedGroup?: string[];
  sentRequestGroup?: string[];
}

export const rawUsersData: UserData[] = [
  {
    id: "1",
    name: "Rifat Rahman (1/15)",
    username: "rifatr",
    email: "rifat3@example.com",
    password: "pass3",
    phone: "01710000003",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    bio: "Assistant lecturer in Chemical Engineering. Available for office hours and consultation.",
    userType: ["teacher"],
    gender: "male",
    religion: "Islam",
    educationLevel: "UNIVERSITY",
    university: {
      name: "BUET",
      department: "CHE",
      section: "A",
      subsection: "1",
      year: 3,
      semester: 1,
      isCr: true,
    },
    status: true,
    officeHours: [
      {
        id: "oh1-1",
        start: "2025-10-24T11:00:00.000Z",
        end: "2025-10-24T12:00:00.000Z",
        location: "Office 101",
      },
    ],

    saved: [],

    preJoinedGroup: ["pg1", "pg2", "pg5"],
    joinedGroup: ["g1", "g2", "g6", "g8"],
    sentRequestGroup: ["g4", "g5", "g10"],
  },
  {
    id: "2",
    name: "Tanvir Ahmed (2/15)",
    username: "tanvira",
    email: "tanvir5@example.com",
    password: "pass5",
    phone: "01710000005",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    bio: "Polytechnic student",
    userType: ["student"],
    gender: "male",
    religion: "Islam",
    educationLevel: "COLLEGE",
    college: {
      name: "Dhaka College",
      boardType: "general",
      board: "dhaka",
      department: "science",
      year: "1",
      version: "bangla",
      medium: "bangla",
    },
    status: true,
    saved: [],
    preJoinedGroup: [],
    joinedGroup: [],
    sentRequestGroup: [],
  },
  {
    id: "3",
    name: "Sabbir Hossain (3/15)",
    username: "sabbirh",
    email: "sabbir11@example.com",
    password: "pass11",
    phone: "01710000011",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    bio: "National University student",
    userType: ["student"],
    gender: "male",
    religion: "Islam",
    educationLevel: "UNIVERSITY",
    university: {
      name: "DU",
      department: "CSE",
      section: "B",
      subsection: "2",
      year: 2,
      semester: 1,
      isCr: true,
    },
    status: true,
    saved: [],
    preJoinedGroup: [],
    joinedGroup: [],
    sentRequestGroup: [],
  },
  {
    id: "4",
    name: "Mahmudul Hasan (4/15)",
    username: "mahmudulh",
    email: "mahmudul13@example.com",
    password: "pass13",
    phone: "01710000013",
    avatar: "https://randomuser.me/api/portraits/men/13.jpg",
    bio: "School student",
    userType: ["student"],
    gender: "male",
    religion: "Islam",
    educationLevel: "COLLEGE",
    college: {
      name: "Dhaka College",
      boardType: "general",
      board: "dhaka",
      department: "science",
      year: "1",
      version: "bangla",
      medium: "bangla",
    },
    status: true,
    saved: [],
    preJoinedGroup: [],
    joinedGroup: [],
    sentRequestGroup: [],
  },
  {
    id: "5",
    name: "Fahim Hasan (5/15)",
    username: "fahimh",
    email: "fahim23@example.com",
    password: "pass23",
    phone: "01710000023",
    avatar: "https://randomuser.me/api/portraits/men/23.jpg",
    bio: "Polytechnic student",
    userType: ["student"],
    gender: "male",
    religion: "Islam",
    educationLevel: "COLLEGE",
    college: {
      name: "Dhaka College",
      boardType: "general",
      board: "dhaka",
      department: "science",
      year: "2",
      version: "english",
      medium: "english",
    },
    status: true,
    saved: [],
    preJoinedGroup: [],
    joinedGroup: [],
    sentRequestGroup: [],
  },
  {
    id: "6",
    name: "Maliha Sultana (6/15)",
    username: "malihas",
    email: "maliha26@example.com",
    password: "pass26",
    phone: "01710000026",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg",
    bio: "School student",
    userType: ["student"],
    gender: "female",
    religion: "Islam",
    educationLevel: "COLLEGE",
    college: {
      name: "Holy Cross College",
      boardType: "general",
      board: "dhaka",
      department: "arts",
      year: "1",
      version: "bangla",
      medium: "bangla",
    },
    status: true,
    saved: [],
    preJoinedGroup: [],
    joinedGroup: [],
    sentRequestGroup: [],
  },
  {
    id: "7",
    name: "Shirin Akter (7/15)",
    username: "shirina",
    email: "shirin24@example.com",
    password: "pass24",
    phone: "01710000024",
    avatar: "https://randomuser.me/api/portraits/women/24.jpg",
    bio: "School teacher",
    userType: ["teacher"],
    gender: "female",
    religion: "Islam",
    educationLevel: "COLLEGE",
    college: {
      name: "Rajuk College",
      boardType: "general",
      board: "dhaka",
      department: "science",
      year: "2",
      version: "english",
      medium: "english",
    },
    status: true,
    officeHours: [
      {
        id: "oh7-1",
        start: "2025-10-23T10:00:00.000Z",
        end: "2025-10-23T11:00:00.000Z",
        location: "Room 12",
      },
    ],
    saved: [],
    preJoinedGroup: [],
    joinedGroup: [],
    sentRequestGroup: [],
  },
  {
    id: "8",
    name: "Rony Ahmed (8/15)",
    username: "ronya",
    email: "rony25@example.com",
    password: "pass25",
    phone: "01710000025",
    avatar: "https://randomuser.me/api/portraits/men/25.jpg",
    bio: "National University teacher",
    userType: ["teacher"],
    gender: "male",
    religion: "Islam",
    educationLevel: "UNIVERSITY",
    university: {
      name: "RUET",
      title: "Lecturer",
      department: "ME",
      year: 3,
      semester: 2,
    },
    status: true,
    officeHours: [
      {
        id: "oh8-1",
        start: "2025-10-24T14:00:00.000Z",
        end: "2025-10-24T15:00:00.000Z",
        location: "Zoom",
      },
      {
        id: "oh8-2",
        start: "2025-10-25T09:00:00.000Z",
        end: "2025-10-25T10:00:00.000Z",
        location: "Room 301",
      },
    ],
    saved: [],
    preJoinedGroup: [],
    joinedGroup: [],
    sentRequestGroup: [],
  },
  {
    id: "9",
    name: "Sabbir khan (9/15)",
    username: "sabbirk",
    email: "sabbirk@example.com",
    password: "pass9",
    phone: "01710000029",
    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    bio: "University student",
    userType: ["student"],
    gender: "female",
    religion: "Islam",
    educationLevel: "UNIVERSITY",
    university: {
      name: "CUET",
      department: "ME",
      year: 2,
      semester: 2,
    },
    status: true,
    saved: [],
    preJoinedGroup: [],
    joinedGroup: [],
    sentRequestGroup: [],
  },
  {
    id: "10",
    name: "Imran Hossain (10/15)",
    username: "imran10",
    email: "imran10@example.com",
    password: "pass10",
    phone: "01710000030",
    avatar: "https://randomuser.me/api/portraits/men/30.jpg",
    bio: "College student",
    userType: ["student"],
    gender: "male",
    religion: "Islam",
    educationLevel: "COLLEGE",
    college: {
      name: "Notre Dame College",
      boardType: "general",
      board: "dhaka",
      department: "commerce",
      year: "2",
      version: "english",
      medium: "english",
    },
    status: true,
    saved: [],
    preJoinedGroup: [],
    joinedGroup: [],
    sentRequestGroup: [],
  },
  {
    id: "11",
    name: "Rashedul Islam (11/15)",
    username: "rashedul11",
    email: "rashedul11@example.com",
    password: "pass11",
    phone: "01710000031",
    avatar: "https://randomuser.me/api/portraits/men/31.jpg",
    bio: "Faculty in Mechanical Engineering with interest in thermodynamics and labs.",
    userType: ["teacher"],
    gender: "male",
    religion: "Islam",
    educationLevel: "UNIVERSITY",
    university: {
      name: "DU",
      department: "ME",
      section: "A",
      subsection: "1",
      year: 4,
      semester: 2,
    },
    status: true,
    officeHours: [
      {
        id: "oh11-1",
        start: "2025-10-25T14:00:00.000Z",
        end: "2025-10-25T15:00:00.000Z",
        location: "Dept Office",
      },
    ],
    saved: [],
    preJoinedGroup: [],
    joinedGroup: [],
    sentRequestGroup: [],
  },
  {
    id: "12",
    name: "Farzana Akter (12/15)",
    username: "farzana12",
    email: "farzana12@example.com",
    password: "pass12",
    phone: "01710000032",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    bio: "School student",
    userType: ["student"],
    gender: "female",
    religion: "Islam",
    educationLevel: "COLLEGE",
    college: {
      name: "Holy Cross College",
      boardType: "general",
      board: "dhaka",
      department: "arts",
      year: "2",
      version: "bangla",
      medium: "bangla",
    },
    status: true,
    saved: [],
    preJoinedGroup: [],
    joinedGroup: [],
    sentRequestGroup: [],
  },
  {
    id: "13",
    name: "Samiul Islam (13/15)",
    username: "samiul13",
    email: "samiul13@example.com",
    password: "pass13",
    phone: "01710000033",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    bio: "Polytechnic teacher",
    userType: ["teacher"],
    gender: "male",
    religion: "Islam",
    educationLevel: "COLLEGE",
    college: {
      name: "Rajuk College",
      boardType: "general",
      board: "dhaka",
      department: "science",
      year: "admission",
      version: "english",
      medium: "english",
    },
    status: true,
    officeHours: [
      {
        id: "oh13-1",
        start: "2025-10-22T12:00:00.000Z",
        end: "2025-10-22T13:00:00.000Z",
        location: "Office",
      },
    ],
    saved: [],
    preJoinedGroup: [],
    joinedGroup: [],
    sentRequestGroup: [],
  },
  {
    id: "14",
    name: "Nusrat Jahan (14/15)",
    username: "nusrat14",
    email: "nusrat14@example.com",
    password: "pass14",
    phone: "01710000034",
    avatar: "https://randomuser.me/api/portraits/women/34.jpg",
    bio: "College teacher",
    userType: ["teacher"],
    gender: "female",
    religion: "Islam",
    educationLevel: "COLLEGE",
    college: {
      name: "Dhaka College",
      boardType: "general",
      board: "dhaka",
      department: "arts",
      year: "1",
      version: "bangla",
      medium: "bangla",
    },
    status: true,
    officeHours: [
      {
        id: "oh14-1",
        start: "2025-10-23T16:00:00.000Z",
        end: "2025-10-23T17:00:00.000Z",
        location: "Room 5",
      },
    ],
    saved: [],
    preJoinedGroup: [],
    joinedGroup: [],
    sentRequestGroup: [],
  },
  {
    id: "15",
    name: "Abdullah Al Mamun (15/15)",
    username: "abdullah15",
    email: "abdullah15@example.com",
    password: "pass15",
    phone: "01710000035",
    avatar: "https://randomuser.me/api/portraits/men/35.jpg",
    bio: "System admin",
    userType: ["system"],
    gender: "male",
    religion: "Islam",
    educationLevel: "UNIVERSITY",
    university: {
      name: "KUET",
      department: "CE",
      section: "C",
      subsection: "2",
      year: 5,
      semester: 2,
    },
    status: true,
    saved: [],
    preJoinedGroup: [],
    joinedGroup: [],
    sentRequestGroup: [],
  },
];

// Export a compatibility-mapped users array so older code that expects
// `category: 'university' | 'hsc'` and `.dept` still works without changing UI.
/*
export interface CompatUserData extends UserData {
  category: "university" | "hsc";
  university?: UserData["university"] & { dept?: string };
  college?: UserData["college"] & { dept?: string };
}

export const usersData: CompatUserData[] = rawUsersData.map((u) => {
  const category: CompatUserData["category"] =
    u.educationLevel === "UNIVERSITY" ? "university" : "hsc";

  const university = u.university
    ? {
        ...u.university,
        // department is the canonical field; provide a dept alias for older code
        dept: u.university.department,
      }
    : undefined;

  const college = u.college
    ? {
        ...u.college,
        dept: u.college.department,
      }
    : undefined;

  return {
    ...u,
    category,
    university,
    college,
  } as CompatUserData;
});
*/
export const usersData = rawUsersData;
