import { Client, Databases, ID, Functions, Permission, Role } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // You can use the Appwrite SDK to interact with other services
  // For this example, we're using the Users service
  const client = new Client()
    .setEndpoint('https://cloud.codexcash.com/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');
  const databases = new Databases(client);
  const functions = new Functions(client);

  try {
    // getting id from request body from contest collection event
    const contestData = await req.body;
    //
    const transactionData = {
      "sender_id": contestData.client_id,
      "receiver_id": process.env.SYSTEM_USER_ID,
      "contest_id": contestData.$id,
      "amount": contestData.reward,
      "transaction_type": "escrow"
    }

    // calling solana transaction function
    const solTransaction = await functions.createExecution(
      process.env.SOL_TRANSACTIONS_FUNCTION_ID,
      JSON.stringify(transactionData),
      false,
    );

    const solTransactionResponse = await JSON.parse(solTransaction.responseBody);

    // creating doc in escrow collection
    if (solTransaction.status === 'error') {
      return res.json({
        success: false,
        message: `Transaction failed: ${solTransaction.message}`,
      });
    }

    const escrowDoc = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.ESCROW_COLLECTION_ID,
      ID.unique(),
      {
        "contest_id": contestData.$id,
        "client_id": contestData.client_id,
        "amount": contestData.reward,
        "status": "funded",
        "created_at": new Date().toISOString(),
        "transaction_id": solTransactionResponse.transactionId
      })

    // adding document in notification collection
    const notificationDoc = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.NOTIFICATIONS_COLLECTION_ID,
      ID.unique(),
      {
        "user_id": contestData.client_id,
        "message": `Now you can see and manage your contest in the my contest section`,
        "read": false,
        "created_at": new Date().toISOString(),
        "title": "Your Contest has been Published",
        "content_id": contestData.$id,
      },
      [Permission.read([Role.user(contestData.client_id)]),
      Permission.update([Role.user(contestData.client_id)])]
    );



    //creating doc in escrow collection 
    // log("transaction res: " + JSON.stringify(solTransaction));
    // log("Contest ID: " + JSON.stringify(contestData));
    // log("Escrow ID: " + JSON.stringify(escrowDoc));

    return res.json({
      success: true,
      message: `Transaction successful`,
    });
  } catch (err) {
    error("Could not list users: " + err.message);
  }


};
