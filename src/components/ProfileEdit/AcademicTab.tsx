import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FaGraduationCap,
  FaIdCard,
  FaCalendarAlt,
  FaUsers,
  FaChalkboardTeacher,
  FaStar,
  FaClock,
  FaSpinner,
  FaPlus,
  FaTrash,
  FaLock,
  FaBuilding,
} from "react-icons/fa";

import { useUpdateAcademic } from "../hooks/common/useProfile";
import { USER_TYPES, TEACHER_RANKS } from "../../constants";
import type { User, Institution, Department } from "../../types";

// ====================================
// ZOD VALIDATION SCHEMAS
// ====================================

// Office Hours schema (for teachers)
const officeHourSchema = z.object({
  day: z.string().min(1, "Day is required"),
  timeRange: z.string().min(1, "Time range is required"),
  room: z.string(),
});

// Student Academic Schema
const studentAcademicSchema = z.object({
  session: z.string().optional(),
  section: z.string().optional(),
  studentId: z.string().optional(),
  institutionId: z.string().optional(),
  departmentId: z.string().optional(),
});

// Teacher Academic Schema
const teacherAcademicSchema = z.object({
  teacherId: z.string().optional(),
  rank: z.string().optional(),
  officeHours: z.array(officeHourSchema).optional(),
  institutionId: z.string().optional(),
  departmentId: z.string().optional(),
});

// Local form types (inferred from Zod)
type StudentAcademicFormData = z.infer<typeof studentAcademicSchema>;
type TeacherAcademicFormData = z.infer<typeof teacherAcademicSchema>;

// ====================================
// COMPONENT PROPS
// ====================================

interface AcademicTabProps {
  user: User;
}

// ====================================
// DAYS OF WEEK
// ====================================

const DAYS_OF_WEEK = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

// ====================================
// STUDENT FORM COMPONENT
// ====================================

