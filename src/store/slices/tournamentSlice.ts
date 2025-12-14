import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type Match,
  type Prize,
  type Tournament,
  defaultPrizePool,
  TOURNAMENT_CONSTANTS,
} from "../../components/Gaming/data/tournamentData.ts";

interface TournamentState {
  // User XP System
  userXP: number;
  lastClaimDate: string | null;
  isNewUser: boolean;
  userUniversityId: string | null; // Track user's university

  // Current Tournament
  currentTournament: Tournament;
  userRegistered: boolean;
  userMatches: Match[];
  isWinner: boolean;
  selectedPrize: Prize | null;

  // Past Tournaments
  history: Tournament[];
}

const initialState: TournamentState = {
  // New users get 250 XP automatically
  userXP: TOURNAMENT_CONSTANTS.NEW_USER_BONUS,
  lastClaimDate: null,
  isNewUser: true,
  userUniversityId: null, // Set when user registers

  currentTournament: {
    id: "tournament-001",
    status: "registration",
    startDate: "2025-10-11",
    currentRound: "round-a",
    currentDay: 0, // Will start at day 1 when tournament begins
    registeredPlayers: [],
    matches: [],
    prizePool: defaultPrizePool,
  },

  userRegistered: false,
  userMatches: [],
  isWinner: false,
  selectedPrize: null,
  history: [],
};

const tournamentSlice = createSlice({
  name: "tournament",
  initialState,
  reducers: {
    // Daily XP Claim
    claimDailyXP: (state) => {
      const today = new Date().toDateString();
      const lastClaim = state.lastClaimDate
        ? new Date(state.lastClaimDate).toDateString()
        : null;

      // Only allow claim if not already claimed today
      if (!lastClaim || lastClaim !== today) {
        state.userXP += TOURNAMENT_CONSTANTS.DAILY_XP_REWARD;
        state.lastClaimDate = new Date().toISOString();

        // Mark user as no longer new after first claim
        if (state.isNewUser) {
          state.isNewUser = false;
        }
      }
    },

    // Tournament Registration - Auto-use user's university from profile
    registerForTournament: (state) => {
      const entryFee = TOURNAMENT_CONSTANTS.ENTRY_FEE;
      if (state.userXP >= entryFee && !state.userRegistered) {
        state.userXP -= entryFee;
        state.userRegistered = true;
        // userUniversityId will be set from user's profile in component
        // In real app, would add user to registeredPlayers array
      }
    },

    // Set user's university from profile
    setUserUniversity: (state, action: PayloadAction<string>) => {
      state.userUniversityId = action.payload;
    },

    // Update tournament status
    updateTournamentStatus: (
      state,
      action: PayloadAction<"registration" | "active" | "ended">
    ) => {
      state.currentTournament.status = action.payload;
    },

    // Select prize (for winners)
    selectPrize: (state, action: PayloadAction<Prize>) => {
      if (state.isWinner) {
        state.selectedPrize = action.payload;
      }
    },

    // Admin: Set user as winner
    setWinner: (state, action: PayloadAction<boolean>) => {
      state.isWinner = action.payload;
    },

    // Admin: Add XP manually
    addXP: (state, action: PayloadAction<number>) => {
      state.userXP += action.payload;
    },

    // Admin: Deduct XP manually
    deductXP: (state, action: PayloadAction<number>) => {
      state.userXP = Math.max(0, state.userXP - action.payload);
    },

    // Reset for new tournament
    startNewTournament: (state, action: PayloadAction<Tournament>) => {
      // Move current tournament to history
      if (state.currentTournament.status === "ended") {
        state.history.unshift(state.currentTournament);
      }

      // Start new tournament
      state.currentTournament = action.payload;
      state.userRegistered = false;
      state.userMatches = [];
      state.isWinner = false;
      state.selectedPrize = null;
    },
  },
});

export const {
  claimDailyXP,
  registerForTournament,
  setUserUniversity,
  updateTournamentStatus,
  selectPrize,
  setWinner,
  addXP,
  deductXP,
  startNewTournament,
} = tournamentSlice.actions;

export default tournamentSlice.reducer;
