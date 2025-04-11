import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const initialState = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

export default function AdminProducts() {
  const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImgUrl, setUploadedImgUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();
    currentEditedId !== null
      ? dispatch(editProduct({ id: currentEditedId, formData })).then(
          (data) => {
            if (data?.payload?.success) {
              dispatch(fetchAllProducts());
              setFormData(initialState);
              setOpenAddProductDialog(false);
              setCurrentEditedId(null);
              toast.success("Product edited successfully");
            }
          }
        )
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImgUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenAddProductDialog(false);
            setImageFile(null);
            setFormData(initialState);
            toast.success("Product added successfully");
          }
        });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  function handleDelete(getProductId) {
    dispatch(deleteProduct(getProductId)).then(data=>{
      if(data?.payload?.success){
        dispatch(fetchAllProducts())
        toast.success("Product deleted successfully");
      }
    })
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenAddProductDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem, index) => (
              <AdminProductTile
                key={index}
                product={productItem}
                setCurrentEditedId={setCurrentEditedId}
                setFormData={setFormData}
                setOpenAddProductDialog={setOpenAddProductDialog}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openAddProductDialog}
        onOpenChange={() => {
          setOpenAddProductDialog(false);
          setCurrentEditedId(null);
          setFormData(initialState);
        }}
      >
        <SheetContent side="right" className="overflow-auto gap-0 p-0">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <div className="px-6 pb-4 pt-0 space-y-4">
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImgUrl={uploadedImgUrl}
              setUploadedImgUrl={setUploadedImgUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isEditMode={currentEditedId !== null}
            />
            <CommonForm
              formData={formData}
              setFormData={setFormData}
              formControls={addProductFormElements}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              onSubmit={onSubmit}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}
