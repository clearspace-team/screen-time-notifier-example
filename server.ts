import express, { Request, Response } from "express";
import crypto from "crypto";
import localtunnel from "localtunnel";

const player = require("play-sound")({});

// --- Constants --- //
// TODO: Insert your webhook secret and handle here
const WEBHOOK_SECRET = "your_webhook_secret";
const YOUR_HANDLE: string = "your_stn_handle";

if (
  // @ts-ignore
  WEBHOOK_SECRET === "your_webhook_secret" ||
  // @ts-ignore
  YOUR_HANDLE === "your_stn_handle"
) {
  console.error(
    "\nEnter your API key, webhook secret, and Screen Time Network handle in the server.ts file before running the server\n"
  );
  process.exit(1);
}

const validateWebhookBody = (
  rawBody: string,
  receivedSig: string
): any | null => {
  const expectedSig = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  const sigValid = crypto.timingSafeEqual(
    Buffer.from(receivedSig),
    Buffer.from(expectedSig)
  );

  if (!sigValid) {
    return null;
  }

  return JSON.parse(rawBody);
};

// ---- Express server ---- //
const app = express();
const port: number = 8080;

// ---- Webhook ---- //
app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }), // NOTE: make sure to use raw body parser for webhook
  async (req: Request, res: Response) => {
    console.log("Webhook received");
    const rawBody = req.body.toString("utf8");
    const receivedSig = req.headers["x-clearspace-signature"] as string;

    const body = validateWebhookBody(rawBody, receivedSig);

    if (!body) {
      return res.status(401).send("Invalid signature");
    } else if (!body.handle || !body.trigger) {
      return res.status(400).send("Invalid webhook body");
    }

    const { handle, trigger, data } = body;

    player.play("ding.mp3", function (err: any) {
      if (err) {
        console.error("Error playing sound:", err);
      }
    });

    console.log(
      "\nWebhook Payload:",
      JSON.stringify({ handle, trigger, data }, null, 2)
    );
    console.log("\n");

    res.status(200).send();
  }
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// ---- Local Tunnel ---- //
(async () => {
  try {
    const tunnel = await localtunnel({
      port: port,
      subdomain: `screen-time-notifier-example-${YOUR_HANDLE.replace(
        /_/g,
        "-"
      ).slice(0, 12)}`,
    });

    console.log("Local Tunnel URL", tunnel.url + "/api/webhook");

    tunnel.on("close", () => {
      console.log("Local tunnel closed");
    });
  } catch (error) {
    console.error("Error creating local tunnel", error);
  }
})();
