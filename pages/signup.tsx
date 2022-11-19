import { FirebaseError } from "firebase/app";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactEventHandler, useRef, useState } from "react";
import { loginGoogle, signupEmail } from "../auth/firebase";
import {
  AuthError,
  SomethingWrong,
  UserNotFound,
  WrongPassword,
} from "../errors/auth";
import styles from "../styles/Login.module.scss";

export default function Signup() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<AuthError | null>(null);

  const formRef = useRef(null);
  const [passVal, setPassVal] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const formValid = () => {
    if (formRef.current) {
      let formData = new FormData(formRef.current);
      return (
        errors.password === "" &&
        errors.email === "" &&
        passVal !== "" &&
        formData.get("email") !== ""
      );
    }
    return false;
  };

  const formHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let tempErrors = errors;
    switch (name) {
      case "email":
        const emailRegex =
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        tempErrors.email = emailRegex.test(value) ? "" : "Email is not valid";
        break;
      case "password":
        setPassVal(value.replace(/\s/g, ""));
        tempErrors.password =
          value.length < 8 ? "Password must be at least 8 characters" : "";
        break;
      default:
        break;
    }
    setErrors(Object.assign({}, tempErrors));
  };

  const handleEmailSignup = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const formData = new FormData(formRef.current ?? undefined);
    const email = formData.get("email");
    const password = formData.get("password");

    if (email !== null && password !== null) {
      signupEmail(email as string, password as string)
        .then((user) => {
          if (user) {
            router.push("/play");
          }
        })
        .catch((reason: FirebaseError) => {
          console.log("auth error --", reason.code);
          switch (reason.code) {
            case "auth/wrong-password":
              setSubmitError(WrongPassword);
              break;
            case "auth/user-not-found":
              setSubmitError(UserNotFound);
              break;
            default:
              setSubmitError(SomethingWrong);
          }
        });
    }
  };

  const handleGoogleSignup = (event: React.MouseEvent<HTMLButtonElement>) => {
    loginGoogle()
      .then((user) => {
        if (user) {
          router.push("/play");
        }
      })
      .catch((reason) => {
        switch (reason.code) {
          case "auth/wrong-password":
            setSubmitError(WrongPassword);
            break;
          default:
            setSubmitError(SomethingWrong);
        }
      });
  };

  return (
    <div className={styles.login_page_container}>
      <div className={styles.login_card_container}>
        <h2 className={styles.login_header}>Sign up to ChessVars</h2>
        {submitError && (
          <div className={styles.submit_error_container}>{submitError}</div>
        )}

        <form className={styles.form} ref={formRef}>
          <label>Email</label>
          <br />
          <span className={styles.error_span}>{errors.email}</span>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            name="email"
            onChange={formHandler}
          />

          <label>Password</label>
          <br />
          <span className={styles.error_span}>{errors.password}</span>
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            name="password"
            onChange={formHandler}
          />

          <div className={styles.submit_button_container}>
            <button
              className={styles.submit_button}
              disabled={!formValid()}
              onClick={handleEmailSignup}
              name="email_login"
            >
              Sign up
            </button>
          </div>
        </form>

        <div className={styles.social_auth}>
          {/*google */}
          <button
            className={styles.social_login_button}
            name="google_login"
            onClick={handleGoogleSignup}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3">
              <path
                d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                fill="#4285f4"
              />
              <path
                d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                fill="#34a853"
              />
              <path
                d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                fill="#fbbc04"
              />
              <path
                d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                fill="#ea4335"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>
        </div>
        <div className={styles.other_pages_link_container}>
          <span className={styles.other_pages}>
            Already have an account?
            <Link
              href={{ pathname: "/login" }}
              className={styles.other_pages_link}
            >
              Log in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