const StudentForm: React.FC<{ user: User }> = ({ user }) => {
  const { mutate: updateAcademic, isPending } = useUpdateAcademic();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<StudentAcademicFormData>({
    resolver: zodResolver(studentAcademicSchema),
    defaultValues: {
      session: user.academicInfo?.session || "",
      section: user.academicInfo?.section || "",
      studentId: user.academicInfo?.studentId || "",
      institutionId: (user.institution as Institution)?._id || "",
      departmentId: (user.academicInfo?.department as Department)?._id || "",
    },
  });

  const onSubmit = (data: StudentAcademicFormData) => {
    updateAcademic(data);
  };

  // Get institution and department info
  const institution = user.institution as Institution | undefined;
  const department = user.academicInfo?.department as Department | undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Institution Info (Read-only for institutional email verified users) */}
      {user.isStudentEmail && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2 text-green-800">
            <FaLock className="text-green-600" />
            <span className="font-medium">Institutional Email Verified</span>
          </div>
          <p className="mt-1 text-sm text-green-700">
            Your institution and department are verified via institutional email
            and cannot be changed.
          </p>
        </div>
      )}

      {/* Institution & Department */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          <FaBuilding className="mr-2 inline text-blue-600" />
          Institution & Department
          {user.isStudentEmail && (
            <span className="ml-2 text-xs font-normal text-gray-500">
              (Verified - Cannot be changed)
            </span>
          )}
        </h2>

        <div className="space-y-4">
          {/* Institution */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Institution{" "}
              {user.isStudentEmail && (
                <FaLock className="ml-1 inline text-xs text-green-600" />
              )}
            </label>
            {user.isStudentEmail ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600">
                {institution?.name || "Not set"}
              </div>
            ) : (
              <input
                type="text"
                {...register("institutionId")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter institution ID or select from list"
              />
            )}
            <p className="mt-1 text-xs text-gray-500">
              {user.isStudentEmail
                ? "Verified via institutional email"
                : "TODO: Add institution dropdown/search"}
            </p>
          </div>

          {/* Department */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Department{" "}
              {user.isStudentEmail && (
                <FaLock className="ml-1 inline text-xs text-green-600" />
              )}
            </label>
            {user.isStudentEmail ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600">
                {department?.name || "Not set"}
              </div>
            ) : (
              <input
                type="text"
                {...register("departmentId")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter department ID or select from list"
              />
            )}
            <p className="mt-1 text-xs text-gray-500">
              {user.isStudentEmail
                ? "Verified via institutional email"
                : "TODO: Add department dropdown/search"}
            </p>
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          <FaGraduationCap className="mr-2 inline text-green-600" />
          Student Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Student ID */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              <FaIdCard className="mr-1 inline text-gray-400" />
              Student ID
            </label>
            <input
              type="text"
              {...register("studentId")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., 2102028"
            />
            {errors.studentId && (
              <p className="mt-1 text-sm text-red-500">
                {errors.studentId.message}
              </p>
            )}
          </div>

          {/* Session */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              <FaCalendarAlt className="mr-1 inline text-gray-400" />
              Session
            </label>
            <input
              type="text"
              {...register("session")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., 2020-21"
            />
            {errors.session && (
              <p className="mt-1 text-sm text-red-500">
                {errors.session.message}
              </p>
            )}
          </div>

          {/* Section */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              <FaUsers className="mr-1 inline text-gray-400" />
              Section
            </label>
            <input
              type="text"
              {...register("section")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., A, B, C"
            />
            {errors.section && (
              <p className="mt-1 text-sm text-red-500">
                {errors.section.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isDirty || isPending}
          className="rounded-lg bg-green-600 px-8 py-2.5 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <FaSpinner className="animate-spin" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
};

// ====================================
// TEACHER FORM COMPONENT
// ====================================

const TeacherForm: React.FC<{ user: User }> = ({ user }) => {
  const { mutate: updateAcademic, isPending } = useUpdateAcademic();

  const {
    register,
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm<TeacherAcademicFormData>({
    resolver: zodResolver(teacherAcademicSchema),
    defaultValues: {
      teacherId: user.academicInfo?.teacherId || "",
      rank: user.academicInfo?.rank || "",
      officeHours:
        user.academicInfo?.officeHours?.map((oh) => ({
          day: oh.day,
          timeRange: oh.timeRange,
          room: oh.room || "",
        })) || [],
      institutionId: (user.institution as Institution)?._id || "",
      departmentId: (user.academicInfo?.department as Department)?._id || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "officeHours",
  });

  const onSubmit = (data: TeacherAcademicFormData) => {
    updateAcademic(data);
  };

  // Get institution and department info
  const institution = user.institution as Institution | undefined;
  const department = user.academicInfo?.department as Department | undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Institutional Email Verified Notice */}
      {user.isStudentEmail && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2 text-green-800">
            <FaLock className="text-green-600" />
            <span className="font-medium">Institutional Email Verified</span>
          </div>
          <p className="mt-1 text-sm text-green-700">
            Your institution and department are verified via institutional email
            and cannot be changed.
          </p>
        </div>
      )}

      {/* Institution & Department */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          <FaBuilding className="mr-2 inline text-blue-600" />
          Institution & Department
          {user.isStudentEmail && (
            <span className="ml-2 text-xs font-normal text-gray-500">
              (Verified - Cannot be changed)
            </span>
          )}
        </h2>

        <div className="space-y-4">
          {/* Institution */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Institution{" "}
              {user.isStudentEmail && (
                <FaLock className="ml-1 inline text-xs text-green-600" />
              )}
            </label>
            {user.isStudentEmail ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600">
                {institution?.name || "Not set"}
              </div>
            ) : (
              <input
                type="text"
                {...register("institutionId")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter institution ID or select from list"
              />
            )}
            <p className="mt-1 text-xs text-gray-500">
              {user.isStudentEmail
                ? "Verified via institutional email"
                : "TODO: Add institution dropdown/search"}
            </p>
          </div>

          {/* Department */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Department{" "}
              {user.isStudentEmail && (
                <FaLock className="ml-1 inline text-xs text-green-600" />
              )}
            </label>
            {user.isStudentEmail ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600">
                {department?.name || "Not set"}
              </div>
            ) : (
              <input
                type="text"
                {...register("departmentId")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter department ID or select from list"
              />
            )}
            <p className="mt-1 text-xs text-gray-500">
              {user.isStudentEmail
                ? "Verified via institutional email"
                : "TODO: Add department dropdown/search"}
            </p>
          </div>
        </div>
      </div>

      {/* Teacher Info Card */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          <FaChalkboardTeacher className="mr-2 inline text-purple-600" />
          Teacher Information
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Teacher ID */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              <FaIdCard className="mr-1 inline text-gray-400" />
              Teacher ID
            </label>
            <input
              type="text"
              {...register("teacherId")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., T-2024-001"
            />
          </div>

          {/* Rank */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              <FaStar className="mr-1 inline text-gray-400" />
              Rank / Designation
            </label>
            <Controller
              name="rank"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Rank</option>
                  {Object.entries(TEACHER_RANKS).map(([key, value]) => (
                    <option key={key} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>
      </div>

      {/* Office Hours Card */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            <FaClock className="mr-2 inline text-orange-600" />
            Office Hours
          </h2>
          <button
            type="button"
            onClick={() => append({ day: "", timeRange: "", room: "" })}
            className="flex items-center gap-1 rounded-lg bg-orange-100 px-3 py-1.5 text-sm font-medium text-orange-700 transition-colors hover:bg-orange-200"
          >
            <FaPlus className="text-xs" />
            Add Slot
          </button>
        </div>

        {fields.length === 0 ? (
          <p className="py-4 text-center text-gray-500">
            No office hours added yet. Click "Add Slot" to add your office
            hours.
          </p>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                {/* Day */}
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Day
                  </label>
                  <select
                    {...register(`officeHours.${index}.day`)}
                    className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select Day</option>
                    {DAYS_OF_WEEK.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time Range */}
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Time
                  </label>
                  <input
                    type="text"
                    {...register(`officeHours.${index}.timeRange`)}
                    className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., 10:00 - 12:00"
                  />
                </div>

                {/* Room */}
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Room
                  </label>
                  <input
                    type="text"
                    {...register(`officeHours.${index}.room`)}
                    className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g., Room 301"
                  />
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-5 rounded p-1.5 text-red-500 transition-colors hover:bg-red-100"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isDirty || isPending}
          className="rounded-lg bg-purple-600 px-8 py-2.5 font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <FaSpinner className="animate-spin" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
};

// ====================================
// MAIN COMPONENT
// ====================================

const AcademicTab: React.FC<AcademicTabProps> = ({ user }) => {
  const isStudent = user.userType === USER_TYPES.STUDENT;
  const isTeacher = user.userType === USER_TYPES.TEACHER;

  if (isStudent) {
    return <StudentForm user={user} />;
  }

  if (isTeacher) {
    return <TeacherForm user={user} />;
  }

  // For other user types (shouldn't happen normally)
  return (
    <div className="rounded-lg bg-gray-100 p-6 text-center text-gray-600">
      Academic information is not available for your account type.
    </div>
  );
};

export default AcademicTab;
