import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const endpoint = "https://api.devnet.solana.com";

const createCollection = async () => {
  const umi = createUmi(endpoint)
    .use(mplTokenMetadata())
    .use(irysUploader());

  const wallet = await Bun.file("my-keypair.json").text();
  const secretKey = new Uint8Array(JSON.parse(wallet));
  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  umi.use(keypairIdentity(keypair));

  const collectionID = generateSigner(umi);
  console.log("⭐️ COLLECTION ID", collectionID.publicKey);

  const collectionMetadataUri = "LINK TO METADATA OF COLLECTION";

  await createNft(umi, {
    mint: collectionID,
    name: "Ape Collection",
    uri: collectionMetadataUri,
    isCollection: true,
    sellerFeeBasisPoints: percentAmount(50),
  }).sendAndConfirm(umi);
};

createCollection();
