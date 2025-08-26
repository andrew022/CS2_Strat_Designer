import { useEffect, useState } from "react";
import { useItemHandling } from "./ItemHandling";
export function useSteamAuth() {
    const { setCircles, setFlashes, setSmokes } = useItemHandling();
    const [steamId, setSteamId] = useState<string | null>(null);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("steamid");
        if (id) {
            setSteamId(id);
            localStorage.setItem("steamid", id);
            window.history.replaceState({}, document.title, "/");
        } else {
            const saved = localStorage.getItem("steamid");
            if (saved) setSteamId(saved);
        }
    }, []);

    const handleLogout = (): void => {
        setSteamId(null);
        localStorage.removeItem("steamid");
        setCircles([]);
        setFlashes([]);
        setSmokes([]);
    };
    return { steamId, handleLogout };
}