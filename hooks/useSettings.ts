import { useCallback, useEffect, useState } from "react";
import { useSession } from "./context";

export interface SettingsProps {
  name: string;
  email: string;
  age: number;
  updateSettings: (
    new_name: string | null,
    new_email: string | null,
    new_password: string | null,
    new_age: number | null,
  ) => Promise<void>;
  checkValid: (new_email: string) => Promise<boolean>;
  isLoading: boolean;
}

export const useSettings = (): SettingsProps => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { session, refreshContext, logout } = useSession();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkValid = useCallback(
    async (new_email: string): Promise<boolean> => {
      let valid = false;
      setIsLoading(true);

      try {
        const res = await fetch(`${apiUrl}/api/auth/email?email=${new_email}`, {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("failed to get email validity");
        }

        const rawData = await res.json();
        console.log(rawData);
        valid = !rawData.taken;
      } catch (err) {
        console.error("email validity check failed: ", err);
      } finally {
        setIsLoading(false);
      }

      return valid;
    },
    [],
  );

  const updateSettings = useCallback(
    async (
      new_name: string | null,
      new_email: string | null,
      new_password: string | null,
      new_age: number | null,
    ): Promise<void> => {
      setIsLoading(true);

      try {
        const response = await fetch(`${apiUrl}/api/user/profile`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session?.jwt}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: new_name,
            email: new_email,
            password: new_password,
            age: new_age,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("API Error:", error);
          throw new Error(error.error || "Failed to update settings");
        }

        if (new_email || new_password) {
          logout();
          return;
        }

        refreshContext();
      } catch (err) {
        console.error("failed to update settings", err);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<number>(0);

  useEffect(() => {
    const getProfile = async (): Promise<void> => {
      setIsLoading(true);

      try {
        const res = await fetch(`${apiUrl}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${session?.jwt}`,
          },
        });

        if (!res.ok) {
          throw new Error("failed to get user details");
        }

        const rawData = await res.json();
        setEmail(rawData.email);
        setName(rawData.name);
        setAge(rawData.age);
      } catch (err) {
        console.error("email validity check failed: ", err);
      } finally {
        setIsLoading(false);
      }
    };

    getProfile();
  }, []);

  return {
    updateSettings,
    checkValid,
    isLoading,
    name,
    email,
    age,
  };
};
