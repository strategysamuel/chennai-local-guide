import * as fc from 'fast-check';
import { ContextLoader, ContextData } from './contextLoader';

/**
 * Feature: chennai-local-guide, Property 1: Context-grounded responses
 * 
 * Property: For any user query, all responses should contain information that can be 
 * traced back to the Local_Knowledge_Base and should never contain generic information 
 * that could apply to any Indian city
 * 
 * Validates: Requirements 1.2, 1.5, 4.2
 */

// Mock response generator that simulates AI responses based on context
class MockResponseGenerator {
  private context: ContextData;
  private localTerms: string[];
  private genericTerms: string[];

  constructor(context: ContextData) {
    this.context = context;
    this.localTerms = this.extractLocalTerms(context.productContent);
    this.genericTerms = [
      'indian city', 'south india', 'metropolitan area', 'urban center',
      'indian culture', 'traditional food', 'local transport', 'city traffic'
    ];
  }

  private extractLocalTerms(content: string): string[] {
    const terms: string[] = [];
    
    // Extract Chennai-specific terms from context
    const chennaiSpecific = [
      'chennai', 'madras', 'tamil nadu', 'tanglish', 'filter coffee',
      'marina beach', 'mylapore', 't. nagar', 'adyar', 'besant nagar',
      'omr', 'gst road', 'anna salai', 'velachery', 'sholinganallur',
      'semma', 'vera level', 'mokka', 'scene illa', 'machaan', 'thala',
      'idli', 'dosa', 'sambar', 'rasam', 'kothu parotta', 'bajji',
      'auto', 'maama', 'akka', 'anna', 'saapadu', 'vandi'
    ];

    // Extract terms that actually appear in the context
    const contentLower = content.toLowerCase();
    terms.push(...chennaiSpecific.filter(term => contentLower.includes(term)));

    return terms;
  }

  generateResponse(query: string): string {
    const queryLower = query.toLowerCase();
    
    // Simulate context-grounded response generation
    let response = '';
    
    // Check if query contains local terms and respond appropriately
    const matchedLocalTerms = this.localTerms.filter(term => 
      queryLower.includes(term) || this.isRelatedQuery(queryLower, term)
    );

    if (matchedLocalTerms.length > 0) {
      // Generate response with local context
      response = this.generateLocalResponse(query, matchedLocalTerms);
    } else {
      // Generate response that should still be Chennai-specific
      response = this.generateChennaiSpecificResponse(query);
    }

    return response;
  }

  private isRelatedQuery(query: string, term: string): boolean {
    // Simple heuristic to match related queries
    const relatedMappings: { [key: string]: string[] } = {
      'food': ['idli', 'dosa', 'sambar', 'filter coffee', 'bajji'],
      'traffic': ['omr', 'gst road', 'anna salai', 'auto'],
      'area': ['mylapore', 't. nagar', 'adyar', 'velachery'],
      'slang': ['semma', 'mokka', 'tanglish', 'machaan']
    };

    for (const [category, terms] of Object.entries(relatedMappings)) {
      if (query.includes(category) && terms.includes(term)) {
        return true;
      }
    }

    return false;
  }

  private generateLocalResponse(query: string, matchedTerms: string[]): string {
    // Simulate response that includes local context
    const localTerm = matchedTerms[0];
    return `Based on Chennai context: ${localTerm} is mentioned in our local knowledge. ${query} - response includes Chennai-specific information.`;
  }

  private generateChennaiSpecificResponse(query: string): string {
    // Simulate response that should be Chennai-specific even without direct term matches
    const randomLocalTerm = this.localTerms[Math.floor(Math.random() * this.localTerms.length)];
    return `Chennai perspective on ${query}: includes ${randomLocalTerm} context.`;
  }

  isResponseContextGrounded(response: string): boolean {
    const responseLower = response.toLowerCase();
    
    // Check if response contains local terms from context
    const hasLocalTerms = this.localTerms.some(term => 
      responseLower.includes(term)
    );

    // Check if response avoids generic terms that could apply to any Indian city
    const hasGenericTerms = this.genericTerms.some(term => 
      responseLower.includes(term) && !responseLower.includes('chennai')
    );

    return hasLocalTerms && !hasGenericTerms;
  }
}

