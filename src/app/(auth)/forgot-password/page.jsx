"use client";
import { Check } from "@gravity-ui/icons";
import { Button, FieldError, Form, Input, Label, TextField, toast } from "@heroui/react";
import { authClient } from "@/lib/auth-client"; // use a relative path if you don't have the @ alias
import React from "react";

const ForgotPasswordPage = () => {
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const { email } = Object.fromEntries(new FormData(form).entries());

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast.danger(error.message || "Something went wrong. Please try again.");
      return;
    }

    toast.success("If an account exists for this email, a reset link has been sent.");
    form.reset();
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <Form className="flex w-96 flex-col gap-4" onSubmit={handleForgotPassword}>
        <TextField
          isRequired
          name="email"
          type="email"
          validate={(value) => {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
              return "Please enter a valid email address";
            }
            return null;
          }}
        >
          <Label>Email</Label>
          <Input placeholder="Enter Your Email" />
          <FieldError />
        </TextField>

        <div className="flex gap-2">
          <Button type="submit">
            <Check />
            Submit
          </Button>
          <Button type="reset" variant="secondary">
            Reset
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ForgotPasswordPage;