import { useState, useEffect, useCallback } from "react";
import { fetchStates, fetchLGAsByState } from "../lib/api/nigeria-states";

interface UseNigeriaStatesReturn {
  states: string[];
  lgas: string[];
  isLoadingStates: boolean;
  isLoadingLGAs: boolean;
  error: string | null;
  fetchLGAs: (stateName: string) => Promise<void>;
}

export const useNigeriaStates = (): UseNigeriaStatesReturn => {
  const [states, setStates] = useState<string[]>([]);
  const [lgas, setLgas] = useState<string[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingLGAs, setIsLoadingLGAs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all states on component mount
  useEffect(() => {
    const loadStates = async () => {
      setIsLoadingStates(true);
      setError(null);
      try {
        const statesData = await fetchStates();
        setStates(statesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load states");
      } finally {
        setIsLoadingStates(false);
      }
    };

    loadStates();
  }, []);

  // Fetch LGAs for a specific state
  const fetchLGAs = useCallback(async (stateName: string) => {
    if (!stateName) {
      setLgas([]);
      return;
    }

    setIsLoadingLGAs(true);
    setError(null);
    try {
      const lgasData = await fetchLGAsByState(stateName);
      setLgas(lgasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load LGAs");
      setLgas([]);
    } finally {
      setIsLoadingLGAs(false);
    }
  }, []);

  return {
    states,
    lgas,
    isLoadingStates,
    isLoadingLGAs,
    error,
    fetchLGAs,
  };
};
