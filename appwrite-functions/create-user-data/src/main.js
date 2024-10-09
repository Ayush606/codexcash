import { Client, Databases, ID } from 'node-appwrite';
import { uniqueNamesGenerator, adjectives, colors } from 'unique-names-generator';
import { Keypair } from '@solana/web3.js'


// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // You can use the Appwrite SDK to interact with other services
  // For this example, we're using the Users service
  const client = new Client()
    .setEndpoint('https://cloud.codexcash.com/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');

  const databases = new Databases(client);

  // 


  try {
    // generating random username
    const randomUserName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors]
    });

    // generating solana keyPair
    const keyPair = Keypair.generate()


    const publicKey = keyPair.publicKey.toBase58();
    const secretKey = Buffer.from(keyPair.secretKey).toString("hex");



    const userData = await req.body;
    // creating user in users collection
    const userCreated = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.USERS_COLLECTION_ID,
      ID.unique(),
      {
        username: randomUserName,
        wallet_address: publicKey,
        user_id: userData.$id,
        profile_image: 'https://lllfsf.com',
        created_at: userData.$createdAt
      }
    );
    // storing private keys in collection
    const storePrivateKey = await databases.createDocument(
      process.env.DATABASE_ID,
      process.env.PRIVATE_KEYS_COLLECTION_ID,
      ID.unique(),
      {
        user_id: userData.$id,
        private_key: secretKey
      }
    );

    // Log messages and errors to the Appwrite Console
    // These logs won't be seen by your end users
    log(`Created user: ${JSON.stringify({ private_keys: storePrivateKey, userCreated: userCreated })}`);
    return res.json(
      {
        private_keys: storePrivateKey,
        userCreated: userCreated
      });
  } catch (err) {
    error(`Could not create document: ${err.message}`);
    return res.json({ error: err.message });
  }

};


