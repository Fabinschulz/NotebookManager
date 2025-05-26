FROM node:24-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci
 
FROM node:24-alpine AS builder
WORKDIR /app
 
COPY --from=deps /app/node_modules ./node_modules
COPY . .
 
RUN npm run build
 
FROM node:24-alpine AS runner
WORKDIR /app
 
# Copia apenas arquivos essenciais pro runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
 
ENV NODE_ENV=production
 
EXPOSE 3000
 
CMD ["npm", "run", "start"]
 
# Healthcheck para verificar se o servidor está funcionando
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
CMD curl --fail http://localhost:3000 || exit 1