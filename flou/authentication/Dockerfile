FROM openjdk:21
COPY ./build/libs/authentication-1.0.0.jar app.jar
ENTRYPOINT java -Dspring.profiles.active=production -jar app.jar
