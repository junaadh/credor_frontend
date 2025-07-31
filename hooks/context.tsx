import {
  createContext,
  PropsWithChildren,
  use,
  useCallback,
  useEffect,
} from "react";
import { useStorageState } from "./useStorage";
import { CredorResponse } from "@/constants/response";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type SessionContextType = {
  jwt: string;
  name: string;
};

type AuthContextType = {
  login: (email: string, password: string) => Promise<CredorResponse>;
  register: (
    name: string,
    age: number,
    gender: string,
    email: string,
    password: string,
  ) => Promise<CredorResponse>;
  logout: () => void;
  refreshContext: () => Promise<void>;
  session: SessionContextType | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useSession() {
  const value = use(AuthContext);
  if (!value)
    throw new Error("useSession must be used inside <SessionProvider>");
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, rawSession], setRawSession] = useStorageState("session");

  const session: SessionContextType | null =
    rawSession &&
    (() => {
      try {
        const parse = JSON.parse(rawSession);
        return parse.jwt && parse.name ? parse : null;
      } catch {
        return null;
      }
    })();

  const login = useCallback(
    async (email: string, password: string): Promise<CredorResponse> => {
      console.log(`Attempt login: ${email}`);
      let res: CredorResponse = { status: 0, jwt: "", name: "" };
      try {
        const response = await fetch(`${API_URL}/api/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        res.status = response.status;
        if (!response.ok) {
          res.errorMsg = JSON.stringify(data);
          throw new Error("Login failed");
        }

        setRawSession(
          JSON.stringify({
            jwt: data.access_token,
            name: data.user.user_metadata.name,
          }),
        );
        res = {
          status: res.status,
          jwt: data.access_token,
          name: data.user.user_metadata.name,
        };
      } catch (error) {
        console.error("Login error:", error);
      }

      return res;
    },
    [setRawSession],
  );

  const register = useCallback(
    async (
      name: string,
      age: number,
      gender: string,
      email: string,
      password: string,
    ): Promise<CredorResponse> => {
      let response: CredorResponse = { status: 0, jwt: "", name: "" };
      try {
        const res = await fetch(`${API_URL}/api/user/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            age,
            gender,
            email,
            password,
          }),
        });
        const data = await res.json();

        response.status = res.status;
        if (!res.ok) {
          response.errorMsg = JSON.stringify(data);
          throw new Error("Registration failed");
        }

        setRawSession(JSON.stringify({ jwt: data.access_token, name: name }));
        response = {
          status: res.status,
          name: data.name,
          jwt: data.access_token,
        };
      } catch (error) {
        console.error("Registration error:", error);
      }

      return response;
    },
    [setRawSession],
  );

  const logout = useCallback(() => {
    setRawSession(null);
  }, [setRawSession]);

  const refreshContext = useCallback(async () => {
    if (!session) return;

    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${session.jwt}`,
        },
      });

      if (!res.ok) throw new Error("Failed to refresh session");

      const data = await res.json();

      setRawSession(
        JSON.stringify({
          jwt: session.jwt,
          name: data.name,
        }),
      );
    } catch (err) {
      console.error("Session refresh failed:", err);
      // Optional: logout on failure?
    }
  }, [session, setRawSession]);

  useEffect(() => {
    refreshContext();
  }, []);

  return (
    <AuthContext
      value={{
        login: login,
        register: register,
        logout: logout,
        refreshContext,
        session: session,
        isLoading: isLoading,
      }}
    >
      {children}
    </AuthContext>
  );
}
