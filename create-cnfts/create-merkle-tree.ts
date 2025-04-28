import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity } from "@metaplex-foundation/umi";
import { createTree, mplBubblegum } from "@metaplex-foundation/mpl-bubblegum";

const endpoint = "https://api.devnet.solana.com";

const createMerkleTree = async () => {
  const umi = createUmi(endpoint)
    .use(mplBubblegum());

  const wallet = await Bun.file("my-keypair.json").text();
  const secretKey = new Uint8Array(JSON.parse(wallet));
  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  umi.use(keypairIdentity(keypair));

  const merkleTree = generateSigner(umi);
  console.log("🌲 MERKLE TREE PUBLICKEY:", merkleTree.publicKey);

  await createTree(umi, {
    merkleTree,
    maxDepth: 5,
    maxBufferSize: 8,
    canopyDepth: 2,
  }).sendAndConfirm(umi);
};

createMerkleTree();
