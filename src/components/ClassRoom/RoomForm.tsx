import React from "react";
import { useForm } from "react-hook-form";
import { FaUniversity } from "react-icons/fa";

export type RoomFormValues = {
  name: string;
  university: string;
  department: string;
  year: string;
  semester: string;
  section: string;
  subsection: string;
};

const RoomForm: React.FC<{
  onSubmit: (data: RoomFormValues) => void;
  onCancel?: () => void;
}> = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit, formState } = useForm<RoomFormValues>({
    defaultValues: {
      name: "",
      university: "",
      department: "",
      year: "",
      semester: "",
      section: "",
      subsection: "",
    },
  });

  const { errors } = formState;

  // Define all possible universities
  const universities = ["BUET", "DU", "RUET", "CUET", "KUET"];

  // Define all possible departments
  const departments = ["CSE", "EEE", "ME", "CE", "CHE"];

  // Define all possible years (1-5 for engineering)
  const years = ["1", "2", "3", "4", "5"];

  // Define all possible semesters
  const semesters = ["1", "2"];

  // Define all possible sections
  const sections = ["A", "B", "C"];

  // Define all possible subsections
  const subsections = ["1", "2"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
          <FaUniversity className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Create a New Study Room
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Set up a collaborative space for your class
          </p>
        </div>
      </div>

      {/* Room Name Field */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Room Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("name", {
            required: "Room name is required",
            minLength: {
              value: 3,
              message: "Room name must be at least 3 characters",
            },
          })}
          placeholder="e.g., CSE 2-1 Study Group"
          className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.name?.message && (
          <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* University & Department */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            University <span className="text-red-500">*</span>
          </label>
          <select
            {...register("university", {
              required: "University is required",
            })}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select university</option>
            {universities.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          {errors.university?.message && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.university.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            {...register("department", {
              required: "Department is required",
            })}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.department?.message && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.department.message}
            </p>
          )}
        </div>
      </div>

      {/* Year & Semester */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Year <span className="text-red-500">*</span>
          </label>
          <select
            {...register("year", { required: "Year is required" })}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                Year {y}
              </option>
            ))}
          </select>
          {errors.year?.message && (
            <p className="mt-1.5 text-sm text-red-600">{errors.year.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Semester <span className="text-red-500">*</span>
          </label>
          <select
            {...register("semester", {
              required: "Semester is required",
            })}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select semester</option>
            {semesters.map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
          {errors.semester?.message && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.semester.message}
            </p>
          )}
        </div>
      </div>

      {/* Section & Subsection */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Section <span className="text-red-500">*</span>
          </label>
          <select
            {...register("section", { required: "Section is required" })}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select section</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                Section {s}
              </option>
            ))}
          </select>
          {errors.section?.message && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.section.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Subsection
          </label>
          <select
            {...register("subsection")}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select subsection (optional)</option>
            {subsections.map((s) => (
              <option key={s} value={s}>
                Subsection {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create Room
        </button>
      </div>
    </form>
  );
};

export default RoomForm;
