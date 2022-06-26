// @ts-ignore
import { NotificationItem } from "@epnsproject/frontend-sdk-staging";
import { useAccount } from "wagmi";
import {fetchSignatureNotifications, isUserSubscribed, optIn} from "../sdk/epnsUtils";
import { useEffect, useState } from "react";
import {Box, Center, GridItem, Heading, SimpleGrid} from "@chakra-ui/react";


export function NotificationList() {
  const { data: account } = useAccount();

  const address = account?.address
    ? account?.address
    : "0x0fc26CE09E56594Aa364D0890ae43BDC14152e25";

  const [notifications, setNotifications] = useState<any[]>();

  useEffect(() => {
    console.log(address);
    fetchSignatureNotifications(address).then((_notifications) =>
      setNotifications(_notifications)
    );
  }, [address]);

  if (notifications === undefined || notifications.length == 0) {
    return (
            <Box
                boxShadow="dark-lg"
                p={10}
                my={10}
                w="full"
                justifyItems="center"
                justifySelf="center"
            >
              <Center fontSize="3xl" justifyItems="center" w="full">
                No current messages.
              </Center>
            </Box>
    );
  }

  return (
    <>
      {notifications?.map((notification: any, index: number) => (
        <NotificationItem
          key={index}
          notificationTitle={notification.title}
          notificationBody={`${notification.message.slice(0, 10)}......${notification.message.slice(120)}`}
          cta={notification.cta}
          app={notification.app}
          icon={notification.icon}
          image={notification.image}
        />
      ))}
    </>
  );
}
