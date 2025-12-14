export interface RoomFile {
  id: string;
  roomId: string;
  fileName: string;
  url?: string;
  uploadedBy?: string; // user id
  createdAt: string;
  sizeKb?: number;
  mimeType?: string;
  isGeneral?: boolean;
  isCT?: boolean; // class test
  isAssignment?: boolean;
}

export const roomFiles: RoomFile[] = [
  {
    id: "f-r1-1",
    roomId: "r1",
    fileName: "Calculus_Notes_Chapter1.pdf",
    url: "https://example.com/files/calculus-ch1.pdf",
    uploadedBy: "1",
    createdAt: "2025-01-03T09:00:00.000Z",
    sizeKb: 256,
    mimeType: "application/pdf",
    isGeneral: true,
  },
  {
    id: "f-r1-2",
    roomId: "r1",
    fileName: "Limits_ClassTest.pdf",
    url: "https://example.com/files/limits-ct.pdf",
    uploadedBy: "4",
    createdAt: "2025-01-05T14:30:00.000Z",
    sizeKb: 128,
    mimeType: "application/pdf",
    isCT: true,
  },
  {
    id: "f-r1-3",
    roomId: "r1",
    fileName: "Homework_Assignment_1.zip",
    url: "https://example.com/files/hw1.zip",
    uploadedBy: "9",
    createdAt: "2025-01-07T18:45:00.000Z",
    sizeKb: 1024,
    mimeType: "application/zip",
    isAssignment: true,
  },
  {
    id: "f-r2-1",
    roomId: "r2",
    fileName: "React_Tips.pdf",
    url: "https://example.com/files/react-tips.pdf",
    uploadedBy: "11",
    createdAt: "2025-02-02T10:00:00.000Z",
    sizeKb: 512,
    mimeType: "application/pdf",
    isGeneral: true,
  },
  {
    id: "f-r2-2",
    roomId: "r2",
    fileName: "Midterm_ClassTest.docx",
    url: "https://example.com/files/midterm.docx",
    uploadedBy: "7",
    createdAt: "2025-02-10T09:15:00.000Z",
    sizeKb: 64,
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    isCT: true,
  },
  {
    id: "f-r3-1",
    roomId: "r3",
    fileName: "Session_Recordings.zip",
    url: "https://example.com/files/session-recordings.zip",
    uploadedBy: "3",
    createdAt: "2025-03-02T20:00:00.000Z",
    sizeKb: 2048,
    mimeType: "application/zip",
    isGeneral: true,
  },
];

export default roomFiles;
