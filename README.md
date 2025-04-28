# Solana token metadata and logo's
repository with Metadata and images for solana spl tokens and nfts

# How to make solana spl-tokens and nfts, cnfts
This is for linux, on windows use WSL

## Install Docker and other dependencies
Run these commands to install docker and other tools you need
```
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```
```
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## Create a docker image with all the needed tools preinstalled
First, create a `Dockerfile` with `nano Dockerfile`
paste this into the `Dockerfile`.
```
# Use a lightweight base image
FROM debian:bullseye-slim

# Set non-interactive frontend for apt
ENV DEBIAN_FRONTEND=noninteractive

# Install required dependencies and Rust
RUN apt-get update && apt-get install -y \
    curl build-essential libssl-dev pkg-config nano \
    && curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Add Rust to PATH
ENV PATH="/root/.cargo/bin:$PATH"

# Verify Rust installation
RUN rustc --version

# Install Solana CLI
RUN curl -sSfL https://release.anza.xyz/stable/install | sh \
    && echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc

# Add Solana CLI to PATH
ENV PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

# Verify Solana CLI installation
RUN solana --version

# Set up Solana config for Devnet
RUN solana config set -ud

#extra voor nfts zoals npm enzo
# Install NVM, Node.js (LTS), and npm packages
#RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash && \
#    export NVM_DIR="$HOME/.nvm" && \
#    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
#    nvm install --lts && \
#    npm install -g typescript @solana/web3.js@1 esrun \
#    && npm install -g @metaplex-foundation/umi @metaplex-foundation/mpl-token-metadata @metaplex-foundation/umi-bubblegum bs58

# Installeer Node.js (LTS) en npm
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs

# Installeer benodigde globale npm packages
RUN npm install -g \
    typescript \
    @solana/web3.js@1 \
    esrun \
    @metaplex-foundation/umi \
    @metaplex-foundation/mpl-bubblegum \
    @metaplex-foundation/mpl-token-metadata \
    bs58


# Set working directory
WORKDIR /solana-nft-data

# Default command to run a shell
CMD ["/bin/bash"]

```
To save the `Dockerfile` press `ctrl+x` to exit and then press `y` and `Enter` to save

Second, build a docker image with this `Dockerfile`. Run this:
```
docker build -t createtokensandnfts .
```
To build the image. 

*you can change the "createtokensandnfts" to something you like*
