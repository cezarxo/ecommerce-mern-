import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import ShoppingOrderDetails from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

export default function ShoppingOrders() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { ordersList, orderDetails } = useSelector(
    (state) => state.shoppingOrder
  );

  function handleFetchOrderDetails(orderId) {
    dispatch(getOrderDetails(orderId));
  }

  useEffect(() => {
    if (orderDetails !== null) setOpen(true);
  }, [orderDetails]);

  useEffect(() => {
    dispatch(getAllOrders(user?.id));
  }, [dispatch, user?.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersList && ordersList.length > 0
              ? ordersList.map((order) => (
                  <TableRow key={order?._id}>
                    <TableCell>{order?._id}</TableCell>
                    <TableCell> {order?.orderDate.split("T")[0]} </TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          order?.orderStatus === "pending"
                            ? "bg-yellow-600"
                            : order?.orderStatus === "delivered"
                            ? "bg-green-500"
                            : order?.orderStatus === "inProcess"
                            ? "bg-blue-500"
                            : order?.orderStatus === "confirmed"
                            ? "bg-green-700"
                            : "bg-red-500"
                        }`}>
                        {order?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${order?.totalAmount}</TableCell>
                    <TableCell>
                      <Dialog
                        open={open}
                        onOpenChange={() => {
                          setOpen(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          onClick={() => handleFetchOrderDetails(order?._id)}
                        >
                          View Details
                        </Button>
                        <ShoppingOrderDetails key={order?._id} orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
