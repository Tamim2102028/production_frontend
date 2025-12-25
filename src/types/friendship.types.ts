// ====================================
// ACTION RESPONSE DATA TYPES
// ====================================

export interface SendFriendRequestData {
  status: string;
  recipientId: string;
  friendshipId: string;
}

export interface AcceptFriendRequestData {
  status: string;
  requesterId: string;
  friendshipId: string;
}

export interface RejectFriendRequestData {
  requesterId: string;
}

export interface CancelFriendRequestData {
  recipientId: string;
}

export interface UnfriendData {
  userId: string;
}

export interface BlockData {
  blockRelation: {
    _id: string;
    requester: string;
    recipient: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UnblockData {
  userId: string;
}

// ====================================
// LIST RESPONSE DATA TYPES
// ====================================

export interface InstitutionBasic {
  _id?: string;
  name: string;
}

export interface DepartmentBasic {
  _id?: string;
  name: string;
}

export interface FriendUser {
  _id: string;
  userName: string;
  fullName: string;
  avatar: string;
  institution: InstitutionBasic | null;
  userType: string;
  department: DepartmentBasic | null;
  friendshipStatus:
    | "accepted"
    | "incoming_request"
    | "outgoing_request"
    | "none";
  friendshipId?: string;
}

export interface FriendshipListData {
  totalCount: number;
  users: FriendUser[];
}
