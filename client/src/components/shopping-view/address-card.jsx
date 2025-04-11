import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export default function AddressCard({
  addressInfo,
  handleDelete,
  handleEdit,
  setCurrSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      className={` ${
        selectedId?._id === addressInfo?._id
          ? "border-red-900 border-[4px]"
          : "border-black"
      } cursor-pointer`}
      onClick={
        setCurrSelectedAddress
          ? () => setCurrSelectedAddress(addressInfo)
          : null
      }
    >
      <CardContent
        className={` ${
          selectedId === addressInfo?._id ? "border-black" : ""
        } grid gap-4 p-4`}
      >
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>Pincode: {addressInfo?.pincode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="flex justify-between p-3">
        <Button onClick={() => handleEdit(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDelete(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}
