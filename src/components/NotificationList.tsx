
// @ts-ignore
import { NotificationItem } from  "@epnsproject/frontend-sdk-staging";
import {useAccount} from "wagmi";
import {ethers} from "ethers";
import {fetchSignatureNotifications} from "../sdk/epnsUtils";
import {useEffect, useState} from "react";

export function NotificationList() {
    const { data: account } = useAccount();

    const address = account?.address
        ? account.address
        : "0x0fc26CE09E56594Aa364D0890ae43BDC14152e25";

    const [notifications, setNotifications] = useState<any[]>();

    useEffect(() => {
        console.log(address);
        fetchSignatureNotifications(address).then(_notifications => setNotifications(_notifications));
    }, [address]);

    return (
        <>
            {notifications?.map((notification: any, index: number) => <NotificationItem
                key={index}
                notificationTitle={notification.title}
                notificationBody={notification.message}
                cta={notification.cta}
                app={notification.app}
                icon={notification.icon}
                image={notification.image}
            />)}
        </>
    )
}
