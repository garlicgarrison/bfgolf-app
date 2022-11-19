import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState, VFC } from "react";
import styles from "./layout.module.scss";
import Link from "next/link";
import Image from "next/image";
import { withAuthUser, AuthAction, useAuthUser } from "next-firebase-auth";
import LogoutButton from "../icons/Logout";
import { signout } from "../../auth/firebase";

const mainRoutes = ["Play", "Stats"];

export type LayoutProps = {
  children: ReactNode;
};

export const Layout = (props: LayoutProps) => {
  const router = useRouter();
  const route = router.pathname;

  const user = useAuthUser();

  const handleLogout = () => {
    signout();
  };

  return (
    <div className={styles.main_page_content}>
      <div className={styles.main_page_nav}>
        <div className={styles.logo_container}>
          <Image
            src={"/favicon.svg"}
            layout={"fixed"}
            width={30}
            height={30}
            alt={"BFgolf logo"}
          />
          <b>BFgolf</b>
        </div>
        <ul>
          {mainRoutes.map((r) => (
            <li
              key={"route" + r}
              className={
                route.includes(`/${r.toLowerCase()}`)
                  ? styles.on_list
                  : styles.offlist
              }
            >
              <Link href={{ pathname: `/${r.toLowerCase()}` }}>
                <div className={styles.nav_card_container}>{r}</div>
              </Link>
            </li>
          ))}
        </ul>
        {!user.email ? (
          <div className={styles.bottom_container}>
            <Link href={{ pathname: `/signup` }}>
              <button className={styles.signup_button}>Sign Up</button>
            </Link>

            <Link href={{ pathname: `/login` }}>
              <button className={styles.login_button}>Log In</button>
            </Link>
          </div>
        ) : (
          <div className={styles.bottom_end_container}>
            <div>{user.email}</div>
            <button className={styles.logout_button} onClick={handleLogout}>
              <LogoutButton />
              Log out
            </button>
          </div>
        )}
      </div>
      <main className={styles.main_content}>{props.children}</main>
    </div>
  );
};

export const AuthLayout = withAuthUser<LayoutProps>({
  whenUnauthedAfterInit: AuthAction.RENDER,
})(Layout);
export default AuthLayout;
