import type {TrafficType} from "../types/types.ts";

// @ts-ignore
const API_URL = import.meta.env.VITE_API_URL;

export const getTrafficsPaginated = async (page: number, rowsPerPage: number, sortBy: string, sortOrder: string, viewMode: "weekly" | "monthly" | "daily"): Promise<{
    data: TrafficType[],
    totalCount: number,
}> => {
    if (viewMode == "weekly") {
        rowsPerPage *= 7;
    } else if (viewMode == "monthly") {
        rowsPerPage *= 30;
    }
    const response = await fetch(`${API_URL}/traffic?page=${page}&limit=${rowsPerPage}&orderBy=${sortBy}&orderByDirection=${sortOrder}`);
    return  await response.json();
}

export const updateTraffic = async (payload: {date: string, visits: number}, id: string) => {
    await fetch(`${API_URL}/traffic/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
}
export const deleteTraffic = async (id: string) => {
    const response = await fetch(`${API_URL}/traffic/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return await response.json();
}
export const saveTraffic = async (data:{date: string, visits: number}) => {
    const response = await fetch(API_URL + "/traffic",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return await response.json();
}
