import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImg, deleteFeatureImg, getFeatureImgs } from "@/store/common-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImgUrl, setUploadedImgUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImgs } = useSelector((state) => state.common);

  function handleUpload() {
    dispatch(addFeatureImg(uploadedImgUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImgs());
        setImageFile(null);
        setUploadedImgUrl("");
        toast.success("Feature Image Added Successfully");
      }
    });
  }

  function handleDelete(id) {
    dispatch(deleteFeatureImg(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImgs());
        toast.success("Feature Image Deleted Successfully");
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImgs());
  }, [dispatch]);

  console.log(featureImgs);
  return (
    <div>
      {/* <h1>Upload Feature Images</h1> */}
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImgUrl={uploadedImgUrl}
        setUploadedImgUrl={setUploadedImgUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCommon={true}
        // isEditMode={currentEditedId !== null}
      />
      <Button className="mt-5 w-full" onClick={handleUpload}>
        Upload
      </Button>

      <div className="flex flex-col gap-4 mt-5">
        {featureImgs && featureImgs.length > 0
          ? featureImgs.map((featImg) => (
              <div className="relative" key={featImg._id}>
                <img
                  src={featImg.image}
                  alt=""
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
                <Button
                  className="absolute top-2 right-2 bg-red-500 text-white"
                  onClick={() => handleDelete(featImg._id)}
                >
                  Delete
                </Button>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}
