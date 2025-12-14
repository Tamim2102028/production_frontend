import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch } from "../store/hooks";
import { setUser, clearUser, setCheckingAuth } from "../store/slices/authSlice";
import authApi from "../services/auth.service";
import type { LoginCredentials, ApiError } from "../types/user.types";
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
 * - useRegister: নতুন user registration
 * - useLogin: User login
 * - useLogout: User logout
 * - useCurrentUser: Current user fetch
 * - useAuthCheck: App load এ auth verify
 *
 * ব্যবহার:
 * const { mutate: login, isPending } = useLogin();
 * login({ email: "...", password: "..." });
 */

/**
 * useRegister Hook
 *
 * নতুন user registration এর জন্য।
 * FormData নেয় কারণ avatar file upload আছে।
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
    mutationFn: (formData: FormData) => authApi.register(formData),
    onSuccess: (response) => {
      // ✅ Registration successful
      // 1. Redux এ user save করো
      dispatch(setUser(response.data.user));
      // 2. Cache invalidate করো
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      // 3. Toast show
      toast.success("Account created successfully! Welcome to SocialHub!");
      // 4. Home page এ redirect করো
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
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (response) => {
      // ✅ Login successful
      // Backend cookie set করে দিয়েছে (HttpOnly)
      // আমরা শুধু Redux update করি
      dispatch(setUser(response.data.user));
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success(`Welcome back, ${response.data.user.fullName}!`);
      navigate("/");
    },
    onError: (error: AxiosError<ApiError>) => {
      console.error("Login error:", error.response?.data?.message);
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
 * useCurrentUser Hook
 *
 * Current logged in user fetch করে।
 * Manual refresh করতে চাইলে এটা use করো।
 *
 * @returns {data, isLoading, isError}
 */
export const useCurrentUser = () => {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      return response.data;
    },
    retry: false, // 401 এ retry করার দরকার নেই
    staleTime: 5 * 60 * 1000, // 5 minutes পর refetch
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      dispatch(setUser(query.data));
    } else if (query.isError) {
      dispatch(clearUser());
    }
  }, [query.data, query.isSuccess, query.isError, dispatch]);

  useEffect(() => {
    if (!query.isLoading) {
      dispatch(setCheckingAuth(false));
    }
  }, [query.isLoading, dispatch]);

  return query;
};

/**
 * useAuthCheck Hook
 *
 * ⚠️ IMPORTANT: এই hook টা App.tsx এ use হয়
 *
 * App load হলে এই hook check করে user logged in কিনা।
 * Cookie তে valid token থাকলে user data পাবে।
 *
 * Flow:
 * 1. App load → useAuthCheck() call
 * 2. GET /current-user → Cookie সাথে যায়
 * 3. Success → Redux এ user save, isAuthenticated = true
 * 4. Fail → clearUser, redirect to login
 */
export const useAuthCheck = () => {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: ["authCheck"],
    queryFn: async () => {
      try {
        // Cookie তে token থাকলে user পাবে
        const response = await authApi.getCurrentUser();
        return { isAuthenticated: true, user: response.data };
      } catch {
        // Token নেই বা invalid → not authenticated
        return { isAuthenticated: false, user: null };
      }
    },
    retry: false,
    staleTime: Infinity, // একবার check করলেই যথেষ্ট
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (query.data) {
      if (query.data.isAuthenticated) {
        dispatch(setUser(query.data.user));
      } else {
        dispatch(clearUser());
      }
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    if (!query.isLoading) {
      dispatch(setCheckingAuth(false));
    }
  }, [query.isLoading, dispatch]);

  return query;
};
