# STN API Webhooks Sample Project

This is a sample project demonstrating how to integrate with the STN API Webhooks. It includes a basic Node.js server with TypeScript that handles webhook events.

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- A Screen Time Network account with API access

## Quickstart

1. Clone this repository:

   ```bash
   git clone https://github.com/clearspace-team/stn-webhooks-sample-project
   cd stn-webhooks-sample-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure your API credentials:

   - Sign in to [The Screen Time Network](https://www.thescreentimenetwork.com/) and create a handle
   - Copy your API key and Webhook Secret from the [API docs](https://www.thescreentimenetwork.com/api)
   - Fill in the constants at the top of server.ts

   ```
   API_KEY=your_api_key_here
   WEBHOOK_SECRET=your_webhook_secret_here
   YOUR_HANDLE=your_stn_handle
   ```

4. Build and Run the server

   ```bash
   npm start
   ```

5. Running the server should print out a local tunnel url that is pointing to your local server. Copy the url and follow set up [here](https://www.thescreentimenetwork.com/api/webhooks) to forward events to your local server.

6. Send a test event from the dashboard and you should see console output and hear a "ding" noise.

### Development Mode

To run the server in development mode with hot reloading:

```bash
npm run dev
```

## Webhook Testing

To test webhooks locally, the project uses localtunnel to create a public URL. The server will automatically create a tunnel and log the URL when started.
