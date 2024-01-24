"use client";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { ChangeEvent, useEffect, useState } from "react";
import AuthModalInputs from "./AuthModalInputs";
import useAuth from "../hooks/useAuth";
import { useAuthContext } from "../context/AuthContext";
import { Alert, CircularProgress } from "@mui/material";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  color: "black",
};

export default function AuthModal({ isSignIn = true }: { isSignIn: boolean }) {
  const { signin, signup } = useAuth();
  const { data, error, loading } = useAuthContext();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const renderContent = (isSignInContent: string, isSignUpContent: string) =>
    isSignIn ? isSignInContent : isSignUpContent;
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  const [disabled, setDisabled] = useState(false);

  console.log({ error });
  useEffect(() => {
    if (isSignIn) {
      if (inputs.password && inputs.email) {
        return setDisabled(false);
      }
    } else {
      if (inputs.firstName && inputs.city && inputs.email) {
        return setDisabled(false);
      }
    }

    return setDisabled(true);
  }, [inputs, isSignIn]);

  const handleClick = () => {
    if (isSignIn) {
      signin(inputs, handleClose);
    } else {
    }
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  return (
    <div className="text-black">
      <button
        className={`${
          isSignIn ? "bg-blue-400 text-white border " : ""
        } px-4 p-1 rounded mr-3`}
        onClick={handleOpen}
      >
        {isSignIn ? "Sign in" : "Sign out"}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {loading ? (
            <div className="px-24 h-[600px]">
              <CircularProgress />
            </div>
          ) : (
            <div className="p-2 h-[600px]">
              {error ? (
                <Alert severity="error" className="mb-4">
                  {error}
                </Alert>
              ) : null}
              <div className="uppercase font-bold text-center pb-2 border-b mb-2">
                <p className="text-small">
                  {isSignIn ? "Sign in" : "Create account like so"}
                </p>
              </div>
              <div className="m-auto">
                <h2 className="text-2xl font-light text-center">
                  {renderContent(
                    "Log in to your account",
                    "Create your GazTable account"
                  )}
                </h2>
                <AuthModalInputs
                  isSignIn={isSignIn}
                  inputs={inputs}
                  handleChangeInput={handleChangeInput}
                />
                <button
                  onClick={handleClick}
                  disabled={disabled}
                  className="uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400"
                >
                  {renderContent("Sign in", "Create account")}
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
