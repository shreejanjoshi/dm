"use client";

import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PaymentStatusProps {
  orderEmail: string;
  orderId: string;
  isPaid: boolean;
}

const PaymentStatus = ({ orderEmail, orderId, isPaid }: PaymentStatusProps) => {
  const router = useRouter();

  const { data } = trpc.payment.pollOrderStatus.useQuery(
    // first thing we need to pass is orderid which we receive as a propert into this component
    { orderId },
    // as for the configuration object we can pass as the secound one here this will we two things first of the enabled value and this going to be the ispaid == false. Thisis only enabled if this boolean is true so we are only quering as long as the order is not paid yet.
    // and the refetch interval we can also pass as the second option here this give us function where we can recevie the data as teh arrow function and we can do the check if the data whichis optional that could be undefiend .paid (false). So we gonna stop quering is the order is paid otherwise we rae going to make a request to our api end point every one second
    {
      //
      enabled: isPaid === false,
      refetchInterval: (data) => (data?.isPaid ? false : 1000),
    }
  );

  //   ones if the order is poid
  useEffect(() => {
    if (data?.isPaid) router.refresh();
  }, [data?.isPaid, router]);

  return (
    <div className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
      <div>
        <p className="font-medium text-gray-900">Shipping To</p>
        <p>{orderEmail}</p>
      </div>

      <div>
        <p className="font-medium text-gray-900">Order Status</p>
        {/* need to know if payment is true or false. We do the logic in payment router */}
        <p>{isPaid ? "Payment successful" : "Pending payment"}</p>
      </div>
    </div>
  );
};

export default PaymentStatus;
