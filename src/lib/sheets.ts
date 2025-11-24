// Python Backend API Integration
// Update this URL to your Python backend server
const API_BASE_URL = "http://localhost:5000/api";

export const fetchStandings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/standings`);
    if (!response.ok) throw new Error('Failed to fetch standings');
    return await response.json();
  } catch (error) {
    console.error("Error fetching standings:", error);
    // Return empty data on error
    return [
      { division: "A" as const, gold: 0, silver: 0, bronze: 0, points: 0 },
      { division: "B" as const, gold: 0, silver: 0, bronze: 0, points: 0 },
      { division: "C" as const, gold: 0, silver: 0, bronze: 0, points: 0 },
      { division: "D" as const, gold: 0, silver: 0, bronze: 0, points: 0 },
      { division: "E" as const, gold: 0, silver: 0, bronze: 0, points: 0 },
    ];
  }
};

export const fetchEventStandings = async (eventId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/event/${eventId}/standings`);
    if (!response.ok) throw new Error('Failed to fetch event standings');
    return await response.json();
  } catch (error) {
    console.error("Error fetching event standings:", error);
    return { standings: [], table_structure: [] };
  }
};

export const fetchFixtures = async (eventId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/event/${eventId}/fixtures`);
    if (!response.ok) throw new Error('Failed to fetch fixtures');
    return await response.json();
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    return [];
  }
};

export const updateScore = async (data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/score/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update score');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating score:", error);
    throw error;
  }
};

export const fetchSportsStandings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/standings/sports`);
    if (!response.ok) throw new Error('Failed to fetch sports standings');
    return await response.json();
  } catch (error) {
    console.error("Error fetching sports standings:", error);
    return [];
  }
};

export const fetchCulturalStandings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/standings/cultural`);
    if (!response.ok) throw new Error('Failed to fetch cultural standings');
    return await response.json();
  } catch (error) {
    console.error("Error fetching cultural standings:", error);
    return [];
  }
};

export const fetchEventRules = async (eventId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/event/${eventId}/rules`);
    if (!response.ok) throw new Error('Failed to fetch event rules');
    const data = await response.json();
    return data.rules;
  } catch (error) {
    console.error("Error fetching event rules:", error);
    return "Rules will be updated soon.";
  }
};
