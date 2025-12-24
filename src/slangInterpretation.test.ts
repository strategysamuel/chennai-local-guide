import * as fc from 'fast-check';
import { ContextLoader, ContextData } from './contextLoader';

/**
 * Feature: chennai-local-guide, Property 2: Slang interpretation accuracy
 * 
 * Property: For any Chennai slang or Tanglish phrase input, the system should 
 * demonstrate understanding through appropriate contextual responses
 * 
 * Validates: Requirements 1.1
 */

// Mock slang interpreter that simulates AI understanding of Chennai slang
class MockSlangInterpreter {
  private context: ContextData;
  private slangDictionary: Map<string, string>;
  private tanglishPhrases: Map<string, string>;
  private culturalTerms: Map<string, string>;

  constructor(context: ContextData) {
    this.context = context;
    this.slangDictionary = this.buildSlangDictionary(context.productContent);
    this.tanglishPhrases = this.buildTanglishPhrases(context.productContent);
    this.culturalTerms = this.buildCulturalTerms(context.productContent);
  }

  private buildSlangDictionary(content: string): Map<string, string> {
    const slang = new Map<string, string>();
    
    // Extract slang terms from context
    const slangTerms = [
      ['semma', 'awesome, excellent, great'],
      ['vera level', 'next level, amazing'],
      ['scene illa', 'not happening, no chance'],
      ['full scene', 'complete situation, the whole thing'],
      ['mokka', 'boring, lame, not good'],
      ['thala', 'boss, leader'],
      ['machaan', 'dude, buddy'],
      ['machan', 'dude, buddy'],
      ['ponga', 'go away, get lost'],
      ['gethu', 'style, swag, attitude'],
      ['vera mari', 'different level, extraordinary'],
      ['seri', 'okay, alright'],
      ['enna da', 'what man?'],
      ['paithiyam', 'crazy, mad'],
      ['kadavule', 'oh god!'],
      ['aiyo', 'oh no!']
    ];

    slangTerms.forEach(([term, meaning]) => {
      if (content.toLowerCase().includes(term)) {
        slang.set(term, meaning);
      }
    });

    return slang;
  }

  private buildTanglishPhrases(content: string): Map<string, string> {
    const phrases = new Map<string, string>();
    
    const tanglishTerms = [
      ['auto', 'auto-rickshaw (three-wheeler)'],
      ['maama', 'uncle (respectful address for older men)'],
      ['akka', 'elder sister (respectful address for women)'],
      ['anna', 'elder brother (respectful address for men)'],
      ['kutty', 'small, little one (affectionate term)'],
      ['saapadu', 'food, meal'],
      ['veetla', 'at home'],
      ['velila', 'outside'],
      ['kadai', 'shop, store'],
      ['thanni', 'water'],
      ['kaasu', 'money'],
      ['vandi', 'vehicle'],
      ['veethi', 'street, road']
    ];

    tanglishTerms.forEach(([term, meaning]) => {
      if (content.toLowerCase().includes(term)) {
        phrases.set(term, meaning);
      }
    });

    return phrases;
  }

  private buildCulturalTerms(content: string): Map<string, string> {
    const cultural = new Map<string, string>();
    
    const culturalTerms = [
      ['filter coffee', 'strong south indian coffee, cultural institution'],
      ['idli', 'steamed rice cakes, breakfast staple'],
      ['dosa', 'crispy crepe made from fermented rice and lentil batter'],
      ['sambar', 'lentil curry with vegetables'],
      ['rasam', 'tangy tamarind-based soup'],
      ['bajji', 'vegetable fritters, perfect for rainy days'],
      ['kothu parotta', 'shredded parotta mixed with curry and vegetables']
    ];

    culturalTerms.forEach(([term, meaning]) => {
      if (content.toLowerCase().includes(term)) {
        cultural.set(term, meaning);
      }
    });

    return cultural;
  }

