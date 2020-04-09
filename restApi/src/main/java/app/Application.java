package app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@SpringBootApplication
@EnableWebSocketMessageBroker
public class Application {
    public static void main(String[] args) throws RuntimeException {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public WebSocketMessageBrokerConfigurer webSocketMessageBrokerConfigurer() {
        return new WebSocketMessageBrokerConfigurer() {
            @Override
            public void configureMessageBroker(MessageBrokerRegistry config) {
                config.enableSimpleBroker("/topic");
                config.setApplicationDestinationPrefixes("/app");
            }

            @Override
            public void registerStompEndpoints(StompEndpointRegistry registry) {
                registry.addEndpoint("/websocket").setAllowedOrigins("*");
            }
        };
    }
}
