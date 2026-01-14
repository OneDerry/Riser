// Nigeria States and LGAs API Service
// Using devcenter-square API: https://github.com/devcenter-square/states-cities

const API_BASE_URL = "https://states-and-cities.com/api/v1";

export interface State {
  name: string;
  maxLat: number;
  minLong: number;
  longitude: number;
  maxLong: number;
  minLat: number;
  latitude: number;
  capital: string;
}

export interface LGA {
  name: string;
}

export interface City {
  name: string;
}

// Fetch all Nigerian states
export const fetchStates = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/states`);
    if (!response.ok) {
      throw new Error(`Failed to fetch states: ${response.statusText}`);
    }
    const states: State[] = await response.json();
    return states.map((state) => state.name).sort();
  } catch (error) {
    console.error("Error fetching states:", error);
    // Fallback to some common states if API fails
    return [
      "Lagos",
      "Abuja",
      "Kano",
      "Rivers",
      "Oyo",
      "Kaduna",
      "Katsina",
      "Borno",
      "Bauchi",
      "Anambra",
      "Imo",
      "Enugu",
      "Delta",
      "Edo",
      "Ogun",
      "Ondo",
      "Ekiti",
      "Kwara",
      "Niger",
      "Sokoto",
      "Kebbi",
      "Zamfara",
      "Jigawa",
      "Yobe",
      "Gombe",
      "Adamawa",
      "Taraba",
      "Plateau",
      "Benue",
      "Nasarawa",
      "Kogi",
      "Akwa Ibom",
      "Cross River",
      "Rivers",
      "Bayelsa",
      "Ebonyi",
      "Abia",
    ];
  }
};

// Fetch LGAs for a specific state
export const fetchLGAsByState = async (
  stateName: string
): Promise<string[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/state/${encodeURIComponent(
        stateName.toLowerCase()
      )}/lgas`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch LGAs for ${stateName}: ${response.statusText}`
      );
    }
    const lgas: LGA[] = await response.json();
    return lgas.map((lga) => lga.name).sort();
  } catch (error) {
    console.error(`Error fetching LGAs for ${stateName}:`, error);
    // Return empty array if API fails
    return [];
  }
};

// Fetch cities for a specific state (optional, for future use)
export const fetchCitiesByState = async (
  stateName: string
): Promise<string[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/state/${encodeURIComponent(
        stateName.toLowerCase()
      )}/cities`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch cities for ${stateName}: ${response.statusText}`
      );
    }
    const cities: City[] = await response.json();
    return cities.map((city) => city.name).sort();
  } catch (error) {
    console.error(`Error fetching cities for ${stateName}:`, error);
    return [];
  }
};
