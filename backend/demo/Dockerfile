# Stage 1: Build stage
FROM gradle:8.14-jdk17 AS build

WORKDIR /app

# Copy Gradle wrapper and build files first for better caching
COPY gradle gradle
COPY gradlew gradlew.bat build.gradle settings.gradle ./

# Download dependencies (cached if build files don't change)
RUN gradle dependencies --no-daemon

# Copy source code
COPY src src

# Build the application
RUN gradle bootJar --no-daemon

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy the built jar from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# JVM options for container environment
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
