import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type WinningTicket,
  type Restaurant,
  type RestaurantTransaction,
  mockUserTickets,
  restaurants,
  mockRestaurantTransactions,
} from "../../components/Gaming/data/achievementsData";

interface AchievementState {
  userTickets: WinningTicket[];
  restaurants: Restaurant[];
  transactions: RestaurantTransaction[];
}

const initialState: AchievementState = {
  userTickets: mockUserTickets,
  restaurants: restaurants,
  transactions: mockRestaurantTransactions,
};

const achievementSlice = createSlice({
  name: "achievement",
  initialState,
  reducers: {
    // Use a winning ticket
    applyTicket: (
      state,
      action: PayloadAction<{
        ticketId: string;
        restaurantId: string;
        billAmount: number;
      }>
    ) => {
      const { ticketId, restaurantId, billAmount } = action.payload;

      // Find and update the ticket
      const ticket = state.userTickets.find((t) => t.id === ticketId);
      if (ticket && !ticket.isUsed) {
        ticket.isUsed = true;
        ticket.usedAt = new Date().toISOString();
        ticket.restaurantId = restaurantId;
        ticket.billAmount = billAmount;

        // Update restaurant transaction
        const transaction = state.transactions.find(
          (t) => t.restaurantId === restaurantId
        );
        if (transaction) {
          transaction.totalAmount += billAmount;
          transaction.totalTicketsUsed += 1;
          transaction.tickets.push({ ...ticket });
        }
      }
    },

    // Add new winning ticket (when user wins tournament)
    addWinningTicket: (
      state,
      action: PayloadAction<{
        userId: string;
        tournamentId: string;
      }>
    ) => {
      const { userId, tournamentId } = action.payload;
      const newTicket: WinningTicket = {
        id: `ticket-${Date.now()}`,
        userId,
        tournamentId,
        isUsed: false,
      };
      state.userTickets.push(newTicket);
    },

    // Clear used tickets history (optional)
    clearUsedTickets: (state) => {
      state.userTickets = state.userTickets.filter((t) => !t.isUsed);
    },

    // Settle restaurant payment (admin action)
    settleRestaurantPayment: (state, action: PayloadAction<string>) => {
      const restaurantId = action.payload;
      const transaction = state.transactions.find(
        (t) => t.restaurantId === restaurantId
      );
      if (transaction) {
        transaction.totalAmount = 0;
        transaction.totalTicketsUsed = 0;
        transaction.tickets = [];
        transaction.lastSettlementDate = new Date().toISOString();
      }
    },
  },
});

export const {
  applyTicket,
  addWinningTicket,
  clearUsedTickets,
  settleRestaurantPayment,
} = achievementSlice.actions;

export default achievementSlice.reducer;
