FROM postgres:17-alpine

ENV POSTGRES_DB=foodsaver
ENV POSTGRES_USER=foodsaver_user
ENV POSTGRES_PASSWORD=foodsaver_pass

EXPOSE 5433

HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1
