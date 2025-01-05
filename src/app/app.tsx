"use client";

import React, { useEffect, useState, useCallback } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";

import { useConnect } from "thirdweb/react";
import { EIP1193 } from "thirdweb/wallets";
import { ThirdwebClient } from "~/constants";
//import { shortenAddress } from "thirdweb/utils";
//import { prepareTransaction, sendTransaction } from "thirdweb";
//import { base } from "thirdweb/chains";

export default function App() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [, setContext] = useState<FrameContext>();
  const { connect } = useConnect();
  //  const wallet = useActiveWallet();
  //  const account = useActiveAccount();

  const connectWallet = useCallback(async () => {
    connect(async () => {
      // create a wallet instance from the Warpcast provider
      const wallet = EIP1193.fromProvider({ provider: sdk.wallet.ethProvider });

      // trigger the connection
      await wallet.connect({ client: ThirdwebClient });

      // return the wallet to the app context
      return wallet;
    });
  }, [connect]);

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready({});
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
      if (sdk.wallet) {
        connectWallet();
      }
    }
  }, [isSDKLoaded, connectWallet]);

  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentBaseUrl, setCurrentBaseUrl] = useState(
    "https://filedn.com/lxUBX0hA2uQYeRydyYCII9b/(html-64mpp)%F0%9F%92%A1-yak-rover_5456cdd9-027d-485d-b31e-256295e7a1e0/%F0%9F%92%A1-yak-rover_5456cdd9-027d-485d-b31e-256295e7a1e0/",
  );
  const fileUrl = "%F0%9F%92%A1-yak-rover_page_1.html";

  const translateRelativePaths = useCallback(
    (content: string, baseUrl: string) => {
      const div = document.createElement("div");
      div.innerHTML = content;

      try {
        // Fix image sources
        const images = div.getElementsByTagName("img");
        Array.from(images).forEach((img) => {
          const relativeSrc = img.getAttribute("src");
          if (relativeSrc && !relativeSrc.startsWith("http")) {
            img.src = new URL(relativeSrc, baseUrl).href;
          }
        });
      } catch (error) {
        setContent(`Error fixing image sources: ${error}`);
      }

      try {
        // Convert links to buttons
        const links = div.getElementsByTagName("a");
        Array.from(links).forEach((link) => {
          const href = link.getAttribute("href");
          const className = link.className;
          if (href && !href.startsWith("http")) {
            const fullUrl = new URL(href, baseUrl).href;
            if (fullUrl.split("#")[0] === baseUrl.split("#")[0]) {
              // If it's the same URL as baseUrl (ignoring hash),
              // make it add the hash to the Next.js app URL
              const hash = fullUrl.split("#")[1];
              link.href = `${process.env.NEXT_PUBLIC_URL}#${hash}`;
            } else {
              const button = document.createElement("a");
              button.innerHTML = link.innerHTML;
              button.className = className;
              button.setAttribute("data-href", fullUrl);
              link.parentNode?.replaceChild(button, link);
            }
          }
        });
      } catch (error) {
        setContent(`Error converting links to buttons: ${error}`);
      }

      // Add base tag
      const baseTag = `<base href="${baseUrl}">`;
      return baseTag + div.innerHTML;
    },
    [isLoading],
  );

  const fetchAndProcessContent = useCallback(
    async (url: string, baseUrl: string) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          "https://api.allorigins.win/get?url=" + encodeURIComponent(url),
        );
        const data = await response.json();
        const translatedContent = translateRelativePaths(
          data.contents,
          baseUrl,
        );
        setContent(translatedContent);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [translateRelativePaths, isLoading],
  );

  const handleButtonClick = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "A" && !isLoading) {
        const newUrl = target.getAttribute("data-href");
        if (newUrl) {
          setCurrentBaseUrl(newUrl);
          fetchAndProcessContent(newUrl, newUrl);
        }
      }
    },
    [fetchAndProcessContent, isLoading],
  );

  useEffect(() => {
    document.addEventListener("click", handleButtonClick);
    return () => {
      document.removeEventListener("click", handleButtonClick);
    };
  }, [handleButtonClick]);

  useEffect(() => {
    const initialUrl = currentBaseUrl + fileUrl;
    fetchAndProcessContent(initialUrl, currentBaseUrl);
  }, []);

  return (
    <React.Fragment>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.8)",
            zIndex: 10000,
          }}
        >
          Loading...
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </React.Fragment>
  );
}
