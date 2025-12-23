import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../store/store.hooks";
import { setUser, clearUser } from "../store/slices/authSlice";
import authApi from "../services/auth.service";
import type {
  LoginCredentials,
  ApiError,
  AuthState,
} from "../types/user.types";
import type { AxiosError } from "axios";

/**
 * ====================================
 * AUTH HOOKS - TanStack Query + Redux
 * ====================================
 *
 * এই file এ authentication related সব hooks আছে।
 * TanStack Query দিয়ে API call + Redux এ state update।
 *
 * Hooks:
 * - useUser: Current user থেকে data access (Redux থেকে)
 * - useRegister: নতুন user registration
 * - useLogin: User login
 * - useLogout: User logout
 * - useAuthCheck: App load এ auth verify
 *
 * ব্যবহার:
 * const { user, isAuthenticated } = useUser();
 * const { mutate: login, isPending } = useLogin();
 * login({ email: "...", password: "..." });
 */

export const useUser = (): AuthState => {
  const { user, isAuthenticated, isCheckingAuth } = useAppSelector(
    (state) => state.auth
  );

  return {
    user,
    isAuthenticated,
    isCheckingAuth,
  };
};

/**
 * useRegister Hook
 *
 * নতুন user registration এর জন্য।
 * FormData নেয় কারণ avatar file upload আছে।
 *
 * ✅ Register Flow:
 * 1. POST /users/register → Backend user create + cookie set
 * 2. Success হলে GET /users/current-user → Fresh user data fetch
 * 3. Redux এ user save → isAuthenticated = true
 * 4. Home page এ redirect
 *
 * @returns {mutate, isPending, isError, error}
 *
 * @example
 * const { mutate: register, isPending } = useRegister();
 * register(formData, {
 *   onError: (error) => setErrors({ general: error.response?.data?.message })
 * });
 */
export const useRegister = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      // Step 1: Register API call - user create + cookie set
      const registerResponse = await authApi.register(formData);

      // Step 2: Registration success হলে current user fetch করো
      const userResponse = await authApi.getCurrentUser();

      return {
        registerData: registerResponse.data,
        userData: userResponse.data,
      };
    },
    onSuccess: (response) => {
      // ✅ Registration successful + User data fetched
      // Redux এ fresh user data save করো
      dispatch(setUser(response.userData));

      // Cache invalidate করো
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["authCheck"] });

      // Welcome message
      toast.success("Account created successfully! Welcome to SocialHub!");

      // Home page এ redirect
      navigate("/");
    },
    onError: (error: AxiosError<ApiError>) => {
      // ❌ Error হলে component এ handle করবে
      console.error("Registration error:", error.response?.data?.message);
    },
  });
};

/**
 * useLogin Hook
 *
 * User login এর জন্য।
 * Email/Username + Password নেয়।
 *
 * ✅ Login Flow:
 * 1. POST /users/login → Backend cookie set করে
 * 2. Success হলে GET /users/current-user → Fresh user data fetch
 * 3. Redux এ user save → isAuthenticated = true
 * 4. Home page এ redirect
 *
 * @returns {mutate, isPending, isError, error}
 *
 * @example
 * const { mutate: login, isPending } = useLogin();
 * login({ email: "user@example.com", password: "123456" });
 */
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Step 1: Login API call - cookie set হবে
      const loginResponse = await authApi.login(credentials);

      // Step 2: Login success হলে current user fetch করো
      // এটা ensure করে যে latest user data পাচ্ছি
      const userResponse = await authApi.getCurrentUser();

      return {
        loginData: loginResponse.data,
        userData: userResponse.data,
      };
    },
    onSuccess: (response) => {
      // ✅ Login successful + User data fetched
      // Redux এ fresh user data save করো
      dispatch(setUser(response.userData));

      // Cache invalidate করো
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["authCheck"] });

      // Welcome message
      toast.success(`Welcome back, ${response.userData.fullName}!`);

      // Home page এ redirect
      navigate("/");
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Login error:", error.response?.data?.message);
      // Component এ error handle হবে
    },
  });
};

/**
 * useLogout Hook
 *
 * User logout এর জন্য।
 * Backend cookie clear করে, আমরা Redux clear করি।
 *
 * @returns {mutate, isPending}
 *
 * @example
 * const { mutate: logout, isPending } = useLogout();
 * <button onClick={() => logout()}>Logout</button>
 */
export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // ✅ Logout successful
      dispatch(clearUser());
      queryClient.clear(); // সব cached data clear
      toast.success("Logged out successfully. See you soon!");
      navigate("/login");
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Logout error:", error.response?.data?.message);
      // ⚠️ Server error হলেও local state clear করো
      // User কে logout করে দাও
      dispatch(clearUser());
      queryClient.clear();
      toast.error("Logout failed, but you've been signed out locally.");
      navigate("/login");
    },
  });
};

/**
 * useAuthCheck Hook
 *
 * ⚠️ CRITICAL: এই hook শুধু App.tsx এ use হয়
 *
 * App load হলে এটা check করে user logged in কিনা।
 * Cookie তে valid token থাকলে user data fetch করে Redux এ save করে।
 *
 * ✅ Auth Check Flow:
 * 1. App load → useAuthCheck() call
 * 2. isCheckingAuth = true → Loading spinner show
 * 3. GET /users/current-user (cookie সাথে যায়)
 * 4. Success:
 *    - Redux এ user save
 *    - isAuthenticated = true
 *    - isCheckingAuth = false
 * 5. Fail (401/403):
 *    - clearUser
 *    - isAuthenticated = false
 *    - isCheckingAuth = false
 *    - ProtectedRoute redirect করবে /login এ
 */
export const useAuthCheck = () => {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: ["authCheck"],
    queryFn: async () => {
      try {
        // Cookie থেকে token পড়ে user fetch করো
        const response = await authApi.getCurrentUser();
        return { isAuthenticated: true, user: response.data };
      } catch {
        // Token নেই/invalid/expired
        console.log("Auth check failed - user not logged in");
        return { isAuthenticated: false, user: null };
      }
    },
    retry: false, // Auth check এ retry না করাই ভালো
    staleTime: Infinity, // একবার check করলেই যথেষ্ট
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Query result থেকে Redux update
  useEffect(() => {
    if (query.data) {
      if (query.data.isAuthenticated && query.data.user) {
        // ✅ User logged in
        dispatch(setUser(query.data.user));
      } else {
        // ❌ Not logged in
        dispatch(clearUser());
      }
    }
  }, [query.data, dispatch]);

  return query;
};
