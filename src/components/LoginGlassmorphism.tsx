"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./LoginGlassmorphism.module.css";
import { FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { body } from "framer-motion/client";

const LoginGlassmorphism = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Allow error to be either string or null
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false); // To toggle between login and password reset
  const [step, setStep] = useState(1); // Tracks the reset password flow steps

  const handleLogin = async (e: React.FormEvent) => {  // Specify the type of 'e'
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login failed");
      } else {
        const { access_token,refresh_token, role } = data;
        localStorage.setItem("authToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        localStorage.setItem("role", role);

        setTimeout(() => {
          switch (role) {
            case "STUDENT":
              router.push("/dashboard/student");
              break;
            case "TEACHER":
              router.push("/dashboard/teacher");
              break;
            case "ADMIN":
              router.push("/dashboard/admin");
              break;
            case "MANAGER":
              router.push("/dashboard/manager");
              break;
            case "FINANCE":
              router.push("/dashboard/finance");
              break;
            default:
              router.push("/");
          }
        }, 2000);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  const handleRequestReset = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/v1/users/forgetPassword", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: email,
      });


      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to request password reset.");
      } else {
        setStep(2); // Move to the reset code/password input step
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/v1/users/resetPassword", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: resetCode,
          passwordRequestDTO: {
            newPassword,
            confirmationPassword: confirmPassword,
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to reset password.");
      } else {
        setStep(1); // Reset to login view
        setIsResetMode(false); // Go back to login mode
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <section className={styles.section}>
        <div className={styles.color}></div>
        <div className={styles.color}></div>
        <div className={styles.color}></div>
        <div className={styles.box}>
          {[...Array(5)].map((_, i) => (
            <motion.div
              className={styles.square}
              style={{ ["--i" as any]: i }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              key={i}
            ></motion.div>
          ))}
          <div className={styles.container}>
            <div className={styles.form}>
              <h2 className={styles.h2}>{isResetMode ? "Password Reset" : "Login Form"}</h2>
              {isResetMode ? (
                <>
                  {step === 1 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className={styles.inputBox}>
                        <motion.input
                          type="email"
                          placeholder="Email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className={styles.inputBox}>
                        <motion.button
                          type="button"
                          onClick={handleRequestReset}
                          className={styles.submitButton}
                          disabled={isLoading}
                        >
                          {isLoading ? <FaSpinner className={styles.spinnerOverlay} /> : "Request Password Reset"}
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className={styles.inputBox}>
                        <motion.input
                          type="text"
                          placeholder="Reset Code"
                          required
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value)}
                        />
                      </div>
                      <div className={styles.inputBox}>
                        <motion.input
                          type="password"
                          placeholder="New Password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className={styles.inputBox}>
                        <motion.input
                          type="password"
                          placeholder="Confirm Password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <div className={styles.inputBox}>
                        <motion.button
                          type="button"
                          onClick={handleResetPassword}
                          className={styles.submitButton}
                          disabled={isLoading}
                        >
                          {isLoading ? <FaSpinner className={styles.spinnerOverlay} /> : "Reset Password"}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                  <p className={styles.forget}>
                    Back to Login?{" "}
                    <a href="#" onClick={() => setIsResetMode(false)}>
                      Click Here
                    </a>
                  </p>
                </>
              ) : (
                <motion.form
                  onSubmit={handleLogin}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={styles.inputBox}>
                    <motion.input
                      type="text"
                      placeholder="Username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className={styles.inputBox}>
                    <motion.input
                      type="password"
                      placeholder="Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className={styles.inputBox}>
                    <motion.button
                      type="button"
                      onClick={handleLogin}
                      className={styles.submitButton}
                      disabled={isLoading}
                    >
                      {isLoading ? <FaSpinner className={styles.spinnerOverlay} /> : "Login"}
                    </motion.button>
                  </div>
                </motion.form>
              )}
              {error && <p className={styles.error}>{error}</p>}
              {!isResetMode && (
                <p className={styles.forget}>
                  Forget Password?{" "}
                  <a href="#" onClick={() => setIsResetMode(true)}>
                    Click Here
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default LoginGlassmorphism;
