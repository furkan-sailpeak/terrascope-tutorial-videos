FROM nginx:1.27-alpine

# Static site
WORKDIR /usr/share/nginx/html
COPY . .

# Nginx config (templated so we can listen on Railway's $PORT)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Railway sets $PORT at runtime; default to 8080 locally
ENV PORT=8080

EXPOSE 8080

# nginx:alpine entrypoint already runs `envsubst` over /etc/nginx/templates
# and writes the result to /etc/nginx/conf.d/, so $PORT gets substituted.
CMD ["nginx", "-g", "daemon off;"]
