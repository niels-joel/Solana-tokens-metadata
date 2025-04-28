import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { keypairIdentity, publicKey } from "@metaplex-foundation/umi";
import { mintV1, mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

const endpoint = "https://api.devnet.solana.com";

const mintCNFT = async () => {
  const fellowAddresses = ["RECEIVER WALLET ADRESS"];

  const umi = createUmi(endpoint)
    .use(mplBubblegum())
    .use(mplTokenMetadata());

  const wallet = await Bun.file("my-keypair.json").text();
  const secretKey = new Uint8Array(JSON.parse(wallet));
  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  umi.use(keypairIdentity(keypair));

  const collectionMintPublicKey = publicKey("YOUR-COLLECTION-PUBLICKEY");
  const merkleTreePublicKey = publicKey("YOUR-MERKLE-TREE-PUBLICKEY");

  const nftMetadataUri = "LINK TO METADATA OF NFT";

  for (const student of fellowAddresses) {
    console.log("Student Address:", student);
    const newOwner = publicKey(student);

    await mintV1(umi, {
      leafOwner: newOwner,
      merkleTree: merkleTreePublicKey,
      collectionMint: collectionMintPublicKey,
      metadata: {
        name: "NAME OF YOU NFT",
        uri: nftMetadataUri,
        sellerFeeBasisPoints: 500,
        collection: { key: collectionMintPublicKey, verified: false },
        creators: [
          { address: umi.identity.publicKey, verified: true, share: 100 },
        ],
      },
    }).sendAndConfirm(umi, { send: { commitment: "finalized" } });

    console.log("Waiting for 5 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};

mintCNFT();
