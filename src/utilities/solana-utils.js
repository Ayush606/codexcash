import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"


// creating a function to get wallet balance in sol by passing public key
export const getWalletBalance = async (publicKey) => {
    const connection = new Connection("https://api.devnet.solana.com");
    const balance = await connection.getBalance(new PublicKey(publicKey));
    return balance / LAMPORTS_PER_SOL;
};
