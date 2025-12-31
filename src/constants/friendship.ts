export const FRIENDSHIP_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  BLOCKED: "BLOCKED",
};

export const PROFILE_RELATION_STATUS = {
  FRIEND: "FRIEND", // বন্ধু (Message / Unfriend)
  REQUEST_SENT: "REQUEST_SENT", // আমি পাঠিয়েছি (Cancel Request)
  REQUEST_RECEIVED: "REQUEST_RECEIVED", // সে পাঠিয়েছে (Accept/Reject)
  BLOCKED: "BLOCKED", // আমি ব্লক করেছি (Unblock)
};

export const CONNECTION_VISIBILITY = {
  PUBLIC: "PUBLIC",
  CONNECTIONS: "CONNECTIONS",
  ONLY_ME: "ONLY_ME",
};

export const FRIEND_REQUEST_POLICY = {
  EVERYONE: "EVERYONE",
  NOBODY: "NOBODY",
};