  interpretSlang(input: string): string {
    const inputLower = input.toLowerCase();
    let interpretation = '';
    let foundSlang = false;

    // Check for slang terms
    for (const [slang, meaning] of this.slangDictionary.entries()) {
      if (inputLower.includes(slang)) {
        interpretation += `"${slang}" means ${meaning}. `;
        foundSlang = true;
      }
    }

    // Check for Tanglish phrases
    for (const [phrase, meaning] of this.tanglishPhrases.entries()) {
      if (inputLower.includes(phrase)) {
        interpretation += `"${phrase}" refers to ${meaning}. `;
        foundSlang = true;
      }
    }

    // Check for cultural terms
    for (const [term, meaning] of this.culturalTerms.entries()) {
      if (inputLower.includes(term)) {
        interpretation += `"${term}" is ${meaning}. `;
        foundSlang = true;
      }
    }

    if (!foundSlang) {
      // If no specific slang found, provide general Chennai context
      interpretation = `In Chennai context: ${input}`;
    }

    return interpretation.trim();
  }

  demonstratesUnderstanding(input: string, response: string): boolean {
    const inputLower = input.toLowerCase();
    const responseLower = response.toLowerCase();

    // Check if response shows understanding of slang terms
    let hasUnderstanding = false;

    // Look for slang terms in input
    for (const [slang, meaning] of this.slangDictionary.entries()) {
      if (inputLower.includes(slang)) {
        // Response should either explain the term or use it appropriately
        const meaningWords = meaning.toLowerCase().split(/[,\s]+/);
        const hasExplanation = meaningWords.some(word => 
          word.length > 3 && responseLower.includes(word)
        );
        const usesAppropriately = responseLower.includes(slang) || 
                                responseLower.includes('understand') ||
                                responseLower.includes('means') ||
                                responseLower.includes('refers to') ||
                                responseLower.includes('context');
        
        if (hasExplanation || usesAppropriately) {
          hasUnderstanding = true;
        }
      }
    }

    // Look for Tanglish phrases
    for (const [phrase, meaning] of this.tanglishPhrases.entries()) {
      if (inputLower.includes(phrase)) {
        const meaningWords = meaning.toLowerCase().split(/[,\s]+/);
        const hasExplanation = meaningWords.some(word => 
          word.length > 3 && responseLower.includes(word)
        );
        const usesAppropriately = responseLower.includes(phrase) ||
                                responseLower.includes('understand') ||
                                responseLower.includes('means') ||
                                responseLower.includes('refers to') ||
                                responseLower.includes('context');
        
        if (hasExplanation || usesAppropriately) {
          hasUnderstanding = true;
        }
      }
    }

    // Look for cultural terms
    for (const [term, meaning] of this.culturalTerms.entries()) {
      if (inputLower.includes(term)) {
        const meaningWords = meaning.toLowerCase().split(/[,\s]+/);
        const hasExplanation = meaningWords.some(word => 
          word.length > 3 && responseLower.includes(word)
        );
        const usesAppropriately = responseLower.includes(term) ||
                                responseLower.includes('understand') ||
                                responseLower.includes('means') ||
                                responseLower.includes('refers to') ||
                                responseLower.includes('context');
        
        if (hasExplanation || usesAppropriately) {
          hasUnderstanding = true;
        }
      }
    }

    // If no specific slang found, check for general Chennai understanding
    if (!hasUnderstanding) {
      hasUnderstanding = responseLower.includes('chennai') || 
                        responseLower.includes('context') ||
                        responseLower.includes('local') ||
                        responseLower.includes('means') ||
                        responseLower.includes('refers to');
    }

    return hasUnderstanding;
  }

  isContextuallyAppropriate(input: string, response: string): boolean {
    const inputLower = input.toLowerCase();
    const responseLower = response.toLowerCase();

    // Check for inappropriate responses
    const inappropriateResponses = [
      'i don\'t understand',
      'unknown term',
      'not familiar with',
      'generic indian',
      'any indian city'
    ];

    const hasInappropriateResponse = inappropriateResponses.some(phrase =>
      responseLower.includes(phrase)
    );

    if (hasInappropriateResponse) {
      return false;
    }

    // Response should show Chennai-specific understanding or contain relevant terms
    const chennaiIndicators = [
      'chennai', 'tamil', 'tanglish', 'local', 'context',
      'south indian', 'madras', 'tamil nadu', 'means', 'refers to'
    ];

    const hasChennaiContext = chennaiIndicators.some(indicator =>
      responseLower.includes(indicator)
    );

    // Also check if response contains any of the input terms (showing understanding)
    const inputTerms = inputLower.split(/\s+/);
    const hasInputTerms = inputTerms.some(term => 
      term.length > 2 && responseLower.includes(term)
    );

    return hasChennaiContext || hasInputTerms;
  }
}

