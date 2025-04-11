import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    } else {
      queryParams.push(`${key}=${encodeURIComponent(value)}`);
    }
  }

  return queryParams.join("&");
}

export default function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shoppingCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);

  const category = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectiontId, getCurrentOption) {
    let cypFilters = { ...filters };
    const idxOfCurrentSection = Object.keys(cypFilters).indexOf(getSectiontId);

    if (idxOfCurrentSection === -1) {
      cypFilters = {
        ...cypFilters,
        [getSectiontId]: [getCurrentOption],
      };
    } else {
      const idxOfCurrentOption =
        cypFilters[getSectiontId].indexOf(getCurrentOption);
      if (idxOfCurrentOption === -1) {
        cypFilters[getSectiontId].push(getCurrentOption);
      } else {
        cypFilters[getSectiontId].splice(idxOfCurrentOption, 1);
      }
    }

    setFilters(cypFilters);
    sessionStorage.setItem("filters", JSON.stringify(cypFilters));
  }

  function handleGetProductDetails(getProductId) {
    dispatch(fetchProductDetails(getProductId));
  }

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

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [category]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters, setSearchParams]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails !== null) {
      setOpen(true);
    }
  }, [productDetails]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      key={sortItem.id}
                      value={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
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
      <ProductDetailsDialog
        open={open}
        setOpen={setOpen}
        productDetails={productDetails}
      />
    </div>
  );
}
