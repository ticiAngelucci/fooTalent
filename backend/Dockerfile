FROM maven:3.8.6-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY . .
RUN mvn clean package -DskipTests -Dproject.build.sourceEncoding=UTF-8

FROM eclipse-temurin:17-jre-alpine
VOLUME /tmp
RUN apk add --no-cache curl
COPY --from=build /workspace/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]