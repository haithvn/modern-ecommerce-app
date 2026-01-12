import React, { useEffect, useState } from "react";
import { Container, Alert, Spinner } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verify } from "../api/authApi";
import { AxiosError } from "axios";

const VerifyAccount: React.FC = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!code) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    const verifyCode = async () => {
      try {
        await verify(code);
        setStatus("success");
        setMessage("Account verified successfully. You can now login.");
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setStatus("error");
        setMessage(
          axiosError.response?.data?.message || "Verification failed.",
        );
      }
    };

    verifyCode();
  }, [code, navigate]);

  return (
    <Container className="mt-5 text-center">
      <h2>Account Verification</h2>
      {status === "loading" && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
      {status === "success" && <Alert variant="success">{message}</Alert>}
      {status === "error" && <Alert variant="danger">{message}</Alert>}
    </Container>
  );
};

export default VerifyAccount;
