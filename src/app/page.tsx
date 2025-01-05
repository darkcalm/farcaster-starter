import { Viewport } from "next";

import { Metadata } from "next";
import App from "./app";

const appUrl = process.env.NEXT_PUBLIC_URL;

const frame = {
  version: "next",
  imageUrl: `${appUrl}/frame.png`,
  button: {
    title: "launch",
    action: {
      type: "launch_frame",
      name: "wrapper",
      url: appUrl,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#0f172a",
    },
  },
};

export const revalidate = 300;

export const viewport: Viewport = {
  width: 980,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "wrapper",
    openGraph: {
      title: "wrapper",
      description: "wraps",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return <App />;
}
