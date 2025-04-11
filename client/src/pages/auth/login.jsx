import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "@/store/auth-slice";
import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const initialState = {
  email: "",
  password: "",
};

export default function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
      } else {
        toast.error(data?.payload?.message);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't has an account
          <Link
            to="/auth/register"
            className="ml-2 font-medium text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}
