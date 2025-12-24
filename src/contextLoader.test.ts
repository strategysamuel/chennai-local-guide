import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';
import { ContextLoader, ContextData } from './contextLoader';

/**
 * Feature: chennai-local-guide, Property 8: Context file dependency
 * 
 * Property: For any system response, the information provided should be 
 * verifiable against the content in the .kiro context files
 * 
 * Validates: Requirements 4.1, 4.2
 */

describe('ContextLoader Property-Based Tests', () => {
  let contextLoader: ContextLoader;
  let originalContext: ContextData;

  beforeAll(() => {
    contextLoader = new ContextLoader();
    // Load the actual context to use as reference
    originalContext = contextLoader.loadContext();
  });

  describe('Property 8: Context file dependency', () => {
    test('**Feature: chennai-local-guide, Property 8: Context file dependency**', () => {
      fc.assert(
        fc.property(
          // Generate various context directory paths to test robustness
          fc.constantFrom('.kiro', './.kiro', path.resolve('.kiro')),
          (contextDir) => {
            const loader = new ContextLoader(contextDir);
            
            // Load context from the specified directory
            const context = loader.loadContext();
            
            // Property: All loaded context should contain verifiable Chennai-specific content
            // This validates that the context files are properly loaded and contain expected local knowledge
            
            // 1. Context should contain product content that is non-empty and Chennai-specific
            expect(context.productContent).toBeTruthy();
            expect(context.productContent.length).toBeGreaterThan(0);
            
            // 2. Context should contain agent configuration that is properly structured
            expect(context.agentConfig).toBeTruthy();
            expect(typeof context.agentConfig).toBe('object');
            
            // 3. Context should pass Chennai validation (contains local markers)
            const isValidChennaiContext = loader.validateChennaiContext(context);
            expect(isValidChennaiContext).toBe(true);
            
            // 4. Context should contain extractable local knowledge sections
            const knowledgeSections = loader.extractLocalKnowledge(context);
            expect(knowledgeSections.length).toBeGreaterThan(0);
            
            // 5. Context content should be consistent with file system content
            const expectedProductPath = path.join(contextDir, 'product.md');
            const expectedAgentPath = path.join(contextDir, 'agent.yaml');
            
            expect(fs.existsSync(expectedProductPath)).toBe(true);
            expect(fs.existsSync(expectedAgentPath)).toBe(true);
            
            // 6. Loaded content should match file content exactly
            const fileProductContent = fs.readFileSync(expectedProductPath, 'utf-8');
            expect(context.productContent).toBe(fileProductContent);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Context validation identifies Chennai-specific content', () => {
      fc.assert(
        fc.property(
          // Generate test contexts with varying Chennai markers
          fc.record({
            productContent: fc.oneof(
              // Valid Chennai content
              fc.constant(originalContext.productContent),
              // Content with Chennai markers
              fc.string().map(s => s + ' chennai tamil nadu tanglish filter coffee'),
              // Content without Chennai markers (should fail validation)
              fc.string().filter(s => !s.toLowerCase().includes('chennai'))
            ),
            agentConfig: fc.oneof(
              // Valid agent config
              fc.constant(originalContext.agentConfig),
              // Config with Chennai name
              fc.constant({ name: 'Chennai Local Guide', version: '1.0.0' }),
              // Config without Chennai reference
              fc.constant({ name: 'Generic Guide', version: '1.0.0' })
            )
          }),
          (testContext) => {
            const isValid = contextLoader.validateChennaiContext(testContext);
            
            // Property: Validation should correctly identify Chennai-specific content
            const hasChennaiMarkers = testContext.productContent.toLowerCase().includes('chennai') ||
                                    testContext.productContent.toLowerCase().includes('tamil nadu') ||
                                    testContext.productContent.toLowerCase().includes('tanglish');
            
            const hasChennaiAgent = testContext.agentConfig?.name?.toLowerCase()?.includes('chennai') || false;
            
            const expectedValid = hasChennaiMarkers && hasChennaiAgent;
            
            expect(isValid).toBe(expectedValid);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('Knowledge extraction returns meaningful sections', () => {
      fc.assert(
        fc.property(
          // Generate markdown content with various section structures
          fc.array(fc.string().filter(s => s.trim().length > 0), { minLength: 1, maxLength: 10 })
            .map(sections => sections.map(s => `## ${s}`).join('\n\n')),
          (markdownContent) => {
            const testContext: ContextData = {
              productContent: markdownContent,
              agentConfig: originalContext.agentConfig
            };
            
            const extractedSections = contextLoader.extractLocalKnowledge(testContext);
            
            // Property: Extracted sections should correspond to actual markdown headers
            const expectedSectionCount = (markdownContent.match(/^##\s+/gm) || []).length;
            expect(extractedSections.length).toBe(expectedSectionCount);
            
            // Each extracted section should be non-empty
            extractedSections.forEach(section => {
              expect(section.trim().length).toBeGreaterThan(0);
            });
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Error handling for missing context files', () => {
    test('Throws appropriate errors for missing files', () => {
      fc.assert(
        fc.property(
          // Generate non-existent directory paths
          fc.string().filter(s => s.trim().length > 0 && !fs.existsSync(s)),
          (nonExistentDir) => {
            const loader = new ContextLoader(nonExistentDir);
            
            // Property: Missing context files should result in clear error messages
            expect(() => loader.loadContext()).toThrow();
            
            try {
              loader.loadContext();
            } catch (error) {
              expect(error).toBeInstanceOf(Error);
              expect((error as Error).message).toContain('not found');
            }
            
            return true;
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});