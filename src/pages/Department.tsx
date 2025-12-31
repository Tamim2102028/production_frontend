import React, { useState } from "react";
import {
  FaGraduationCap,
  FaUsers,
  FaInfoCircle,
  FaImage,
  FaVideo,
  FaCalendarAlt,
  FaThumbsUp,
  FaComment,
  FaShare,
  FaEllipsisH,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCamera,
} from "react-icons/fa";

// TODO: Replace with actual types
interface DepartmentPost {
  id: number;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
}

const Department: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "posts" | "about" | "members" | "photos" | "events"
  >("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  // TODO: Replace with API data
  const departmentInfo = {
    name: "Computer Science & Engineering",
    shortName: "CSE",
    university: "Bangladesh University of Engineering and Technology",
    coverImage:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop",
    followers: 2450,
    members: 856,
    description:
      "Department of Computer Science & Engineering - Advancing technology through education and research.",
    established: "1980",
    location: "Engineering Building, Floor 3-5",
    phone: "+880-2-9665650",
    email: "cse@university.edu.bd",
    website: "https://cse.university.edu.bd",
  };

  // TODO: Replace with API data
  const posts: DepartmentPost[] = [
    {
      id: 1,
      author: {
        name: "Dr. Ahmed Rahman",
        avatar: "https://i.pravatar.cc/150?img=12",
        role: "Department Head",
      },
      content:
        "Congratulations to all students who participated in the National Programming Contest! Our department secured 3rd position overall. 🎉",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop",
      createdAt: "2 hours ago",
      likes: 156,
      comments: 23,
      shares: 12,
      isLiked: false,
    },
    {
      id: 2,
      author: {
        name: "CSE Department",
        avatar: departmentInfo.logo,
        role: "Official",
      },
      content:
        "📢 Important Notice: Mid-term examination schedule has been published. Please check the notice board for details. All students are requested to prepare accordingly.",
      createdAt: "5 hours ago",
      likes: 89,
      comments: 45,
      shares: 34,
      isLiked: true,
    },
  ];

  const tabs = [
    { id: "posts", label: "Posts", icon: FaGraduationCap },
    { id: "about", label: "About", icon: FaInfoCircle },
    { id: "members", label: "Members", icon: FaUsers },
    { id: "photos", label: "Photos", icon: FaImage },
    { id: "events", label: "Events", icon: FaCalendarAlt },
  ] as const;

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-100">
      {/* Cover Photo Section */}
      <div className="relative w-full overflow-hidden">
        <div className="h-48 w-full overflow-hidden sm:h-64 md:h-80">
          <img
            src={departmentInfo.coverImage}
            alt="Department Cover"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Edit Cover Button - for admins */}
        <button className="absolute right-4 bottom-4 flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-gray-700 shadow-lg backdrop-blur-sm transition hover:bg-white">
          <FaCamera className="h-4 w-4" />
          <span className="hidden sm:inline">Edit Cover</span>
        </button>
      </div>

      {/* Profile Section */}
      <div className="relative mx-auto max-w-5xl px-4">
        <div className="relative -mt-16 flex flex-col sm:-mt-20 sm:flex-row sm:items-end sm:gap-6">
          {/* Department Logo */}
          <div className="relative">
            <div className="h-32 w-32 overflow-hidden rounded-xl border-4 border-white bg-white shadow-lg sm:h-40 sm:w-40">
              <img
                src={departmentInfo.logo}
                alt={departmentInfo.name}
                className="h-full w-full object-cover"
              />
            </div>
            <button className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-md hover:bg-gray-200">
              <FaCamera className="h-4 w-4" />
            </button>
          </div>

          {/* Department Info */}
          <div className="mt-4 flex-1 sm:mt-0 sm:pb-4">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {departmentInfo.name}
            </h1>
            <p className="mt-1 text-gray-600">{departmentInfo.university}</p>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FaUsers className="h-4 w-4" />
                {departmentInfo.members.toLocaleString()} members
              </span>
              <span>•</span>
              <span>{departmentInfo.followers.toLocaleString()} followers</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-3 sm:mt-0 sm:pb-4">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                isFollowing
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
              <FaShare className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-4 border-b border-gray-200">
          <nav className="-mb-px flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Sidebar - About Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* About Card */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 font-semibold text-gray-900">About</h3>
                <p className="text-sm text-gray-600">
                  {departmentInfo.description}
                </p>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                    <span>Established {departmentInfo.established}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                    <span>{departmentInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaPhone className="h-4 w-4 text-gray-400" />
                    <span>{departmentInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                    <span>{departmentInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaGlobe className="h-4 w-4 text-gray-400" />
                    <a
                      href={departmentInfo.website}
                      className="text-blue-600 hover:underline"
                    >
                      {departmentInfo.website.replace("https://", "")}
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 font-semibold text-gray-900">Community</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {departmentInfo.members}
                    </p>
                    <p className="text-xs text-gray-500">Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {departmentInfo.followers}
                    </p>
                    <p className="text-xs text-gray-500">Followers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Posts Feed */}
          <div className="space-y-4 lg:col-span-2">
            {/* Create Post Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                  <FaUsers className="h-5 w-5 text-gray-400" />
                </div>
                <button className="flex-1 rounded-full bg-gray-100 px-4 py-2.5 text-left text-sm text-gray-500 transition hover:bg-gray-200">
                  Write something to the department...
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100">
                  <FaImage className="h-5 w-5 text-green-500" />
                  <span className="hidden sm:inline">Photo</span>
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100">
                  <FaVideo className="h-5 w-5 text-red-500" />
                  <span className="hidden sm:inline">Video</span>
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100">
                  <FaCalendarAlt className="h-5 w-5 text-orange-500" />
                  <span className="hidden sm:inline">Event</span>
                </button>
              </div>
            </div>

            {/* Posts */}
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
                <FaGraduationCap className="h-12 w-12 text-gray-300" />
                <div>
                  <p className="font-medium text-gray-600">No posts yet</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Be the first to share something with the department
                  </p>
                </div>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {post.author.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{post.author.role}</span>
                          <span>•</span>
                          <span>{post.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <button className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
                      <FaEllipsisH className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <p className="text-gray-800">{post.content}</p>
                  </div>

                  {/* Post Image */}
                  {post.image && (
                    <div className="overflow-hidden">
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Post Stats */}
                  <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                        👍
                      </span>
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{post.comments} comments</span>
                      <span>{post.shares} shares</span>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center border-t border-gray-100 px-2 py-1">
                    <button
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition hover:bg-gray-100 ${
                        post.isLiked ? "text-blue-600" : "text-gray-600"
                      }`}
                    >
                      <FaThumbsUp className="h-4 w-4" />
                      Like
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100">
                      <FaComment className="h-4 w-4" />
                      Comment
                    </button>
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100">
                      <FaShare className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;
