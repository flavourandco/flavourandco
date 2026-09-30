import { Webhook } from "svix";
import { POST as clerkPost, GET as clerkGet } from "../src/app/api/webhooks/clerk/route";
import { POST as aliasPost, GET as aliasGet } from "../src/app/api/webhooks/route";

async function runTests() {
  console.log("=== Testing Clerk Webhook Route Handler ===");

  const b64Secret = Buffer.from("01234567890123456789012345678901").toString("base64");
  const TEST_SECRET = `whsec_${b64Secret}`;
  process.env.CLERK_WEBHOOK_SIGNING_SECRET = TEST_SECRET;

  // 1. Test GET endpoint
  const getReq = new Request("http://localhost:3000/api/webhooks/clerk", { method: "GET" });
  const getRes = await clerkGet();
  const getData = await getRes.json();
  console.log("1. GET /api/webhooks/clerk response:", getData);
  if (getData.status !== "active") throw new Error("GET endpoint failed");

  // 2. Test POST with missing headers
  const reqNoHeaders = new Request("http://localhost:3000/api/webhooks/clerk", {
    method: "POST",
    body: JSON.stringify({ type: "user.created" }),
  });
  const resNoHeaders = await clerkPost(reqNoHeaders);
  console.log("2. Missing headers status:", resNoHeaders.status);
  if (resNoHeaders.status !== 400) throw new Error("Expected 400 for missing headers");

  // 3. Test POST with invalid signature
  const reqInvalidSig = new Request("http://localhost:3000/api/webhooks/clerk", {
    method: "POST",
    headers: {
      "svix-id": "msg_123",
      "svix-timestamp": Math.floor(Date.now() / 1000).toString(),
      "svix-signature": "v1,invalid_sig",
      "content-type": "application/json",
    },
    body: JSON.stringify({ type: "user.created" }),
  });
  const resInvalidSig = await clerkPost(reqInvalidSig);
  console.log("3. Invalid signature status:", resInvalidSig.status);
  if (resInvalidSig.status !== 400) throw new Error("Expected 400 for invalid signature");

  // Helper to create valid signed Svix request
  const wh = new Webhook(TEST_SECRET);
  function createSignedRequest(url: string, payload: any) {
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date();
    const bodyStr = JSON.stringify(payload);
    const signature = wh.sign(msgId, timestamp, bodyStr);

    return new Request(url, {
      method: "POST",
      headers: {
        "svix-id": msgId,
        "svix-timestamp": Math.floor(timestamp.getTime() / 1000).toString(),
        "svix-signature": signature,
        "content-type": "application/json",
      },
      body: bodyStr,
    });
  }

  // 4. Test user.created event
  const userCreatedPayload = {
    type: "user.created",
    data: {
      id: "user_test_clerk_123",
      email_addresses: [
        {
          id: "email_123",
          email_address: "john.doe@example.com",
        },
      ],
      primary_email_address_id: "email_123",
      first_name: "John",
      last_name: "Doe",
      public_metadata: { role: "customer" },
      image_url: "https://example.com/avatar.jpg",
    },
  };
  const reqUserCreated = createSignedRequest("http://localhost:3000/api/webhooks/clerk", userCreatedPayload);
  const resUserCreated = await clerkPost(reqUserCreated);
  const dataUserCreated = await resUserCreated.json();
  console.log("4. user.created status:", resUserCreated.status, dataUserCreated);
  if (resUserCreated.status !== 200 || !dataUserCreated.success) throw new Error("user.created failed");

  // 5. Test user.updated event
  const userUpdatedPayload = {
    type: "user.updated",
    data: {
      id: "user_test_clerk_123",
      email_addresses: [
        {
          id: "email_123",
          email_address: "john.doe.updated@example.com",
        },
      ],
      primary_email_address_id: "email_123",
      first_name: "John",
      last_name: "Smith",
      public_metadata: { role: "admin" },
    },
  };
  const reqUserUpdated = createSignedRequest("http://localhost:3000/api/webhooks/clerk", userUpdatedPayload);
  const resUserUpdated = await clerkPost(reqUserUpdated);
  const dataUserUpdated = await resUserUpdated.json();
  console.log("5. user.updated status:", resUserUpdated.status, dataUserUpdated);
  if (resUserUpdated.status !== 200 || !dataUserUpdated.success) throw new Error("user.updated failed");

  // 6. Test non-user event (e.g. session.created) -> should return 200 gracefully
  const sessionPayload = {
    type: "session.created",
    data: { id: "sess_123" },
  };
  const reqSession = createSignedRequest("http://localhost:3000/api/webhooks/clerk", sessionPayload);
  const resSession = await clerkPost(reqSession);
  const dataSession = await resSession.json();
  console.log("6. non-user event status:", resSession.status, dataSession);
  if (resSession.status !== 200 || !dataSession.success) throw new Error("non-user event failed");

  // 7. Test user.deleted event
  const userDeletedPayload = {
    type: "user.deleted",
    data: { id: "user_test_clerk_123", deleted: true },
  };
  const reqUserDeleted = createSignedRequest("http://localhost:3000/api/webhooks/clerk", userDeletedPayload);
  const resUserDeleted = await clerkPost(reqUserDeleted);
  const dataUserDeleted = await resUserDeleted.json();
  console.log("7. user.deleted status:", resUserDeleted.status, dataUserDeleted);
  if (resUserDeleted.status !== 200 || !dataUserDeleted.success) throw new Error("user.deleted failed");

  // 8. Test alias route /api/webhooks
  const reqAlias = createSignedRequest("http://localhost:3000/api/webhooks", userCreatedPayload);
  const resAlias = await aliasPost(reqAlias);
  const dataAlias = await resAlias.json();
  console.log("8. /api/webhooks alias route status:", resAlias.status, dataAlias);
  if (resAlias.status !== 200 || !dataAlias.success) throw new Error("alias route failed");

  console.log("\nALL 8 TESTS PASSED SUCCESSFULLY! 🎉");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
