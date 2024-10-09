import { Client, Databases, ID, Query } from 'node-appwrite';
import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, clusterApiUrl, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // You can use the Appwrite SDK to interact with other services
  // For this example, we're using the Users service
  const client = new Client()
    .setEndpoint("https://cloud.codexcash.com/v1")
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');

  const databases = new Databases(client);

  // Function to create a Keypair from a 128-character hex private key
  const keypairFromExtendedHex = (hexPrivateKey) => {
    // Convert the hex string to a Uint8Array (128 hex chars = 64 bytes)
    const privateKeyBytes = Uint8Array.from(Buffer.from(hexPrivateKey, 'hex'));

    // Create and return a Keypair from the Uint8Array (which includes the secret key)
    return Keypair.fromSecretKey(privateKeyBytes);
  };

  // Function to check the balance of the wallet
  const checkBalance = async (publicKeyString) => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const publicKey = new PublicKey(publicKeyString);
    const balance = await connection.getBalance(publicKey);
    return (balance / LAMPORTS_PER_SOL);
  };

  // Function to send SOL from the wallet
  const sendSol = async (fromKeypair, toPublicKeyString, amountInSOL) => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const toPublicKey = new PublicKey(toPublicKeyString);

    // Create a transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports: amountInSOL * LAMPORTS_PER_SOL, // Convert SOL to lamports
      })
    );

    // Send and confirm the transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);

    return (`${signature}`);
  };





  try {
    // getting transaction_req_data (sender_id, receiver_id, amount, transaction_type) from body
    const transaction_req_data = await req.bodyJson;
    // checking if amount is more than equal to 0.01
    if (transaction_req_data.amount < 0.01) {
      return res.json({
        status: 'error',
        message: 'amount should be more than or equal to 0.01 sol',
      })
    }
    // getting senders private_keys from private_keys collection
    const privateKeyDoc = await databases.listDocuments(
      process.env.DATABASE_ID,
      process.env.PRIVATE_KEYS_COLLECTION_ID,
      [Query.equal("user_id", transaction_req_data.sender_id)]
    )
    // getting privateKey from privateKeyDoc
    const privateKey = privateKeyDoc.documents[0].private_key;

    // getting receiver's wallet address
    const receiversWalletAddressDoc = await databases.listDocuments(
      process.env.DATABASE_ID,
      process.env.USERS_COLLECTION_ID,
      [Query.equal("user_id", transaction_req_data.receiver_id)]
    )

    // getting privateKey from privateKeyDoc
    const receiversWalletAddress = receiversWalletAddressDoc.documents[0].wallet_address;

    // if (transaction_req_data.transaction_type === "escrow") {
    //   const createTransaction = databases.createDocument(
    //     process.env.DATABASE_ID

    //   )
    // }
    // getting sender's public key for checking balance and paying sol to receiver
    const sendersKeyPair = keypairFromExtendedHex(privateKey);

    // checking balance of sender's account before doing transaction.
    const sendersBalance = await checkBalance(sendersKeyPair.publicKey);

    // checking if sufficient balance for transaction
    if (transaction_req_data.amount >= sendersBalance) {
      return res.json({
        status: 'error',
        message: 'insufficient balance',
        balance: sendersBalance,
        requested_amount: transaction_req_data.amount
      });
    }

    // if sufficient balance then send sol to receiver

    const transactionSignature = await sendSol(sendersKeyPair, receiversWalletAddress, transaction_req_data.amount);
    const transactionId = ID.unique();
    // doing entry in transaction collection
    const transactionDoc = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.TRANSACTIONS_COLLECTION_ID,
      transactionId,
      {
        contest_id: transaction_req_data.contest_id,
        sender_id: transaction_req_data.sender_id,
        receiver_id: transaction_req_data.receiver_id,
        amount: transaction_req_data.amount,
        transaction_date: new Date().toISOString(),
        transaction_type: transaction_req_data.transaction_type,
        status: "completed",
        transaction_signature: transactionSignature
      }
    );





    // Log the entire transaction_req_data object
    log(`req body: ${JSON.stringify(transaction_req_data)}`);
    log(`receiversWalletAddressDoc doc: ${JSON.stringify(receiversWalletAddressDoc)}`);
    log(`private key : ${JSON.stringify(privateKey)}`);
    log(`receiversWalletAddress : ${JSON.stringify(receiversWalletAddress)}`);
    log(`keypair : ${JSON.stringify(sendersKeyPair)}`);
    log(`sandersBal : ${(sendersBalance)}`);
    log(`req amount : ${(transaction_req_data.amount)}`);
    log(`Sender ID: ${transaction_req_data.sender_id}`);
    log(`Receiver ID: ${transaction_req_data.receiver_id}`);

    return res.json({
      message: 'Transaction successful',
      sender_id: transaction_req_data.sender_id,
      receiver_id: transaction_req_data.receiver_id,
      amount: transaction_req_data.amount,
      transaction_type: transaction_req_data.transaction_type,
      transactionId: transactionDoc.$id,
    });
  } catch (err) {
    error(`Error: ${err.message} `);
    return res.json({ error: err.message });
  }


};
