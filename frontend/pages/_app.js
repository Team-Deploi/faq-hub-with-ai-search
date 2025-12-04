import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { Poppins } from "next/font/google";
import Header from "../components/Header";
import "../styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

export default function App({ Component, pageProps }) {
  const is404 = pageProps?.statusCode === 404;
  return (
    <div className={poppins.className}>
      {!is404 && <Header />}
      <CopilotKit runtimeUrl="/api/copilotkit">
        <Component {...pageProps} />
      </CopilotKit>
    </div>
  );
}
