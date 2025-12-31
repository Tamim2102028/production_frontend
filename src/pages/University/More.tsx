import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBriefcase,
  FaUsers,
  FaBook,
  FaCalendarAlt,
  FaChartBar,
  FaUserFriends,
  FaUniversity,
  FaLink,
  FaLaptop,
  FaNewspaper,
  FaDollarSign,
  FaGraduationCap,
  FaMapMarkedAlt,
  FaDumbbell,
  FaHeartbeat,
  FaBus,
  FaCog,
} from "react-icons/fa";

interface UniversityResource {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  iconColor: string;
  iconBg: string;
}

const UniversityMore: React.FC = () => {
  const universityResources: UniversityResource[] = [
    {
      id: "1",
      title: "Clubs",
      description: "Discover student communities",
      icon: FaUsers,
      link: "/university/more/clubs",
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      id: "2",
      title: "Career Services",
      description: "Job & Internship Board",
      icon: FaBriefcase,
      link: "/university/more/career-services",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      id: "3",
      title: "Course Materials",
      description: "Find lecture notes and resources",
      icon: FaBook,
      link: "/university/more/course-materials",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      id: "4",
      title: "Class Schedule",
      description: "View your weekly class routine",
      icon: FaCalendarAlt,
      link: "/university/more/class-schedule",
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
    },
    {
      id: "5",
      title: "Results",
      description: "Check your exam results",
      icon: FaChartBar,
      link: "/university/more/results",
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-100",
    },
    {
      id: "6",
      title: "Classmates",
      description: "Connect with your classmates",
      icon: FaUserFriends,
      link: "/university/more/classmates",
      iconColor: "text-pink-600",
      iconBg: "bg-pink-100",
    },
    {
      id: "7",
      title: "Library Portal",
      description: "Access the university library",
      icon: FaUniversity,
      link: "/university/more/library-portal",
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
    },
    {
      id: "8",
      title: "Student Portal",
      description: "Access student services",
      icon: FaLink,
      link: "/university/more/student-portal",
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
    },
    {
      id: "9",
      title: "Faculty Directory",
      description: "Find faculty contact information",
      icon: FaGraduationCap,
      link: "/university/more/faculty-directory",
      iconColor: "text-teal-600",
      iconBg: "bg-teal-100",
    },
    {
      id: "10",
      title: "E-Learning",
      description: "Access online learning platforms",
      icon: FaLaptop,
      link: "/university/more/e-learning",
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-100",
    },
    {
      id: "11",
      title: "University News",
      description: "Latest news and announcements",
      icon: FaNewspaper,
      link: "/university/more/university-news",
      iconColor: "text-violet-600",
      iconBg: "bg-violet-100",
    },
    {
      id: "12",
      title: "Financial Aid",
      description: "Scholarships and financial support",
      icon: FaDollarSign,
      link: "/university/more/financial-aid",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    {
      id: "13",
      title: "Alumni Network",
      description: "Connect with BUET alumni",
      icon: FaUsers,
      link: "/university/more/alumni-network",
      iconColor: "text-rose-600",
      iconBg: "bg-rose-100",
    },
    {
      id: "14",
      title: "Campus Map",
      description: "Navigate the university campus",
      icon: FaMapMarkedAlt,
      link: "/university/more/campus-map",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      id: "15",
      title: "Sports Facilities",
      description: "Book sports facilities",
      icon: FaDumbbell,
      link: "/university/more/sports-facilities",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
    },
    {
      id: "16",
      title: "Health Services",
      description: "Access medical services",
      icon: FaHeartbeat,
      link: "/university/more/health-services",
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
    },
    {
      id: "17",
      title: "Bus Schedule",
      description: "University transport schedule",
      icon: FaBus,
      link: "/university/more/bus-schedule",
      iconColor: "text-gray-600",
      iconBg: "bg-gray-100",
    },
    {
      id: "18",
      title: "IT Support",
      description: "Get help with IT issues",
      icon: FaCog,
      link: "/university/more/it-support",
      iconColor: "text-slate-600",
      iconBg: "bg-slate-100",
    },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-5">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          More University Resources
        </h1>
        <p className="text-gray-600">
          Explore additional services and resources available.
        </p>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {universityResources.map((resource) => (
          <NavLink
            key={resource.id}
            to={resource.link}
            className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
          >
            {/* Icon */}
            <div
              className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${resource.iconBg} mb-4 transition-transform duration-300 group-hover:scale-110`}
            >
              <resource.icon className={`h-6 w-6 ${resource.iconColor}`} />
            </div>

            {/* Content */}
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                {resource.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {resource.description}
              </p>
            </div>

            {/* Arrow indicator */}
            <div className="mt-4 opacity-100 transition-opacity duration-300 group-hover:opacity-100">
              <div className="inline-flex items-center text-sm font-medium text-blue-600">
                <span>Learn more</span>
                <svg
                  className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </NavLink>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center">
        <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-6 py-3 shadow-sm">
          <FaUniversity className="mr-2 h-5 w-5 text-blue-600" />
          <span className="font-medium text-gray-700">
            Need help? Contact University Support
          </span>
        </div>
      </div>
    </div>
  );
};

export default UniversityMore;
