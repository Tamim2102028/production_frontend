export interface PublicFileItem {
  fileId: string;
  userId: string; // Owner of the file
  name: string;
  type: "folder" | "file";
  size?: string;
  createdAt: string;
  updatedAt: string;
  fileType?: string;
  isPublic: boolean;
  description?: string;
  downloads: number;
  tags?: string[];
  category?: string;
}

// MongoDB-style separate collection for public files
export const publicFilesData: PublicFileItem[] = [
  // User 1 files
  {
    fileId: "pf_cu1",
    userId: "1",
    name: "CS Final Project Resources",
    type: "folder",
    createdAt: "2025-09-20T10:00:00Z",
    updatedAt: "2025-09-20T10:00:00Z",
    isPublic: true,
    description: "All resources and code for my Computer Science final project",
    downloads: 45,
    tags: ["CS", "Project", "Resources"],
    category: "Education",
  },
  {
    fileId: "pf_cu2",
    userId: "1",
    name: "Study Notes Collectionnn",
    type: "folder",
    createdAt: "2025-09-18T14:30:00Z",
    updatedAt: "2025-09-18T14:30:00Z",
    isPublic: true,
    description: "Comprehensive study notes for various CS courses",
    downloads: 78,
    tags: ["Study", "Notes", "CS"],
    category: "Education",
  },
  // User 2 files
  {
    fileId: "pf_sw1",
    userId: "2",
    name: "Web Development Portfolio",
    type: "folder",
    createdAt: "2025-09-21T09:15:00Z",
    updatedAt: "2025-09-21T09:15:00Z",
    isPublic: true,
    description: "Complete portfolio website source code and assets",
    downloads: 156,
    tags: ["WebDev", "Portfolio", "Frontend"],
    category: "Development",
  },
  {
    fileId: "pf_sw2",
    userId: "2",
    name: "UI/UX Design Resources",
    type: "folder",
    createdAt: "2025-09-19T16:45:00Z",
    updatedAt: "2025-09-19T16:45:00Z",
    isPublic: true,
    description: "Design templates, color palettes, and UI components",
    downloads: 89,
    tags: ["UI", "UX", "Design"],
    category: "Design",
  },
  {
    fileId: "pf_sw3",
    userId: "2",
    name: "Frontend Interview Prep",
    type: "folder",
    createdAt: "2025-09-17T11:20:00Z",
    updatedAt: "2025-09-17T11:20:00Z",
    isPublic: true,
    description:
      "Questions, answers, and coding challenges for frontend interviews",
    downloads: 234,
    tags: ["Interview", "Frontend", "Prep"],
    category: "Career",
  },
  // User 3 files
  {
    fileId: "pf_ac1",
    userId: "3",
    name: "Machine Learning Projects",
    type: "folder",
    createdAt: "2025-09-22T08:30:00Z",
    updatedAt: "2025-09-22T08:30:00Z",
    isPublic: true,
    description: "Complete ML projects with datasets and jupyter notebooks",
    downloads: 298,
    tags: ["ML", "AI", "DataScience"],
    category: "Technology",
  },
  {
    fileId: "pf_ac2",
    userId: "3",
    name: "Data Science Resources",
    type: "folder",
    createdAt: "2025-09-20T13:45:00Z",
    updatedAt: "2025-09-20T13:45:00Z",
    isPublic: true,
    description: "Python scripts, libraries, and data analysis tools",
    downloads: 167,
    tags: ["DataScience", "Python", "Analytics"],
    category: "Technology",
  },
  // User 4 files
  {
    fileId: "pf_mj1",
    userId: "4",
    name: "React Component Library",
    type: "folder",
    createdAt: "2025-09-21T15:20:00Z",
    updatedAt: "2025-09-21T15:20:00Z",
    isPublic: true,
    description: "Custom React components with TypeScript and Storybook",
    downloads: 445,
    tags: ["React", "TypeScript", "Components"],
    category: "Development",
  },
  {
    fileId: "pf_mj2",
    userId: "4",
    name: "Open Source Contributions",
    type: "folder",
    createdAt: "2025-09-19T10:30:00Z",
    updatedAt: "2025-09-19T10:30:00Z",
    isPublic: true,
    description:
      "Code snippets and contributions to various open source projects",
    downloads: 123,
    tags: ["OpenSource", "Contributions", "Code"],
    category: "Development",
  },
  // User 5 files
  {
    fileId: "pf_ed1",
    userId: "5",
    name: "Design System Templates",
    type: "folder",
    createdAt: "2025-09-20T12:00:00Z",
    updatedAt: "2025-09-20T12:00:00Z",
    isPublic: true,
    description: "Complete design system with components and guidelines",
    downloads: 267,
    tags: ["Design", "System", "Templates"],
    category: "Design",
  },
  {
    fileId: "pf_ed2",
    userId: "5",
    name: "Mobile App UI Designs",
    type: "folder",
    createdAt: "2025-09-18T09:45:00Z",
    updatedAt: "2025-09-18T09:45:00Z",
    isPublic: true,
    description: "High-fidelity mobile app designs and prototypes",
    downloads: 189,
    tags: ["Mobile", "UI", "Design"],
    category: "Design",
  },
  // User 28 files
  {
    fileId: "pf_aj1",
    userId: "28",
    name: "Microservices Architecture",
    type: "folder",
    createdAt: "2025-09-21T14:15:00Z",
    updatedAt: "2025-09-21T14:15:00Z",
    isPublic: true,
    description: "Complete microservices setup with Docker and Kubernetes",
    downloads: 356,
    tags: ["Microservices", "Docker", "Kubernetes"],
    category: "Technology",
  },
  // User 32 files
  {
    fileId: "pf_ew1",
    userId: "32",
    name: "React Performance Guide",
    type: "folder",
    createdAt: "2025-09-20T11:30:00Z",
    updatedAt: "2025-09-20T11:30:00Z",
    isPublic: true,
    description: "Performance optimization techniques and code examples",
    downloads: 278,
    tags: ["React", "Performance", "Optimization"],
    category: "Development",
  },
  // User 154 files
  {
    fileId: "pf_jk1",
    userId: "154",
    name: "Solidity Smart Contracts",
    type: "folder",
    createdAt: "2025-09-19T16:00:00Z",
    updatedAt: "2025-09-19T16:00:00Z",
    isPublic: true,
    description: "Optimized smart contracts with security best practices",
    downloads: 167,
    tags: ["Solidity", "Blockchain", "SmartContracts"],
    category: "Technology",
  },
  // User 145 files
  {
    fileId: "pf_sk1",
    userId: "145",
    name: "Digital Marketing Templates",
    type: "folder",
    createdAt: "2025-09-21T10:45:00Z",
    updatedAt: "2025-09-21T10:45:00Z",
    isPublic: true,
    description: "Email marketing templates and growth hacking strategies",
    downloads: 234,
    tags: ["Marketing", "Templates", "Growth"],
    category: "Business",
  },
  // User 56 files
  {
    fileId: "pf_rk1",
    userId: "56",
    name: "UX Research Methods",
    type: "folder",
    createdAt: "2025-09-18T15:30:00Z",
    updatedAt: "2025-09-18T15:30:00Z",
    isPublic: true,
    description: "User research templates, surveys, and analysis tools",
    downloads: 145,
    tags: ["UX", "Research", "UserExperience"],
    category: "Design",
  },
];

export const getPublicFoldersByUserId = (userId: string): PublicFileItem[] => {
  return publicFilesData.filter(
    (file) => file.userId === userId && file.isPublic
  );
};

export const getPublicFileById = (
  fileId: string
): PublicFileItem | undefined => {
  return publicFilesData.find((file) => file.fileId === fileId);
};

export const getPublicFilesByCategory = (
  category: string
): PublicFileItem[] => {
  return publicFilesData.filter(
    (file) => file.category === category && file.isPublic
  );
};

export const getPublicFilesByTag = (tag: string): PublicFileItem[] => {
  return publicFilesData.filter(
    (file) => file.tags?.includes(tag) && file.isPublic
  );
};
