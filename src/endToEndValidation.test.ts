import { ContextLoader, ContextData } from './contextLoader';

/**
 * End-to-End Validation Tests
 * 
 * These tests validate that the Chennai Local Guide system demonstrates
 * clear influence from context files and provides authentic local behavior
 * across various user scenarios.
 * 
 * Validates: Requirements 4.2, 4.3
 */

describe('End-to-End Context Integration Validation', () => {
  let contextLoader: ContextLoader;
  let context: ContextData;

  beforeAll(() => {
    contextLoader = new ContextLoader();
    context = contextLoader.loadContext();
  });

  describe('Context File Loading and Validation', () => {
    test('should successfully load all required context files', () => {
      expect(context).toBeDefined();
      expect(context.productContent).toBeDefined();
      expect(context.agentConfig).toBeDefined();
      
      // Validate context contains Chennai-specific content
      expect(contextLoader.validateChennaiContext(context)).toBe(true);
    });

    test('should contain comprehensive Chennai knowledge base', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify key sections are present
      const requiredSections = [
        'city identity',
        'language patterns',
        'food culture',
        'transportation',
        'geography'
      ];
      
      requiredSections.forEach(section => {
        expect(productContent).toContain(section);
      });
    });

    test('should include essential Chennai-specific information', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify Chennai-specific markers
      const chennaiMarkers = [
        'chennai',
        'tamil nadu',
        'tanglish',
        'filter coffee',
        'marina beach',
        'mylapore',
        't. nagar',
        'omr',
        'gst road',
        'anna salai'
      ];
      
      chennaiMarkers.forEach(marker => {
        expect(productContent).toContain(marker);
      });
    });
  });

  describe('Slang and Language Context Integration', () => {
    test('should contain comprehensive slang dictionary', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify key Tanglish phrases are documented
      const slangTerms = [
        'semma',
        'vera level',
        'scene illa',
        'mokka',
        'thala',
        'machaan',
        'gethu',
        'paithiyam'
      ];
      
      slangTerms.forEach(term => {
        expect(productContent).toContain(term);
      });
    });

    test('should provide cultural context for language usage', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify cultural communication guidelines
      expect(productContent).toContain('sir');
      expect(productContent).toContain('madam');
      expect(productContent).toContain('respectful');
      expect(productContent).toContain('hierarchy');
    });
  });

  describe('Food Culture Context Integration', () => {
    test('should contain detailed food culture information', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify food items are documented
      const foodItems = [
        'idli',
        'dosa',
        'sambar',
        'rasam',
        'filter coffee',
        'bajji',
        'parotta',
        'biryani'
      ];
      
      foodItems.forEach(item => {
        expect(productContent).toContain(item);
      });
    });

    test('should include area-specific food recommendations', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify area-food mappings exist
      const areaFoodMappings = [
        't. nagar',
        'mylapore',
        'besant nagar',
        'triplicane',
        'sowcarpet'
      ];
      
      areaFoodMappings.forEach(area => {
        expect(productContent).toContain(area);
      });
    });

    test('should provide timing and cultural eating patterns', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify timing information is present
      expect(productContent).toContain('breakfast');
      expect(productContent).toContain('lunch');
      expect(productContent).toContain('evening');
      expect(productContent).toContain('dinner');
    });
  });

  describe('Transportation and Traffic Context Integration', () => {
    test('should contain comprehensive traffic information', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify traffic patterns are documented
      expect(productContent).toContain('peak hour');
      expect(productContent).toContain('morning rush');
      expect(productContent).toContain('evening rush');
      expect(productContent).toContain('traffic');
    });

    test('should include area-specific traffic characteristics', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify congestion areas are documented
      const congestionAreas = [
        'omr',
        'gst road',
        'anna salai',
        'sholinganallur',
        't. nagar'
      ];
      
      congestionAreas.forEach(area => {
        expect(productContent).toContain(area);
      });
    });

    test('should provide local transportation preferences', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify transportation modes are documented
      const transportModes = [
        'auto',  // auto-rickshaw is mentioned as "auto"
        'bus',
        'metro',
        'two-wheeler',
        'cab'
      ];
      
      transportModes.forEach(mode => {
        expect(productContent).toContain(mode);
      });
    });
  });

  describe('Geographic and Neighborhood Context Integration', () => {
    test('should contain comprehensive neighborhood information', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify major Chennai areas are documented
      const neighborhoods = [
        'adyar',
        'mylapore',
        't. nagar',
        'besant nagar',
        'velachery',
        'triplicane',
        'sowcarpet',
        'royapettah',
        'nungambakkam'
      ];
      
      neighborhoods.forEach(area => {
        expect(productContent).toContain(area);
      });
    });

    test('should provide cultural and practical neighborhood insights', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify neighborhood characteristics are described
      expect(productContent).toContain('residential');
      expect(productContent).toContain('commercial');
      expect(productContent).toContain('cultural');
      expect(productContent).toContain('traditional');
    });
  });

  describe('Agent Configuration Validation', () => {
    test('should have proper Chennai Local Guide configuration', () => {
      const agentConfig = context.agentConfig;
      
      expect(agentConfig.name).toContain('Chennai');
      expect(agentConfig.description).toContain('Chennai');
      expect(agentConfig.behavior).toBeDefined();
    });

    test('should include appropriate personality guidelines', () => {
      const agentConfig = context.agentConfig;
      
      expect(agentConfig.behavior.personality).toBeDefined();
      expect(Array.isArray(agentConfig.behavior.personality)).toBe(true);
      expect(agentConfig.behavior.personality.length).toBeGreaterThan(0);
    });

    test('should have comprehensive response guidelines', () => {
      const agentConfig = context.agentConfig;
      
      expect(agentConfig.behavior.response_guidelines).toBeDefined();
      expect(Array.isArray(agentConfig.behavior.response_guidelines)).toBe(true);
      expect(agentConfig.behavior.response_guidelines.length).toBeGreaterThan(0);
    });

    test('should include topic-specific expertise areas', () => {
      const agentConfig = context.agentConfig;
      
      expect(agentConfig.behavior.topic_expertise).toBeDefined();
      expect(agentConfig.behavior.topic_expertise.food_recommendations).toBeDefined();
      expect(agentConfig.behavior.topic_expertise.transportation_advice).toBeDefined();
      expect(agentConfig.behavior.topic_expertise.area_information).toBeDefined();
      expect(agentConfig.behavior.topic_expertise.cultural_guidance).toBeDefined();
    });
  });

  describe('Context Integration Quality Assurance', () => {
    test('should demonstrate context dependency in all major areas', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify that context contains interconnected information
      // that would enable authentic local responses
      
      // Language + Culture integration
      expect(productContent).toContain('tanglish');
      expect(productContent).toContain('tamil');
      expect(productContent).toContain('cultural');
      
      // Food + Area integration
      expect(productContent).toContain('area');
      expect(productContent).toContain('food');
      expect(productContent).toContain('restaurant');
      
      // Traffic + Time integration
      expect(productContent).toContain('time');
      expect(productContent).toContain('hour');
      expect(productContent).toContain('traffic');
      
      // Geography + Culture integration
      expect(productContent).toContain('neighborhood');
      expect(productContent).toContain('local');
      expect(productContent).toContain('community');
    });

    test('should provide sufficient detail for authentic responses', () => {
      const productContent = context.productContent;
      
      // Verify content length indicates comprehensive coverage
      expect(productContent.length).toBeGreaterThan(10000); // Substantial content
      
      // Verify multiple sections with detailed information
      const sections = productContent.split('##').length;
      expect(sections).toBeGreaterThan(5); // Multiple major sections
    });

    test('should maintain consistency across all context elements', () => {
      const productContent = context.productContent.toLowerCase();
      const agentConfig = context.agentConfig;
      
      // Verify agent config references align with product content
      expect(agentConfig.behavior.primary_context_source).toContain('product.md');
      
      // Verify behavioral guidelines align with cultural content
      const personalityGuidelines = agentConfig.behavior.personality.join(' ').toLowerCase();
      expect(personalityGuidelines).toContain('chennai');
      expect(personalityGuidelines).toContain('local');
    });
  });

  describe('End-to-End Scenario Validation', () => {
    test('should support comprehensive slang interpretation scenarios', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify context supports the demo scenarios
      expect(productContent).toContain('semma');
      expect(productContent).toContain('paithiyam');
      expect(productContent).toContain('mokka');
    });

    test('should support area-specific food recommendation scenarios', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify context supports T. Nagar food scenarios
      expect(productContent).toContain('t. nagar');
      expect(productContent).toContain('pondy bazaar');
      expect(productContent).toContain('bajji');
      expect(productContent).toContain('street food');
    });

    test('should support traffic and transportation scenarios', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify context supports Velachery-OMR traffic scenarios
      expect(productContent).toContain('velachery');
      expect(productContent).toContain('omr');
      expect(productContent).toContain('sholinganallur');
      expect(productContent).toContain('morning');
    });

    test('should support cultural event and festival scenarios', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify context supports music season scenarios
      expect(productContent).toContain('music');
      expect(productContent).toContain('classical');
      expect(productContent).toContain('dec-jan'); // This is how it appears in the context
      expect(productContent).toContain('cultural');
    });

    test('should support neighborhood character scenarios', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify context supports Adyar neighborhood scenarios
      expect(productContent).toContain('adyar');
      expect(productContent).toContain('posh'); // "posh residential" is used instead of "professional"
      expect(productContent).toContain('upscale');
      expect(productContent).toContain('connectivity');
    });

    test('should support weather and seasonal scenarios', () => {
      const productContent = context.productContent.toLowerCase();
      
      // Verify context supports monsoon scenarios
      expect(productContent).toContain('monsoon');
      expect(productContent).toContain('rain');
      expect(productContent).toContain('summer'); // July is mentioned in context of summer
      expect(productContent).toContain('waterlog');
    });
  });
});

describe('System Integration Health Check', () => {
  test('context loader should be fully functional', () => {
    const contextLoader = new ContextLoader();
    const context = contextLoader.loadContext();
    
    expect(context).toBeDefined();
    expect(contextLoader.validateChennaiContext(context)).toBe(true);
    
    const sections = contextLoader.extractLocalKnowledge(context);
    expect(sections.length).toBeGreaterThan(0);
  });

  test('all required test files exist', () => {
    const fs = require('fs');
    const path = require('path');
    
    const requiredTestFiles = [
      'src/contextLoader.test.ts',
      'src/slangInterpretation.test.ts', 
      'src/localTerminology.test.ts',
      'src/foodRecommendations.test.ts',
      'src/trafficAwareTravel.test.ts'
    ];
    
    requiredTestFiles.forEach(filePath => {
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});