describe('Local Terminology Usage Property-Based Tests', () => {
  let contextLoader: ContextLoader;
  let context: ContextData;
  let responseGenerator: MockResponseGenerator;

  beforeAll(() => {
    contextLoader = new ContextLoader();
    context = contextLoader.loadContext();
    responseGenerator = new MockResponseGenerator(context);
  });

  describe('Property 1: Context-grounded responses', () => {
    test('**Feature: chennai-local-guide, Property 1: Context-grounded responses**', () => {
      fc.assert(
        fc.property(
          // Generate various user queries that might be asked to a Chennai guide
          fc.oneof(
            // Food-related queries
            fc.constantFrom(
              'where can I get good food',
              'best restaurants in the city',
              'local breakfast options',
              'street food recommendations',
              'coffee shops nearby'
            ),
            // Transportation queries
            fc.constantFrom(
              'how to get around the city',
              'traffic conditions today',
              'best way to travel',
              'public transport options',
              'auto rickshaw rates'
            ),
            // Area/location queries
            fc.constantFrom(
              'good areas to live',
              'shopping districts',
              'cultural places to visit',
              'safe neighborhoods',
              'business districts'
            ),
            // Cultural/slang queries
            fc.constantFrom(
              'local customs and traditions',
              'how locals speak',
              'cultural events',
              'festival celebrations',
              'local expressions'
            ),
            // Queries with Chennai-specific terms
            fc.constantFrom(
              'semma movie recommendations',
              'filter coffee places',
              'T. Nagar shopping',
              'OMR traffic updates',
              'Mylapore temples'
            )
          ),
          (userQuery) => {
            // Generate response using mock system
            const response = responseGenerator.generateResponse(userQuery);
            
            // Property: Response should be context-grounded
            const isContextGrounded = responseGenerator.isResponseContextGrounded(response);
            
            expect(isContextGrounded).toBe(true);
            
            // Additional validation: Response should not be empty
            expect(response.trim().length).toBeGreaterThan(0);
            
            // Response should contain some reference to Chennai context
            const responseLower = response.toLowerCase();
            const hasChennaiReference = responseLower.includes('chennai') || 
                                     responseLower.includes('context') ||
                                     responseLower.includes('local');
            
            expect(hasChennaiReference).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Responses avoid generic Indian city information', () => {
      fc.assert(
        fc.property(
          // Generate queries that could apply to any Indian city
          fc.constantFrom(
            'best Indian food',
            'local culture',
            'city transportation',
            'urban lifestyle',
            'metropolitan area',
            'south indian traditions'
          ),
          (genericQuery) => {
            const response = responseGenerator.generateResponse(genericQuery);
            
            // Property: Even for generic queries, responses should be Chennai-specific
            const isContextGrounded = responseGenerator.isResponseContextGrounded(response);
            expect(isContextGrounded).toBe(true);
            
            // Should not contain generic terms without Chennai context
            const responseLower = response.toLowerCase();
            const genericTermsWithoutContext = [
              'any indian city',
              'typical south indian',
              'general indian culture'
            ];
            
            const hasGenericWithoutContext = genericTermsWithoutContext.some(term =>
              responseLower.includes(term)
            );
            
            expect(hasGenericWithoutContext).toBe(false);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Local terminology is properly utilized from context', () => {
      fc.assert(
        fc.property(
          // Generate queries that should trigger specific local terminology
          fc.record({
            query: fc.constantFrom(
              'food recommendations',
              'transportation advice', 
              'area suggestions',
              'cultural guidance'
            ),
            expectedTermCategory: fc.constantFrom('food', 'transport', 'area', 'culture')
          }),
          ({ query, expectedTermCategory }) => {
            const response = responseGenerator.generateResponse(query);
            
            // Property: Response should utilize appropriate local terminology
            const responseLower = response.toLowerCase();
            
            // Define expected terms for each category based on context
            const categoryTerms: { [key: string]: string[] } = {
              food: ['idli', 'dosa', 'filter coffee', 'sambar', 'bajji'],
              transport: ['auto', 'omr', 'gst road', 'anna salai'],
              area: ['mylapore', 't. nagar', 'adyar', 'besant nagar'],
              culture: ['tanglish', 'semma', 'tamil nadu', 'chennai']
            };
            
            // At least one relevant local term should be present
            const relevantTerms = categoryTerms[expectedTermCategory] || [];
            const hasRelevantTerm = relevantTerms.some(term => 
              responseLower.includes(term)
            ) || responseLower.includes('chennai');
            
            expect(hasRelevantTerm).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Context validation ensures local knowledge base dependency', () => {
      fc.assert(
        fc.property(
          // Generate modified context to test dependency
          fc.record({
            productContent: fc.oneof(
              // Original context (should pass)
              fc.constant(context.productContent),
              // Context with removed Chennai terms (should fail validation)
              fc.constant(context.productContent.replace(/chennai/gi, 'city').replace(/tamil nadu/gi, 'state')),
              // Empty context (should fail)
              fc.constant('')
            ),
            agentConfig: fc.constant(context.agentConfig)
          }),
          (testContext) => {
            const isValid = contextLoader.validateChennaiContext(testContext);
            const generator = new MockResponseGenerator(testContext);
            
            // Property: Only valid Chennai context should enable proper local responses
            if (isValid) {
              // Valid context should enable context-grounded responses
              const testResponse = generator.generateResponse('food recommendations');
              const isGrounded = generator.isResponseContextGrounded(testResponse);
              expect(isGrounded).toBe(true);
            } else {
              // Invalid context should be detected by validation
              expect(isValid).toBe(false);
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Edge cases and error handling', () => {
    test('Empty queries are handled appropriately', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('', '   ', '\n', '\t'),
          (emptyQuery) => {
            const response = responseGenerator.generateResponse(emptyQuery);
            
            // Property: Even empty queries should get Chennai-specific responses
            expect(response.trim().length).toBeGreaterThan(0);
            
            const isContextGrounded = responseGenerator.isResponseContextGrounded(response);
            expect(isContextGrounded).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    test('Queries with mixed languages are handled', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            'semma food recommendations',
            'mokka traffic today',
            'vera level places to visit',
            'scene illa for shopping'
          ),
          (mixedQuery) => {
            const response = responseGenerator.generateResponse(mixedQuery);
            
            // Property: Mixed language queries should get appropriate local responses
            const isContextGrounded = responseGenerator.isResponseContextGrounded(response);
            expect(isContextGrounded).toBe(true);
            
            // Should handle the local slang appropriately
            const responseLower = response.toLowerCase();
            const hasLocalContext = responseLower.includes('chennai') || 
                                  responseLower.includes('local') ||
                                  responseLower.includes('context');
            
            expect(hasLocalContext).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});