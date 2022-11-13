import type { NextPage } from "next";
import Head from "next/head";
import styles from "../index.module.css";
import Board from "../../../components/Board";



const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sodoku Game</title>
        <meta name="sodoku game" content="game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.containerOuter}>
        <div className={styles.containerInner}>
          <h1 className={styles.title}>
            Sodoku Game
          </h1>
          <Board/>
        </div>
      </div>
        <button className={'bg-red-400 border border-black '}>Get new Puzzle</button>
    </>
  );
};

export default Home;

