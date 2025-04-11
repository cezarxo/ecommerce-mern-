import React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
export default function ShoppingOrderDetails({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Order Details</DialogTitle>
        <DialogDescription />
      </DialogHeader>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Total</p>
            <Label>{orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "pending"
                    ? "bg-yellow-600"
                    : orderDetails?.orderStatus === "delivered"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "inProcess"
                    ? "bg-blue-500"
                    : orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-700"
                    : "bg-red-500"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <li className="flex items-center justify-between" key={item?._id}>
                      <span>Title: {item?.title}</span>
                      <span>Quantity: {item?.quantity}</span>
                      <span>Price: ${item?.price}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user?.userName.toUpperCase().split(" ")[0]}</span>
              <span>{orderDetails?.address?.address}</span>
              <span> {orderDetails?.address?.city}</span>
              <span> {orderDetails?.address?.pincode}</span>
              <span> {orderDetails?.address?.phone}</span>
              <span> {orderDetails?.address?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
