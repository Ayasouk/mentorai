import React from "react";
import styles from "./RootPage.module.css"; // Assuming CSS module

const RootPage: React.FC = () => {
  return (
    <div className={styles.heroContainer}>
      <h1 id="headline">Transform Your Long Videos Into Engaging Shorts</h1>
      <p id="subheadline">Quick, easy, and with viral potential - all in a few clicks.</p>
      <button className={styles.ctaButton}>Get Started</button>
    </div>
  );
};

export default RootPage;