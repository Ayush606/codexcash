import { Client, Databases, ID, Functions, Permission, Role, Query } from 'node-appwrite';

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
    // checking if contest_id is in escrow collection if yes then getting contest amount
    const escrowData = await databases.listDocuments(
      process.env.DATABASE_ID,
      process.env.ESCROW_COLLECTION_ID,
      [Query.equal("contest_id", contestData.$id)]
    )
    // if escrowData is empty then return
    if (escrowData.documents.length === 0) {
      return res.json({
        success: false,
        message: `Contest not found in escrow collection`,
      });
    }

    // getting contest amount
    const transactionData = {
      "sender_id": process.env.SYSTEM_USER_ID,
      "receiver_id": contestData.winner_id,
      "contest_id": contestData.$id,
      "amount": escrowData.documents[0].amount,
      "transaction_type": "release"
    }

    // // calling solana transaction function
    const solTransaction = await functions.createExecution(
      process.env.SOL_TRANSACTIONS_FUNCTION_ID,
      JSON.stringify(transactionData),
      false,
    );

    const solTransactionResponse = await JSON.parse(solTransaction.responseBody);

    if (solTransaction.status === 'error') {
      return res.json({
        success: false,
        message: `Transaction failed: ${solTransaction.message}`,
      });
    }

    // updating escrow collection document
    const escrowDoc = await databases.updateDocument(
      process.env.DATABASE_ID,
      process.env.ESCROW_COLLECTION_ID,
      escrowData.documents[0].$id,
      {
        "status": "released",
        "transaction_id": solTransactionResponse.transactionId
      }
    )

    // adding document in notification collection
    const notificationDoc = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.NOTIFICATIONS_COLLECTION_ID,
      ID.unique(),
      {
        "user_id": contestData.winner_id,
        "message": `You have won the contest and your wallet has been credited with the ${escrowData.documents[0].amount} SOL`,
        "read": false,
        "created_at": new Date().toISOString(),
        "title": "Congratulations!",
        "content_id": contestData.$id,
      },
      [Permission.read([Role.user(contestData.winner_id)]),
      Permission.update([Role.user(contestData.winner_id)])]
    );

    // creating doc in winners collection
    const winnerDoc = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.WINNERS_COLLECTION_ID,
      ID.unique(),
      {
        "contest_id": contestData.$id,
        "dev_id": contestData.winner_id,
        "reward": escrowData.documents[0].amount,
        "created_at": new Date().toISOString(),
        "transaction_id": solTransactionResponse.transactionId
      }
    )



    //creating doc in escrow collection 
    // log("transaction res: " + JSON.stringify(solTransaction));
    // log("Contest ID: " + JSON.stringify(contestData));
    // log("Escrow ID: " + JSON.stringify(escrowDoc));
    // log(`Contest: ${JSON.stringify(contestData)}`);
    // log(`escrow res ${JSON.stringify(escrowData)}`);
    // log(`transaction res ${JSON.stringify(solTransaction)}`);
    // log(`notification res ${JSON.stringify(notificationDoc)}`);
    // log(`escrow doc ${JSON.stringify(escrowDoc)}`);

    return res.json({
      success: true,
      message: `Transaction successful`,
    });
  } catch (err) {
    error("Could not list users: " + err.message);
  }


};
