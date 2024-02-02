import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>© 2024 Hecho por Jonathan Leal para prueba laboral, Un saludo</p>
    </footer>
  );
};

const styles = {
  footer: {
    color: "#ffffff",
    backgroundColor: "#000000",
    padding: "10px",
    textAlign: "center",
    position: "absolute",
    bottom: "0",
    left: "0",
    right: "0",
    width: "100%",
  },
};

export default Footer;
