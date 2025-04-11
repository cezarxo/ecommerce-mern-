import { ChartNoAxesCombined } from "lucide-react";
import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, LayoutDashboard, ShoppingBasket } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";

export const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  return (
    <nav className="mt-4 flex-col flex gap-2">
      {adminSidebarMenuItems.map((item) => (
        <div
          key={item.id}
          onClick={() => {
            navigate(item.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex text-xl cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {item.icon}
          <span> {item.label} </span>
        </div>
      ))}
    </nav>
  );
}

export default function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();
  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen} className="lg:hidden">
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b ">
              <SheetTitle className="flex gap-2 my-2 text-2xl font-extrabold">
                <ChartNoAxesCombined size={30} />
                Admin Panel
              </SheetTitle>
              <SheetDescription/>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}
