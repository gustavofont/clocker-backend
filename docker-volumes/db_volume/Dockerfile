# Use the official MySQL image as a base
FROM mysql:latest

COPY ./db/ /docker-entrypoint-initdb.d/

ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=clocker
ENV MYSQL_USER=clocker
ENV MYSQL_PASSWORD=password


# Expose port 3306 to allow connections to the database
EXPOSE 3306

# Start the MySQL server when the container is running
CMD ["mysqld"]