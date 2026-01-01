import React from "react";
import { FaComment, FaTimes, FaCheck, FaUserPlus } from "react-icons/fa";

type BtnProps = {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
};

export const MessageButton: React.FC<BtnProps> = ({ onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center rounded-lg bg-blue-100 px-4 py-2 text-blue-600 hover:bg-blue-200 ${className || ""}`}
  >
    <FaComment className="mr-2" />
    Message
  </button>
);

export const UnfriendButton: React.FC<BtnProps> = ({ onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200 ${className || ""}`}
  >
    <FaTimes className="mr-1" />
    Unfriend
  </button>
);

export const AcceptButton: React.FC<BtnProps> = ({ onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center rounded-lg bg-green-100 px-3 py-2 text-green-600 hover:bg-green-200 ${className || ""}`}
  >
    <FaCheck className="mr-1" />
    Accept
  </button>
);

export const RejectButton: React.FC<BtnProps> = ({ onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200 ${className || ""}`}
  >
    <FaTimes className="mr-1" />
    Reject
  </button>
);

export const AddFriendButton: React.FC<BtnProps> = ({ onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center rounded-lg bg-blue-100 px-4 py-2 text-blue-600 hover:bg-blue-200 ${className || ""}`}
  >
    <FaUserPlus className="mr-2" />
    Add Friend
  </button>
);

export const CancelRequestButton: React.FC<BtnProps> = ({
  onClick,
  className,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200 ${className || ""}`}
  >
    <FaTimes className="mr-1" />
    Cancel Request
  </button>
);

export const UnblockButton: React.FC<BtnProps> = ({ onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center rounded-lg bg-gray-100 px-3 py-2 text-gray-600 hover:bg-gray-200 ${className || ""}`}
  >
    Unblock
  </button>
);

export default {
  MessageButton,
  UnfriendButton,
  AcceptButton,
  RejectButton,
  AddFriendButton,
  CancelRequestButton,
  UnblockButton,
};
