FROM minustime/phantomjs:latest

MAINTAINER vic@minustime.com

# Update OS, install base packages
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       ca-certificates \
       build-essential \
       git \
       curl \
       htop \
       vim \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_VERSION 6.9.1

# Install Node  & Yarn
RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
    && tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components 1 \
    && npm install --global yarn \
    && rm "node-v$NODE_VERSION-linux-x64.tar.gz"

ENV WORKDIR /opt/slackbot
ENV BUILDIR /tmp/slackbot
ENV PATH="$WORKDIR/node_modules/.bin:$PATH"

WORKDIR $WORKDIR

# Build the dependencies
COPY package.json $BUILDIR/
RUN cd $BUILDIR \
    && yarn install

# Build the project
COPY tsconfig.json $BUILDIR/
COPY src $BUILDIR/src
RUN cd $BUILDIR \
    && yarn run build \
    && mv node_modules dist $WORKDIR/ \
    && rm -rf $BUILDIR

ENTRYPOINT ["/usr/local/bin/node", "/opt/slackbot/dist/index.js"]