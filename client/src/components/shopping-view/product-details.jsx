import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { addReview, getProductReviews } from "@/store/shop/review-slice";

export default function ProductDetailsDialog({
  open,
  setOpen,
  productDetails,
}) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { reviews } = useSelector((state) => state.shopReview);

  function handleAddToCart(getProductId, getTotalStock) {
    let getCartItem = cartItems.items || [];

    if (getCartItem.length) {
      const indexOfCurrentItem = getCartItem.findIndex(
        (item) => item.productId === getProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQty = getCartItem[indexOfCurrentItem].quantity;

        if (getQty + 1 > getTotalStock) {
          toast.error(`Only ${getTotalStock} can be added for this product`);
          return;
        }
      }
    }
    dispatch(
      addToCart({ userId: user?.id, productId: getProductId, quantity: 1 })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product added to cart");
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setReview("");
    setRating(0);
  }

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleSubmitReview() {
    dispatch(
      addReview({
        productId: productDetails._id,
        userId: user?.id,
        userName: user?.userName,
        review: review,
        rating: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getProductReviews(productDetails._id));
        setRating(0);
        setReview("");
        toast("Review Added to product");
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getProductReviews(productDetails._id));
    }
  }, [dispatch, productDetails]);

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="">
          <div>
            <DialogTitle className="text-3xl font-extrabold">
              {productDetails?.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-2xl mb-5 mt-4">
              {productDetails?.description}
            </DialogDescription>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bol text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent
                rating={averageRating}
                handleRatingChange={() => {}}
              />
            </div>
            <span className="text-muted-foreground">
              ({averageRating.toFixed(2)})
            </span>
          </div>
          <div className="my-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full mb-4 opacity-50 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                onClick={() =>
                  handleAddToCart(
                    productDetails._id,
                    productDetails?.totalStock
                  )
                }
                className="w-full hover:cursor-pointer"
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {review.userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{review.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5 ">
                        <StarRatingComponent
                          rating={review.rating}
                          handleRatingChange={() => {}}
                        />
                      </div>
                      <p className="text-muted-foreground">{review.review}</p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No reviews found</h1>
              )}
            </div>
            <div className="mt-10 flex flex-col gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  handleRatingChange={handleRatingChange}
                  rating={rating}
                />
              </div>
              <Input
                name="review"
                value={review}
                onChange={(event) => setReview(event.target.value)}
                placeholder="Add a review"
              />
              <Button
                onClick={handleSubmitReview}
                disabled={review.trim() === ""}
                className="w-full"
              >
                Sumbit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
