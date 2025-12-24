import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface ContextData {
  productContent: string;
  agentConfig: any;
}

export class ContextLoader {
  private readonly contextDir: string;

  constructor(contextDir: string = '.kiro') {
    this.contextDir = contextDir;
  }

  /**
   * Load context files and return structured data
   */
  loadContext(): ContextData {
    const productPath = path.join(this.contextDir, 'product.md');
    const agentPath = path.join(this.contextDir, 'agent.yaml');

    if (!fs.existsSync(productPath)) {
      throw new Error(`Product context file not found: ${productPath}`);
    }

    if (!fs.existsSync(agentPath)) {
      throw new Error(`Agent configuration file not found: ${agentPath}`);
    }

    const productContent = fs.readFileSync(productPath, 'utf-8');
    const agentConfigRaw = fs.readFileSync(agentPath, 'utf-8');
    
    let agentConfig;
    try {
      agentConfig = yaml.load(agentConfigRaw);
    } catch (error) {
      throw new Error(`Failed to parse agent configuration: ${error}`);
    }

    return {
      productContent,
      agentConfig
    };
  }

  /**
   * Validate that context contains Chennai-specific information
   */
  validateChennaiContext(context: ContextData): boolean {
    const productContent = context.productContent.toLowerCase();
    
    // Check for Chennai-specific markers
    const chennaiMarkers = [
      'chennai',
      'tamil nadu',
      'tanglish',
      'filter coffee',
      'marina beach',
      'mylapore',
      't. nagar'
    ];

    const hasChennaiMarkers = chennaiMarkers.some(marker => 
      productContent.includes(marker)
    );

    // Check agent config has Chennai-specific behavior
    const agentName = context.agentConfig?.name?.toLowerCase() || '';
    const hasChennaiAgent = agentName.includes('chennai');

    return hasChennaiMarkers && hasChennaiAgent;
  }

  /**
   * Extract local knowledge sections from context
   */
  extractLocalKnowledge(context: ContextData): string[] {
    const sections = [];
    const content = context.productContent;

    // Extract major sections that should contain local knowledge
    const sectionRegex = /^##\s+(.+)$/gm;
    let match;
    
    while ((match = sectionRegex.exec(content)) !== null) {
      sections.push(match[1].trim());
    }

    return sections;
  }
}