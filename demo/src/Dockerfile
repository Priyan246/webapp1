# --- Stage 1: Build the Application ---
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copy only the necessary files for the build
COPY . .

# Build the app (skipping tests to speed it up)
RUN mvn clean package -DskipTests

# --- Stage 2: Run the Application ---
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy the built JAR file from the 'build' stage
# Make sure the jar name matches. Spring Boot usually creates app-0.0.1-SNAPSHOT.jar
# The *.jar wildcard grabs whatever jar was built.
COPY --from=build /app/target/*.jar app.jar

# Expose the port (Render usually uses 8080 by default but can be configured)
EXPOSE 8080

# Command to run the app
ENTRYPOINT ["java", "-jar", "app.jar"]