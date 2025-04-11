import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  return (
    <Card className="p-10">
      <CardHeader className='p-0'>
        <CardTitle className="text-4xl">Payment Successfull</CardTitle>
      </CardHeader>
      <Button className="mt-5 w-fit" onClick={() => navigate("/shop/account")}>
        View Orders
      </Button>
    </Card>
  );
}
