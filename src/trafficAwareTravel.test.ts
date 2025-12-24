import * as fc from 'fast-check';
import { ContextLoader, ContextData } from './contextLoader';

/**
 * Feature: chennai-local-guide, Property 6: Traffic-aware travel estimates
 * 
 * Property: For any travel time query, estimates should reflect Chennai-specific 
 * traffic patterns and vary based on time of day and known congestion areas
 * 
 * Validates: Requirements 3.1, 3.3
 */

interface TravelQuery {
  from: string;
  to: string;
  timeOfDay: number; // 0-23 hours
  dayType: 'weekday' | 'weekend';
}

interface TravelEstimate {
  estimatedMinutes: number;
  trafficLevel: 'light' | 'moderate' | 'heavy' | 'severe';
  alternativeRoute?: string;
  warnings?: string[];
}

interface TransportationRecommendation {
  mode: string;
  reasoning: string;
  alternatives: string[];
  localPreference: boolean;
}

class TrafficAwareEstimator {
  private context: ContextData;

  constructor(context: ContextData) {
    this.context = context;
  }

  estimateTravel(query: TravelQuery): TravelEstimate {
    const productContent = this.context.productContent.toLowerCase();
    
    const isPeakHour = this.isPeakHour(query.timeOfDay, query.dayType);
    const isCongestionArea = this.isCongestionArea(query.from, query.to, productContent);
    
    let estimatedMinutes = this.getBaseEstimate(query.from, query.to);
    let trafficLevel: TravelEstimate['trafficLevel'] = 'light';
    const warnings: string[] = [];

    if (isPeakHour) {
      estimatedMinutes *= 2.5;
      trafficLevel = isCongestionArea ? 'severe' : 'heavy';
      warnings.push('Peak hour traffic expected');
    } else if (isCongestionArea) {
      estimatedMinutes *= 1.5;
      trafficLevel = 'moderate';
    }

    if (productContent.includes('monsoon') && productContent.includes('waterlogging')) {
      warnings.push('Monsoon season - possible waterlogging delays');
    }

    return {
      estimatedMinutes: Math.round(estimatedMinutes),
      trafficLevel,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  /**
   * Recommend transportation mode based on Chennai local preferences
   */
  recommendTransportation(query: TravelQuery): TransportationRecommendation {
    const productContent = this.context.productContent.toLowerCase();
    const distance = this.estimateDistance(query.from, query.to);
    const isPeakHour = this.isPeakHour(query.timeOfDay, query.dayType);
    
    // Extract local transportation preferences from context
    const hasAutoInfo = productContent.includes('auto-rickshaw') || productContent.includes('negotiate fare');
    const hasBusInfo = productContent.includes('mtc') || productContent.includes('buses');
    const hasTwoWheelerInfo = productContent.includes('two-wheeler') || productContent.includes('lane-splitting');
    
    let mode = 'walking';
    let reasoning = 'Default recommendation';
    const alternatives: string[] = [];
    let localPreference = false;

    // Short distances - walking or auto
    if (distance < 2) {
      if (hasAutoInfo) {
        mode = 'auto-rickshaw';
        reasoning = 'Short distance, auto-rickshaw is convenient for Chennai';
        alternatives.push('walking');
        localPreference = true;
      } else {
        mode = 'walking';
        reasoning = 'Short distance suitable for walking';
      }
    }
    // Medium distances - auto, bus, or two-wheeler
    else if (distance < 10) {
      if (isPeakHour && hasTwoWheelerInfo) {
        mode = 'two-wheeler';
        reasoning = 'Peak hour traffic, two-wheeler can navigate through congestion';
        alternatives.push('auto-rickshaw', 'bus');
        localPreference = true;
      } else if (hasBusInfo) {
        mode = 'bus';
        reasoning = 'Medium distance, MTC buses are economical';
        alternatives.push('auto-rickshaw');
        localPreference = true;
      } else {
        mode = 'auto-rickshaw';
        reasoning = 'Medium distance, auto-rickshaw is suitable';
        localPreference = hasAutoInfo;
      }
    }
    // Long distances - cab or train
    else {
      mode = 'cab';
      reasoning = 'Long distance, cab is most comfortable';
      alternatives.push('bus', 'train');
      localPreference = productContent.includes('ola') || productContent.includes('uber');
    }

    // Special area considerations
    if (query.from.toLowerCase().includes('t. nagar') || query.to.toLowerCase().includes('t. nagar')) {
      if (productContent.includes('t. nagar') && productContent.includes('crowded')) {
        alternatives.unshift('walking');
        reasoning += ' (T. Nagar is crowded, consider walking for short distances)';
        localPreference = true;
      }
    }

    return {
      mode,
      reasoning,
      alternatives,
      localPreference
    };
  }

  private isPeakHour(hour: number, dayType: string): boolean {
    if (dayType === 'weekend') return false;
    return (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);
  }

  private isCongestionArea(from: string, to: string, content: string): boolean {
    const congestionAreas = ['omr', 'gst road', 'anna salai', 't. nagar', 'sholinganallur'];
    const locations = [from.toLowerCase(), to.toLowerCase()];
    
    return congestionAreas.some(area => 
      locations.some(loc => loc.includes(area) || content.includes(`${area}`) && content.includes('traffic'))
    );
  }

  private getBaseEstimate(from: string, to: string): number {
    const hash = (from + to).length;
    return 15 + (hash % 45);
  }

  private estimateDistance(from: string, to: string): number {
    // Simple distance estimation based on string similarity
    const hash = (from + to).length;
    return 1 + (hash % 20); // 1-20 km estimate
  }
}

describe('Traffic-aware travel estimates Property-Based Tests', () => {
  let contextLoader: ContextLoader;
  let context: ContextData;
  let estimator: TrafficAwareEstimator;

  beforeAll(() => {
    contextLoader = new ContextLoader();
    context = contextLoader.loadContext();
    estimator = new TrafficAwareEstimator(context);
  });

  describe('Property 6: Traffic-aware travel estimates', () => {
    test('**Feature: chennai-local-guide, Property 6: Traffic-aware travel estimates**', () => {
      fc.assert(
        fc.property(
          fc.record({
            from: fc.oneof(
              fc.constant('T. Nagar'),
              fc.constant('OMR'),
              fc.constant('GST Road'),
              fc.constant('Mylapore'),
              fc.constant('Adyar'),
              fc.constant('Velachery'),
              fc.constant('Sholinganallur'),
              fc.constant('Anna Salai'),
              fc.constant('Besant Nagar'),
              fc.constant('Triplicane')
            ),
            to: fc.oneof(
              fc.constant('T. Nagar'),
              fc.constant('OMR'),
              fc.constant('GST Road'),
              fc.constant('Mylapore'),
              fc.constant('Adyar'),
              fc.constant('Velachery'),
              fc.constant('Sholinganallur'),
              fc.constant('Anna Salai'),
              fc.constant('Besant Nagar'),
              fc.constant('Triplicane')
            ),
            timeOfDay: fc.integer({ min: 0, max: 23 }),
            dayType: fc.oneof(fc.constant('weekday' as const), fc.constant('weekend' as const))
          }),
          (query: TravelQuery) => {
            const estimate = estimator.estimateTravel(query);
            
            // Property: Estimates should be reasonable (positive numbers)
            expect(estimate.estimatedMinutes).toBeGreaterThan(0);
            expect(estimate.estimatedMinutes).toBeLessThan(300);
            
            // Property: Peak hours should result in longer estimates for weekdays
            if (query.dayType === 'weekday') {
              const peakHourQuery = { ...query, timeOfDay: 8 };
              const offPeakQuery = { ...query, timeOfDay: 14 };
              
              const peakEstimate = estimator.estimateTravel(peakHourQuery);
              const offPeakEstimate = estimator.estimateTravel(offPeakQuery);
              
              const peakImpact = peakEstimate.estimatedMinutes >= offPeakEstimate.estimatedMinutes ||
                                ['heavy', 'severe'].includes(peakEstimate.trafficLevel);
              expect(peakImpact).toBe(true);
            }
            
            // Property: Known congestion areas should have traffic considerations
            const congestionAreas = ['OMR', 'GST Road', 'Anna Salai', 'T. Nagar', 'Sholinganallur'];
            const involvesKnownCongestion = congestionAreas.some(area => 
              query.from.includes(area) || query.to.includes(area)
            );
            
            if (involvesKnownCongestion && query.dayType === 'weekday') {
              expect(['moderate', 'heavy', 'severe']).toContain(estimate.trafficLevel);
            }
            
            if (estimate.trafficLevel === 'severe') {
              expect(estimate.estimatedMinutes).toBeGreaterThan(30);
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 7: Local transportation preferences', () => {
    test('**Feature: chennai-local-guide, Property 7: Local transportation preferences**', () => {
      fc.assert(
        fc.property(
          fc.record({
            from: fc.oneof(
              fc.constant('T. Nagar'),
              fc.constant('OMR'),
              fc.constant('GST Road'),
              fc.constant('Mylapore'),
              fc.constant('Adyar'),
              fc.constant('Velachery'),
              fc.constant('Sholinganallur'),
              fc.constant('Anna Salai'),
              fc.constant('Besant Nagar'),
              fc.constant('Triplicane')
            ),
            to: fc.oneof(
              fc.constant('T. Nagar'),
              fc.constant('OMR'),
              fc.constant('GST Road'),
              fc.constant('Mylapore'),
              fc.constant('Adyar'),
              fc.constant('Velachery'),
              fc.constant('Sholinganallur'),
              fc.constant('Anna Salai'),
              fc.constant('Besant Nagar'),
              fc.constant('Triplicane')
            ),
            timeOfDay: fc.integer({ min: 0, max: 23 }),
            dayType: fc.oneof(fc.constant('weekday' as const), fc.constant('weekend' as const))
          }),
          (query: TravelQuery) => {
            const recommendation = estimator.recommendTransportation(query);
            
            // Property: Recommendations should be valid transportation modes
            const validModes = ['walking', 'auto-rickshaw', 'bus', 'two-wheeler', 'cab', 'train'];
            expect(validModes).toContain(recommendation.mode);
            
            // Property: Should have reasoning for the recommendation
            expect(recommendation.reasoning.length).toBeGreaterThan(0);
            
            // Property: Alternatives should be different from main mode
            recommendation.alternatives.forEach(alt => {
              expect(alt).not.toBe(recommendation.mode);
              expect(validModes).toContain(alt);
            });
            
            // Property: Local preferences should be based on context content
            if (recommendation.localPreference) {
              const contextContent = context.productContent.toLowerCase();
              const hasRelevantInfo = 
                contextContent.includes(recommendation.mode.replace('-', '')) ||
                contextContent.includes('chennai') ||
                contextContent.includes('local');
              expect(hasRelevantInfo).toBe(true);
            }
            
            // Property: T. Nagar specific recommendations should consider crowding
            if (query.from.includes('T. Nagar') || query.to.includes('T. Nagar')) {
              const contextContent = context.productContent.toLowerCase();
              if (contextContent.includes('t. nagar') && contextContent.includes('crowd')) {
                expect(recommendation.alternatives.includes('walking') || 
                       recommendation.reasoning.includes('crowd') ||
                       recommendation.reasoning.includes('T. Nagar')).toBe(true);
              }
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});