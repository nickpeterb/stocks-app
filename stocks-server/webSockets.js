import { WebSocket, WebSocketServer } from "ws";

export function startWebSocketConnection(wsPort) {
  const twelveDataWSUrl = "wss://ws.twelvedata.com/v1/quotes/price?apikey=" + process.env.TWELVE_API_KEY;

  const server = new WebSocketServer({ port: wsPort });

  // Create a single WebSocket connection to TwelveData
  let twelveDataWS = new WebSocket(twelveDataWSUrl);

  // Maintain a list of connected clients and their stock subscriptions
  const clients = new Map(); // key: client ws, value: { symbols: [] }

  // Maintain a list of subscribed symbols (to avoid duplicate subscriptions)
  const subscribedSymbols = new Set();

  // Helper to subscribe to a symbol on TwelveData
  function subscribeToSymbol(symbol) {
    if (!subscribedSymbols.has(symbol)) {
      twelveDataWS.send(
        JSON.stringify({
          action: "subscribe",
          params: { symbols: symbol },
        })
      );
      subscribedSymbols.add(symbol);
      console.log(`Subscribed to symbol: ${symbol}`);
    }
  }

  function unsubscribeFromSymbol(symbol) {
    if (subscribedSymbols.has(symbol)) {
      twelveDataWS.send(
        JSON.stringify({
          action: "unsubscribe",
          params: { symbols: symbol },
        })
      );
      subscribedSymbols.delete(symbol);
      console.log(`Unsubscribed from symbol: ${symbol}`);
    }
  }

  // Unsubcribe (globally) from symbol if no clients are connected to it
  function cleanUpConnections(symbol) {
    let hasConnection = false;
    clients.forEach((clientInfo, _) => {
      if (clientInfo.symbols.includes(symbol)) {
        hasConnection = true;
      }
    });
    // Unsubscribe from the symbol via TwelveData
    if (!hasConnection) unsubscribeFromSymbol(symbol);
  }

  // When a new connection is established to the server
  server.on("connection", (client) => {
    console.log("New client connected");

    // Initialize the client's subscription list
    clients.set(client, { symbols: [] });

    client.on("message", (message) => {
      const data = JSON.parse(message);

      // Expected format: { action: 'subscribe', symbol: 'AAPL' }
      if (data.action === "subscribe" && data.symbol) {
        const { symbol } = data;

        // Add the symbol to the client's subscription list
        clients.get(client).symbols.push(symbol);
        console.log(`Client subscribed to: ${symbol}`);

        // Subscribe to the symbol via TwelveData (only once globally)
        subscribeToSymbol(symbol);
      }

      // Only call unsubscribeFromSymbol if ALL clients have unsubscribed from symbol
      // Otherwise just remove it from their list
      if (data.action === "unsubscribe" && data.symbol) {
        const { symbol } = data;

        // Remove the symbol from the client's subscription list
        const index = clients.get(client).symbols.indexOf(symbol);
        if (index !== -1) clients.get(client).symbols.splice(index, 1);
        console.log(`Client unsubscribed from: ${symbol}`);

        cleanUpConnections(symbol);
      }
    });

    // Handle client disconnection
    client.on("close", () => {
      const symbols = clients.get(client).symbols;
      clients.delete(client);
      for (const symbol of symbols) {
        cleanUpConnections(symbol);
      }
      console.log("Client disconnected");
    });
  });

  // Handle connection open
  //   twelveDataWS.on("open", () => {
  //     console.log("TwelveData WebSocket opened");
  //   });

  // Handle messages from TwelveData WebSocket
  twelveDataWS.on("message", (message) => {
    const data = JSON.parse(message);
    // console.log("TwelveData message recived", data);

    // Example TwelveData message format: { symbol: 'AAPL', price: 145.67, ... }
    const symbol = data.symbol;

    // Broadcast the update to all clients subscribed to this symbol
    clients.forEach((clientInfo, client) => {
      if (clientInfo.symbols.includes(symbol)) {
        client.send(JSON.stringify(data));
      }
    });
  });

  // Handle connection close and reconnect to TwelveData
  //   twelveDataWS.on("close", () => {
  //     console.log("TwelveData WebSocket closed. Reconnecting...");
  //     setTimeout(() => {
  //       twelveDataWS = new WebSocket(twelveDataWSUrl);
  //     }, 1000); // Reconnect after 1 second
  //   });

  twelveDataWS.on("error", (error) => {
    console.error("TwelveData WebSocket error:", error);
  });

  console.log("WebSocket server running on ws://localhost:" + wsPort);
}
