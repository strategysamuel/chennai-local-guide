# Chennai Local Guide

A context-aware AI assistant that behaves like a knowledgeable Chennai local, providing culturally grounded responses about the city.

## Problem Statement

Generic AI assistants lack the cultural nuance and local knowledge needed to provide authentic guidance about specific cities. When visitors or residents ask about Chennai, they often receive generic responses that could apply to any Indian city, missing the unique cultural context, local slang, neighborhood characteristics, and practical insights that make Chennai special.

## Solution

The Chennai Local Guide transforms a generic AI into a specialized local assistant through custom context files that encode deep Chennai-specific knowledge. By leveraging Kiro's context system, the AI learns to:

- Understand and respond to Chennai slang and Tanglish expressions
- Provide area-specific food recommendations with cultural context
- Give traffic and transportation advice based on real Chennai conditions
- Share neighborhood insights from a local's perspective
- Maintain the friendly, helpful tone characteristic of Chennai residents

## How It Works

### Context-Driven Architecture

The system uses three key components:

1. **Local Knowledge Base** (`.kiro/product.md`)
   - Comprehensive Chennai-specific information
   - Slang dictionary with cultural context
   - Area-specific food recommendations
   - Traffic patterns and transportation insights
   - Neighborhood characteristics and local perspectives

2. **AI Behavioral Configuration** (`.kiro/agent.yaml`)
   - Personality settings for authentic local interaction
   - Response guidelines ensuring Chennai-specific context
   - Cultural sensitivity rules and language handling
   - Topic-specific expertise areas

3. **Documentation Suite**
   - Project overview and technical approach
   - Application guide explaining capabilities
   - Demonstration examples showcasing local knowledge

### Key Features

- **Slang Interpretation**: Understands Tanglish phrases like "semma", "vera level", "scene illa"
- **Area-Specific Recommendations**: Knows that T. Nagar is for shopping, Mylapore for culture, OMR for IT
- **Traffic-Aware Advice**: Factors in Chennai's notorious traffic patterns and peak hours
- **Cultural Authenticity**: Maintains respectful local communication style with appropriate use of "sir/madam"
- **Practical Insights**: Provides actionable advice based on real local conditions

## Project Structure

```
├── .kiro/
│   ├── product.md          # Comprehensive Chennai knowledge base
│   ├── agent.yaml          # AI personality and behavior configuration
│   └── specs/              # Development specifications
├── src/                    # Source code and tests
├── README.md              # This file
├── app.md                 # Application guide
└── demo.md                # Example interactions
```

## Getting Started

1. **Explore the Context Files**
   - Review `.kiro/product.md` to understand the local knowledge base
   - Check `.kiro/agent.yaml` for personality configuration

2. **Try the Examples**
   - See `demo.md` for realistic interaction examples
   - Test various scenarios: food, traffic, slang, cultural questions

3. **Understand the Approach**
   - Read `app.md` for detailed explanation of capabilities
   - Learn how context files enable location-specific AI behavior

## Example Interactions

**Slang Understanding:**
- User: "That movie was semma!"
- AI: "Ah, semma! That means it was excellent, right? Which movie did you watch? If it's a Tamil film, I'd love to hear about it!"

**Food Recommendations:**
- User: "Where can I get good street food in T. Nagar?"
- AI: "T. Nagar is perfect for street food! Head to Pondy Bazaar area - you'll find amazing bajjis, especially during evening time. The area near Ranganathan Street has great chaat stalls too."

**Traffic Advice:**
- User: "How long to get from Velachery to OMR during morning?"
- AI: "Aiyo, morning time from Velachery to OMR? Plan at least 45 minutes to 1 hour, sir. The IT crowd traffic is heavy between 8-10 AM. Better to leave by 7:30 AM if possible!"

## Technical Approach

This project demonstrates how custom context can make AI assistants culturally aware and practically useful for specific geographic regions. The approach is:

1. **Knowledge Encoding**: Structured local information in markdown format
2. **Behavioral Configuration**: YAML-based personality and response rules
3. **Context Integration**: Seamless application of local knowledge in responses
4. **Cultural Authenticity**: Maintaining genuine local communication patterns

## Requirements Addressed

- **Local Slang Understanding**: Interprets Chennai/Tanglish expressions correctly
- **Area-Specific Recommendations**: Provides geographically appropriate suggestions
- **Cultural Authenticity**: Maintains genuine Chennai local communication style
- **Traffic Awareness**: Factors in real Chennai traffic patterns and conditions
- **Context Dependency**: All responses grounded in local knowledge base

## Development

The project follows a specification-driven development approach with:
- Detailed requirements analysis using EARS methodology
- Comprehensive design document with correctness properties
- Property-based testing for behavioral validation
- Incremental implementation with continuous testing

## Contributing

This project serves as a demonstration of context-aware AI development. The approach can be adapted for other cities or regions by:
1. Creating location-specific knowledge bases
2. Adapting personality configurations for local communication styles
3. Implementing appropriate testing strategies for cultural authenticity

## License

This project is developed as part of a technical demonstration showcasing context-aware AI capabilities.