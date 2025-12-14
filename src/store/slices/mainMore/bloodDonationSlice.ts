import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  mockBloodDonors,
  mockBloodRequests,
  type BloodDonor,
  type BloodRequest,
} from "../../../components/MainMore/data/bloodDonationData";

interface BloodDonationState {
  activeTab: "requests" | "donors" | "donorList";
  donors: BloodDonor[];
  requests: BloodRequest[];
  selectedBloodGroup: string;
  selectedUniversity: string;
  loading: boolean;
  error: string | null;
}

const initialState: BloodDonationState = {
  activeTab: "requests",
  donors: mockBloodDonors,
  requests: mockBloodRequests,
  selectedBloodGroup: "All",
  selectedUniversity: "All",
  loading: false,
  error: null,
};

const bloodDonationSlice = createSlice({
  name: "bloodDonation",
  initialState,
  reducers: {
    setActiveTab: (
      state,
      action: PayloadAction<"requests" | "donors" | "donorList">
    ) => {
      state.activeTab = action.payload;
    },
    setDonors: (state, action: PayloadAction<BloodDonor[]>) => {
      state.donors = action.payload;
    },
    setRequests: (state, action: PayloadAction<BloodRequest[]>) => {
      state.requests = action.payload;
    },
    setSelectedBloodGroup: (state, action: PayloadAction<string>) => {
      state.selectedBloodGroup = action.payload;
    },
    setSelectedUniversity: (state, action: PayloadAction<string>) => {
      state.selectedUniversity = action.payload;
    },
    addRequest: (state, action: PayloadAction<BloodRequest>) => {
      state.requests.unshift(action.payload);
    },
    addDonor: (state, action: PayloadAction<BloodDonor>) => {
      state.donors.push(action.payload);
    },
    updateRequestStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: "Active" | "Fulfilled" | "Expired";
      }>
    ) => {
      const request = state.requests.find((r) => r.id === action.payload.id);
      if (request) {
        request.status = action.payload.status;
      }
    },
    updateDonorAvailability: (
      state,
      action: PayloadAction<{
        id: string;
        availability: "Available" | "Not Available" | "Recently Donated";
      }>
    ) => {
      const donor = state.donors.find((d) => d.id === action.payload.id);
      if (donor) {
        donor.availability = action.payload.availability;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetState: () => initialState,
  },
});

export const {
  setActiveTab,
  setDonors,
  setRequests,
  setSelectedBloodGroup,
  setSelectedUniversity,
  addRequest,
  addDonor,
  updateRequestStatus,
  updateDonorAvailability,
  setLoading,
  setError,
  resetState,
} = bloodDonationSlice.actions;

export default bloodDonationSlice.reducer;
