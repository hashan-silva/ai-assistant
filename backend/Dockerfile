# Builder image
FROM amazoncorretto:21-alpine AS build
WORKDIR /app
RUN apk add --no-cache maven
COPY pom.xml .
RUN mvn -ntp -B -DskipTests package
COPY src ./src
RUN mvn -ntp -B package -DskipTests

# Runtime image
FROM amazoncorretto:21-alpine
ENV JAVA_OPTS=""
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN addgroup --system app && adduser --system --ingroup app app \
    && chown -R app:app /app
USER app
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
