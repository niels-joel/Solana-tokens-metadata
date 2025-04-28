## Before running these scripts.
- update repositories
```
sudo apt update && sudo apt upgrade
```
- install curl
```
sudo apt install curl
```
- install bun with
```
curl -fsSL https://bun.sh/install | bash
```
- install dependencies with
```
bun install
```
- put your private keypair in `my-keypair.json`.
- edit the script with your own information.
such as wallet adress, nft names, metadata links. etc.

## Run the scripts
To run a script.
```
bun run script.ts
```