import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  mockTuitionServices,
  type TuitionService,
} from "../../components/Tuition/data/tuitionData";

// TuitionPost interface for requests
export interface TuitionPost {
  id: string;
  subjects: string[];
  level: string;
  hscYear: string;
  location: string;
  mode: "Online" | "Offline" | "Both";
  tutorGender: "Male" | "Female" | "Any";
  preferredUniversity: string;
  salary: number;
  contactInfo: string;
  requirements: string;
  postedBy: {
    id: string;
    name: string;
    avatar: string;
  };
  postedAt: string;
  interestedTutors: string[]; // Array of tutor IDs
  status: "open" | "closed" | "in_progress";
}

interface TuitionState {
  // Tuition services (tutors offering services)
  services: TuitionService[];

  // Tuition requests (students looking for tutors)
  requests: TuitionPost[];

  // User's own posts
  myRequests: TuitionPost[];
  myServices: TuitionService[];

  // Applications and interests
  appliedServices: string[]; // Service IDs user has applied to
  interestedRequests: string[]; // Request IDs user has shown interest in

  // UI state
  loading: boolean;
  error: string | null;

  // Filters
  filters: {
    subjects: string[];
    levels: string[];
    location: string;
    priceRange: [number, number];
    mode: string;
    tutorGender: string;
  };
}

const initialState: TuitionState = {
  services: mockTuitionServices,
  requests: [],
  myRequests: [],
  myServices: [],
  appliedServices: [],
  interestedRequests: [],
  loading: false,
  error: null,
  filters: {
    subjects: [],
    levels: [],
    location: "",
    priceRange: [0, 50000],
    mode: "Any",
    tutorGender: "Any",
  },
};

const tuitionSlice = createSlice({
  name: "tuition",
  initialState,
  reducers: {
    // Fetch tuition data
    fetchTuitionStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTuitionSuccess: (
      state,
      action: PayloadAction<{
        services: TuitionService[];
        requests: TuitionPost[];
      }>
    ) => {
      state.services = action.payload.services;
      state.requests = action.payload.requests;
      state.loading = false;
      state.error = null;
    },
    fetchTuitionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Tuition requests management
    createTuitionRequest: (state, action: PayloadAction<TuitionPost>) => {
      state.requests.unshift(action.payload);
      state.myRequests.unshift(action.payload);
    },

    updateTuitionRequest: (
      state,
      action: PayloadAction<{
        requestId: string;
        updates: Partial<TuitionPost>;
      }>
    ) => {
      const { requestId, updates } = action.payload;

      // Update in all requests
      const requestIndex = state.requests.findIndex((r) => r.id === requestId);
      if (requestIndex !== -1) {
        state.requests[requestIndex] = {
          ...state.requests[requestIndex],
          ...updates,
        };
      }

      // Update in my requests
      const myRequestIndex = state.myRequests.findIndex(
        (r) => r.id === requestId
      );
      if (myRequestIndex !== -1) {
        state.myRequests[myRequestIndex] = {
          ...state.myRequests[myRequestIndex],
          ...updates,
        };
      }
    },

    deleteTuitionRequest: (state, action: PayloadAction<string>) => {
      const requestId = action.payload;
      state.requests = state.requests.filter((r) => r.id !== requestId);
      state.myRequests = state.myRequests.filter((r) => r.id !== requestId);
    },

    // Tuition services management
    createTuitionService: (state, action: PayloadAction<TuitionService>) => {
      state.services.unshift(action.payload);
      state.myServices.unshift(action.payload);
    },

    updateTuitionService: (
      state,
      action: PayloadAction<{
        serviceId: string;
        updates: Partial<TuitionService>;
      }>
    ) => {
      const { serviceId, updates } = action.payload;

      // Update in all services
      const serviceIndex = state.services.findIndex((s) => s.id === serviceId);
      if (serviceIndex !== -1) {
        state.services[serviceIndex] = {
          ...state.services[serviceIndex],
          ...updates,
        };
      }

      // Update in my services
      const myServiceIndex = state.myServices.findIndex(
        (s) => s.id === serviceId
      );
      if (myServiceIndex !== -1) {
        state.myServices[myServiceIndex] = {
          ...state.myServices[myServiceIndex],
          ...updates,
        };
      }
    },

    deleteTuitionService: (state, action: PayloadAction<string>) => {
      const serviceId = action.payload;
      state.services = state.services.filter((s) => s.id !== serviceId);
      state.myServices = state.myServices.filter((s) => s.id !== serviceId);
    },

    // Applications and interests
    applyToService: (state, action: PayloadAction<string>) => {
      const serviceId = action.payload;
      if (!state.appliedServices.includes(serviceId)) {
        state.appliedServices.push(serviceId);
      }
    },

    withdrawApplication: (state, action: PayloadAction<string>) => {
      const serviceId = action.payload;
      state.appliedServices = state.appliedServices.filter(
        (id) => id !== serviceId
      );
    },

    showInterestInRequest: (state, action: PayloadAction<string>) => {
      const requestId = action.payload;
      if (!state.interestedRequests.includes(requestId)) {
        state.interestedRequests.push(requestId);
      }

      // Add to the request's interested tutors list
      const request = state.requests.find((r) => r.id === requestId);
      if (request && !request.interestedTutors.includes("current-user")) {
        request.interestedTutors.push("current-user");
      }
    },

    withdrawInterest: (state, action: PayloadAction<string>) => {
      const requestId = action.payload;
      state.interestedRequests = state.interestedRequests.filter(
        (id) => id !== requestId
      );

      // Remove from the request's interested tutors list
      const request = state.requests.find((r) => r.id === requestId);
      if (request) {
        request.interestedTutors = request.interestedTutors.filter(
          (id) => id !== "current-user"
        );
      }
    },

    // Filters
    updateFilters: (
      state,
      action: PayloadAction<Partial<TuitionState["filters"]>>
    ) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    resetFilters: (state) => {
      state.filters = {
        subjects: [],
        levels: [],
        location: "",
        priceRange: [0, 50000],
        mode: "Any",
        tutorGender: "Any",
      };
    },

    // Clear error
    clearTuitionError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchTuitionStart,
  fetchTuitionSuccess,
  fetchTuitionFailure,
  createTuitionRequest,
  updateTuitionRequest,
  deleteTuitionRequest,
  createTuitionService,
  updateTuitionService,
  deleteTuitionService,
  applyToService,
  withdrawApplication,
  showInterestInRequest,
  withdrawInterest,
  updateFilters,
  resetFilters,
  clearTuitionError,
} = tuitionSlice.actions;

export default tuitionSlice.reducer;
