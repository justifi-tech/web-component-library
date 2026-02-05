FROM oven/bun:1

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json bun.lockb* pnpm-lock.yaml* ./
COPY packages/webcomponents/package.json ./packages/webcomponents/
COPY apps/component-examples/package.json ./apps/component-examples/
COPY apps/docs/package.json ./apps/docs/

# Copy entire monorepo
COPY . .

# Remove pnpm-only preinstall script to allow Bun
RUN sed -i '/"preinstall":/d' package.json apps/component-examples/package.json || true

# Hardcoded environment variables for POC
ENV IFRAME_ORIGIN=https://components.justifi-staging.com
ENV PROXY_API_ORIGIN=https://wc-proxy.justifi-staging.com
ENV PORT=3000
ENV API_ORIGIN=https://api.justifi-staging.com
ENV DISPUTE_ID=dp_2QjAGbou7enGsbkXASrjsG
ENV PAYMENT_METHOD_GROUP_ID=pmg_YWhexU47Zd6qJb9c9k9OL
ENV CLIENT_ID=test_eohVQllq0mJy34T14dsZJlHjXKr7rKyH
ENV CLIENT_SECRET=test_OZK_PtLPuTS6NM2X9aX9qI6FQpxhuWaCBMWGPpJw0Y3haKiOi-5GECGMNRQ-d22Z
ENV ACCOUNT_ID=acc_75j5yGxQUf69B9vT2hDUn9
ENV SUB_ACCOUNT_ID=acc_323sM3WDAUnHH0fJD7re9h
ENV BUSINESS_ID=biz_3I7g7AZ3jrAPNNOg3TmcLd
ENV PAYMENT_ID=py_1waAZJ5jPb4faa863gavCi
ENV PAYOUT_ID=po_2fhnHy3y2lqp3RfCrZMmpl

# Install dependencies with Bun (faster than pnpm)
RUN bun install

# Build webcomponents package
RUN cd packages/webcomponents && bun run build

# Expose port
EXPOSE 3000

# Start checkout component server
CMD ["bun", "run", "--cwd", "apps/component-examples", "start:checkout"]
