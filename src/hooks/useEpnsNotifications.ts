import {useEffect, useState} from "react";
import {fetchSignatureNotifications} from "../sdk/epnsUtils";



export function useEpnsNotifications(address: string) {
    const [isLoading, setIsLoading] = useState<boolean>();
    const [notifications, setNotifications] = useState<any>();


    async function fetchNotifications() {
        setIsLoading(true);
        const _notifications = await fetchSignatureNotifications(address);
        setNotifications(_notifications);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

}
