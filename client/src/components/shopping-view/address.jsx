import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  fetchAddressList,
  updateAddress,
} from "@/store/shop/address-slice";
import { toast } from "sonner";
import AddressCard from "./address-card";
const initialFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};
export default function Address({setCurrSelectedAddress, selectedId}) {
  const [formData, setFormData] = useState(initialFormData);
  const [currentEditId, setCurrentEditId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  function handleSubmit(event) {
    event.preventDefault();
    if (addressList.length >= 3 && currentEditId === null) {
      setFormData(initialFormData);
      toast.error("You can only have 3 addresses");
      return;
    }
    currentEditId !== null
      ? dispatch(
          updateAddress({
            userId: user?.id,
            addressId: currentEditId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAddressList(user?.id));
            setFormData(initialFormData);
            setCurrentEditId(null);
            toast.success("Address updated successfully");
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAddressList(user?.id));
            setFormData(initialFormData);
            toast.success("Address added successfully");
          }
        });
  }
  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  function handleDelete(getCurrAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrAddress?._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAddressList(user?.id));
        toast.success("Address deleted successfully");
      }
    });
  }

  function handleEdit(getCurrAddress) {
    setCurrentEditId(getCurrAddress?._id);
    setFormData({
      ...formData,
      address: getCurrAddress?.address,
      city: getCurrAddress?.city,
      phone: getCurrAddress?.phone,
      pincode: getCurrAddress?.pincode,
      notes: getCurrAddress?.notes,
    });
  }

  useEffect(() => {
    dispatch(fetchAddressList(user?.id));
  }, [dispatch, user?.id]);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2">
        {addressList && addressList.length > 0
          ? addressList?.map((address) => (
              <AddressCard
                key={address?._id}
                addressInfo={address}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                selectedId={selectedId}
                setCurrSelectedAddress={setCurrSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditId ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-6">
        <CommonForm
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditId ? "Update Address" : "Add Address"}
          onSubmit={handleSubmit}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}
