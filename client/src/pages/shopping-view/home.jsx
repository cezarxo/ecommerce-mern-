import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightningIcon,
  ShirtIcon,
  Umbrella,
  WatchIcon,
  Shirt,
  WashingMachine,
  ShoppingBasket,
  Airplay,
  Images,
  Heater,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImgs } from "@/store/common-slice";

const categories = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightningIcon },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: Umbrella },
];

const brands = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

export default function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [open, setOpen] = useState(false);
  const { productList,productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { featureImgs } = useSelector((state) => state.common);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleNavigate(currFilter, type) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [type]: [currFilter.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getProductId) {
    dispatch(fetchProductDetails(getProductId));
  }

  function handleAddToCart(getProductId) {
    dispatch(
      addToCart({ userId: user?.id, productId: getProductId, quantity: 1 })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product added to cart");
      }
    });
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImgs.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [currentSlide, featureImgs.length]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (productDetails !== null) {
      setOpen(true);
    }
  }, [productDetails]);

  useEffect(() => {
    dispatch(getFeatureImgs());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImgs && featureImgs.length > 0 ? featureImgs.map((slide, idx) => (
          <img
            src={slide?.image}
            key={idx}
            className={` ${
              idx === currentSlide ? "opacity-100" : "opacity-0"
            } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
          />
        )): null}
        <Button
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + featureImgs.length) % featureImgs.length
            )
          }
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1 - featureImgs.length) % featureImgs.length
            )
          }
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                onClick={() => handleNavigate(category, "category")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <category.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="text-sm font-bold">{category.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <Card
                key={brand.id}
                onClick={() => handleNavigate(brand, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brand.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="text-sm font-bold">{brand.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((product) => (
                  <ShoppingProductTile
                    key={product._id}
                    product={product}
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddToCart={handleAddToCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={open}
        setOpen={setOpen}
        productDetails={productDetails}
      />
    </div>
  );
}
