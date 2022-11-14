import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState, VFC } from "react";
import styles from "./Layout.module.scss";
import Link from "next/link";
import Image from "next/image";

const mainRoutes = ["Play", "Stats"];

export type LayoutProps = {
  children: ReactNode;
};

export const Layout = (props: LayoutProps) => {
  const router = useRouter();
  const route = router.pathname;

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
      </div>
      <main className={styles.main_content}>{props.children}</main>
    </div>
  );
};
