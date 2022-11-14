import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { Layout } from "../components/layouts/layout";
import dynamic from "next/dynamic";
import "@uiw/react-textarea-code-editor/dist.css";
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { brainfuck } from "@codemirror/legacy-modes/mode/brainfuck";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { useEffect, useRef, useState } from "react";

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);

export default function Home() {
  const editContainerRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState<number>(0);

  useEffect(() => {
    if (editContainerRef.current) {
      setEditorHeight(editContainerRef.current.offsetHeight ?? 0);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (editContainerRef.current) {
        setEditorHeight(editContainerRef.current.offsetHeight ?? 0);
      }
    });

    return () => window.removeEventListener("resize", () => {});
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>BF Golf</title>
          <meta name="description" content="Brainfuck golf" />
          <link rel="icon" href="/favicon.svg" />
        </Head>

        <main className={styles.main}>
          <div className={styles.playground_container}>
            {/* commands */}
            <div className={styles.commands_container}>
              <button>Run</button>
              <input />
            </div>

            {/* editor */}
            <div
              className={styles.text_editor_container}
              ref={editContainerRef}
            >
              <CodeMirror
                className={styles.text_editor}
                extensions={[StreamLanguage.define(brainfuck)]}
                placeholder="Your code here"
                theme={okaidia}
                minHeight={`${editorHeight}px`}
                maxHeight={`${editorHeight}px`}
              />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