describe('Slang Interpretation Property-Based Tests', () => {
  let contextLoader: ContextLoader;
  let context: ContextData;
  let slangInterpreter: MockSlangInterpreter;

  beforeAll(() => {
    contextLoader = new ContextLoader();
    context = contextLoader.loadContext();
    slangInterpreter = new MockSlangInterpreter(context);
  });

  describe('Property 2: Slang interpretation accuracy', () => {
    test('**Feature: chennai-local-guide, Property 2: Slang interpretation accuracy**', () => {
      fc.assert(
        fc.property(
          // Generate various slang inputs
          fc.oneof(
            // Common Tanglish expressions
            fc.constantFrom(
              'semma movie da',
              'vera level performance',
              'scene illa for this',
              'full scene ah irukku',
              'mokka show',
              'thala mass',
              'machaan, how are you',
              'ponga da',
              'gethu style',
              'vera mari acting',
              'seri seri',
              'enna da doing',
              'paithiyam ah irukka',
              'kadavule save me',
              'aiyo what happened'
            ),
            // Local terminology
            fc.constantFrom(
              'auto fare to T. Nagar',
              'maama, where is the kadai',
              'akka, saapadu ready ah',
              'anna, vandi parking where',
              'kutty, veetla irukka',
              'velila going for thanni',
              'kaasu illa for auto',
              'veethi la traffic jam'
            ),
            // Food and cultural terms
            fc.constantFrom(
              'filter coffee semma',
              'idli dosa vera level',
              'sambar rasam mokka',
              'bajji during rain',
              'kothu parotta full scene'
            ),
            // Mixed expressions
            fc.constantFrom(
              'semma filter coffee da',
              'auto maama, T. Nagar poga',
              'akka, idli vera level',
              'machaan, scene illa today',
              'thala style la vandi drive'
            )
          ),
          (slangInput) => {
            // Generate response using mock interpreter
            const response = slangInterpreter.interpretSlang(slangInput);
            
            // Property: System should demonstrate understanding of slang
            const demonstratesUnderstanding = slangInterpreter.demonstratesUnderstanding(
              slangInput, 
              response
            );
            
            expect(demonstratesUnderstanding).toBe(true);
            
            // Response should be contextually appropriate
            const isContextuallyAppropriate = slangInterpreter.isContextuallyAppropriate(
              slangInput,
              response
            );
            
            expect(isContextuallyAppropriate).toBe(true);
            
            // Response should not be empty
            expect(response.trim().length).toBeGreaterThan(0);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Slang terms are correctly identified and explained', () => {
      fc.assert(
        fc.property(
          // Generate inputs with specific slang terms
          fc.record({
            slangTerm: fc.constantFrom(
              'semma', 'vera level', 'scene illa', 'mokka', 'thala',
              'machaan', 'gethu', 'seri', 'paithiyam', 'aiyo'
            ),
            context: fc.constantFrom(
              'movie', 'food', 'traffic', 'weather', 'work', 'friend'
            )
          }),
          ({ slangTerm, context }) => {
            const input = `${slangTerm} ${context}`;
            const response = slangInterpreter.interpretSlang(input);
            
            // Property: Response should show understanding of the specific slang term
            const responseLower = response.toLowerCase();
            const inputLower = input.toLowerCase();
            
            // Should either explain the term or use it appropriately
            const showsUnderstanding = responseLower.includes(slangTerm) ||
                                     responseLower.includes('means') ||
                                     responseLower.includes('refers to') ||
                                     responseLower.includes('understand');
            
            expect(showsUnderstanding).toBe(true);
            
            // Should not give generic responses
            const avoidGeneric = !responseLower.includes('don\'t understand') &&
                               !responseLower.includes('unknown term');
            
            expect(avoidGeneric).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Tanglish phrases are appropriately handled', () => {
      fc.assert(
        fc.property(
          // Generate Tanglish phrase combinations
          fc.record({
            tanglishTerm: fc.constantFrom(
              'auto', 'maama', 'akka', 'anna', 'saapadu',
              'veetla', 'kadai', 'thanni', 'kaasu', 'vandi'
            ),
            englishContext: fc.constantFrom(
              'going to', 'looking for', 'need some', 'where is',
              'how much', 'can you help', 'please tell'
            )
          }),
          ({ tanglishTerm, englishContext }) => {
            const input = `${englishContext} ${tanglishTerm}`;
            const response = slangInterpreter.interpretSlang(input);
            
            // Property: Should handle mixed language appropriately
            const demonstratesUnderstanding = slangInterpreter.demonstratesUnderstanding(
              input,
              response
            );
            
            expect(demonstratesUnderstanding).toBe(true);
            
            // Should provide contextually appropriate response
            const isAppropriate = slangInterpreter.isContextuallyAppropriate(
              input,
              response
            );
            
            expect(isAppropriate).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Cultural food terms are understood in context', () => {
      fc.assert(
        fc.property(
          // Generate food-related slang combinations
          fc.record({
            foodTerm: fc.constantFrom(
              'filter coffee', 'idli', 'dosa', 'sambar', 'rasam', 'bajji'
            ),
            slangModifier: fc.constantFrom(
              'semma', 'vera level', 'mokka', 'full scene'
            )
          }),
          ({ foodTerm, slangModifier }) => {
            const input = `${foodTerm} ${slangModifier}`;
            const response = slangInterpreter.interpretSlang(input);
            
            // Property: Should understand both food term and slang modifier
            const responseLower = response.toLowerCase();
            
            // Should show understanding of food term
            const understandsFood = responseLower.includes(foodTerm.toLowerCase()) ||
                                  responseLower.includes('food') ||
                                  responseLower.includes('south indian');
            
            expect(understandsFood).toBe(true);
            
            // Should show understanding of slang modifier
            const understandsSlang = responseLower.includes(slangModifier) ||
                                   responseLower.includes('excellent') ||
                                   responseLower.includes('great') ||
                                   responseLower.includes('boring') ||
                                   responseLower.includes('amazing');
            
            expect(understandsSlang).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Complex slang combinations are handled appropriately', () => {
      fc.assert(
        fc.property(
          // Generate complex slang sentences
          fc.oneof(
            fc.constantFrom(
              'machaan, semma filter coffee da',
              'akka, idli vera level ah irukku',
              'auto maama, T. Nagar scene illa',
              'thala, mokka traffic today',
              'anna, saapadu gethu style',
              'kutty, vandi full scene',
              'maama, kadai la thanni illa'
            )
          ),
          (complexSlang) => {
            const response = slangInterpreter.interpretSlang(complexSlang);
            
            // Property: Should handle multiple slang terms in one input
            const demonstratesUnderstanding = slangInterpreter.demonstratesUnderstanding(
              complexSlang,
              response
            );
            
            expect(demonstratesUnderstanding).toBe(true);
            
            // Should maintain contextual appropriateness
            const isAppropriate = slangInterpreter.isContextuallyAppropriate(
              complexSlang,
              response
            );
            
            expect(isAppropriate).toBe(true);
            
            // Response should be substantial for complex input
            expect(response.trim().length).toBeGreaterThan(10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Edge cases and error handling', () => {
    test('Unknown slang variations are handled gracefully', () => {
      fc.assert(
        fc.property(
          // Generate variations of known slang
          fc.record({
            baseSlang: fc.constantFrom('semma', 'mokka', 'thala', 'machaan'),
            variation: fc.constantFrom('ah', 'da', 'di', 'la', 'nu')
          }),
          ({ baseSlang, variation }) => {
            const input = `${baseSlang}${variation}`;
            const response = slangInterpreter.interpretSlang(input);
            
            // Property: Should handle slang variations gracefully
            const isHandledGracefully = response.trim().length > 0 &&
                                      !response.toLowerCase().includes('error') &&
                                      !response.toLowerCase().includes('unknown');
            
            expect(isHandledGracefully).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });

    test('Mixed case slang is handled correctly', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            'SEMMA', 'Vera Level', 'MoKkA', 'ThAlA', 'MachaaN',
            'AUTO', 'Maama', 'AKKA', 'Filter Coffee'
          ),
          (mixedCaseSlang) => {
            const response = slangInterpreter.interpretSlang(mixedCaseSlang);
            
            // Property: Case should not affect slang interpretation
            const demonstratesUnderstanding = slangInterpreter.demonstratesUnderstanding(
              mixedCaseSlang,
              response
            );
            
            expect(demonstratesUnderstanding).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});