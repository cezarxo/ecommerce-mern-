import React, { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { toast } from "sonner";

const initialFormData = {
  status: "",
};

export default function AdminOrderDetails({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function handelUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;
    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetails(orderDetails?._id));
        dispatch(getAllOrders());
        setFormData(initialFormData);
        toast.success("Order status updated successfully");
      }
    });
  }

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
                    : orderDetails?.orderStatus === "inShipment"
                    ? "bg-blue-500"
                    : orderDetails?.orderStatus === "delivered"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "inProcess"
                            ? "bg-emerald-400"
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
                    <li
                      className="flex items-center justify-between"
                      key={item?._id}
                    >
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

        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipment", label: "In Shipment" },
                  { id: "rejected", label: "Rejected" },
                  { id: "delivered", label: "Delivered" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            btnText={"Update Order Status"}
            onSubmit={handelUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}
