import { Request, Response } from 'express';
import { Deal } from '../models/Deal.model';

const dummyDeals = [
  {
    name: 'GitHub Pro',
    description: 'Free GitHub Pro for 1 year, including advanced features for code review, CI/CD, and project management.',
    category: 'Developer Tools',
    value: 12,
    discount: 100,
    company: 'GitHub',
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    link: 'https://github.com/startups',
    couponCode: 'STARTUP2024',
    isRestricted: false,
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification', 'Less than 3 years old'],
    benefits: [
      'Unlimited private repositories',
      'Advanced CI/CD',
      'Code security and analysis',
      'Team collaboration tools'
    ],
    tags: ['development', 'version-control', 'devops']
  },
  {
    name: 'AWS Activate',
    description: 'Up to $100,000 in AWS credits for startups, plus technical support and training.',
    category: 'Cloud Services',
    value: 100000,
    discount: 100,
    company: 'Amazon Web Services',
    logo: 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png',
    link: 'https://aws.amazon.com/activate/',
    couponCode: 'ACTIVATE2024',
    isRestricted: true,
    restrictionDetails: 'Requires startup verification and in an accelerator program',
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification', 'Accelerator program member', 'Pitch deck'],
    benefits: [
      'AWS credits worth up to $100k',
      'AWS technical training',
      'AWS Activate support',
      'AWS partner network access'
    ],
    tags: ['cloud', 'infrastructure', 'deployment']
  },
  {
    name: 'Figma Professional',
    description: 'Free Figma Professional plan for 1 year, perfect for UI/UX design and prototyping.',
    category: 'Design',
    value: 12,
    discount: 100,
    company: 'Figma',
    logo: 'https://s3-alpha.figma.com/hub/file/1481185752/fa4cd070-6a79-4e1b-b079-8f09ff334635-cover',
    link: 'https://figma.com/startups',
    couponCode: 'FIGMA-STARTUP',
    isRestricted: false,
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification'],
    benefits: [
      'Unlimited projects',
      'Team collaboration',
      'Prototyping tools',
      'Design handoff features'
    ],
    tags: ['design', 'ui-ux', 'prototyping']
  },
  {
    name: 'Stripe Free Processing',
    description: 'Waived Stripe fees for the first $500k in transactions, helping startups save on payment processing.',
    category: 'Cloud Services',
    value: 5000,
    discount: 100,
    company: 'Stripe',
    logo: 'https://images.ctfassets.net/fzn2n1nzqp7d/1B3N0N0N0N0N0N0N0N0/1b3n0n0n0n0n0n0n0n/stripe_logo.png',
    link: 'https://stripe.com/startups',
    couponCode: 'STRIPE-STARTUP',
    isRestricted: true,
    restrictionDetails: 'Requires startup verification and revenue verification',
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification', 'Revenue verification', 'Business plan'],
    benefits: [
      'Waived transaction fees',
      'Enhanced support',
      'Extended payouts',
      'Advanced analytics'
    ],
    tags: ['payments', 'fintech', 'billing']
  },
  {
    name: 'Slack Pro',
    description: 'Free Slack Pro plan for up to 2 years, enabling seamless team communication and collaboration.',
    category: 'Productivity',
    value: 8,
    discount: 100,
    company: 'Slack',
    logo: 'https://a.slack-edge.com/80588/marketing/img/slack_hash_black_png.png',
    link: 'https://slack.com/startups',
    couponCode: 'SLACK-STARTUP',
    isRestricted: false,
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification', 'Less than 100 employees'],
    benefits: [
      'Unlimited message history',
      'All integrations',
      'Group video calls',
      'Shared channels'
    ],
    tags: ['communication', 'collaboration', 'productivity']
  },
  {
    name: 'Notion Business Plus',
    description: 'Free Notion Business Plus plan for 1 year, including advanced features for documentation and project management.',
    category: 'Productivity',
    value: 16,
    discount: 100,
    company: 'Notion',
    logo: 'https://www.notion.so/image/https%3A%2F%2Fwww.notion.so%2Fimages%2Flogo-ios.png',
    link: 'https://notion.so/startup',
    couponCode: 'NOTION-STARTUP',
    isRestricted: false,
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification'],
    benefits: [
      'Unlimited blocks',
      'Team management',
      'API access',
      'Advanced permissions'
    ],
    tags: ['documentation', 'productivity', 'knowledge-base']
  },
  {
    name: 'Intercom Standard',
    description: 'Free Intercom Standard plan for 1 year, helping you communicate with your customers effectively.',
    category: 'Marketing',
    value: 21,
    discount: 100,
    company: 'Intercom',
    logo: 'https://www.intercom.com/images/rebrand/apple-touch-icon.png',
    link: 'https://intercom.com/startups',
    couponCode: 'INTERCOM-STARTUP',
    isRestricted: false,
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification'],
    benefits: [
      'Live chat',
      'Email campaigns',
      'Customer data',
      'Mobile messaging'
    ],
    tags: ['communication', 'marketing', 'customer-support']
  },
  {
    name: 'MongoDB Atlas Credits',
    description: 'Up to $1,000 in MongoDB Atlas credits to power your application with a scalable database.',
    category: 'Databases',
    value: 1000,
    discount: 100,
    company: 'MongoDB',
    logo: 'https://webassets.mongodb.com/_cms/images/mongodb_logo.svg',
    link: 'https://www.mongodb.com/startups',
    couponCode: 'MONGO-STARTUP',
    isRestricted: true,
    restrictionDetails: 'Requires startup verification through an accelerator',
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification', 'Accelerator program member'],
    benefits: [
      'Free database hosting',
      'Automatic backups',
      'Global replication',
      'Security features'
    ],
    tags: ['database', 'backend', 'infrastructure']
  },
  {
    name: 'Auth0 Pro',
    description: 'Free Auth0 Pro plan for 1 year, providing enterprise-grade authentication and authorization.',
    category: 'Security',
    value: 100,
    discount: 100,
    company: 'Auth0',
    logo: 'https://cdn.auth0.com/website/auth0_logo_final_blue_RGB.svg',
    link: 'https://auth0.com/startups',
    couponCode: 'AUTH0-STARTUP',
    isRestricted: false,
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification'],
    benefits: [
      'Unlimited users',
      'Advanced security',
      'Social login',
      'Multi-factor authentication'
    ],
    tags: ['security', 'authentication', 'identity']
  },
  {
    name: 'Datadog Premium',
    description: 'Free Datadog Premium plan for 6 months, helping you monitor and optimize your infrastructure.',
    category: 'DevOps',
    value: 15,
    discount: 100,
    company: 'Datadog',
    logo: 'https://datadog-live.imgix.net/img/about/presskit/logo-v/dd_horizontal_purple.png',
    link: 'https://www.datadoghq.com/startups',
    couponCode: 'DATADOG-STARTUP',
    isRestricted: false,
    expirationDate: new Date('2025-12-31'),
    requirements: ['Startup verification'],
    benefits: [
      'Unlimited data retention',
      'All integrations',
      'Advanced alerting',
      'Custom dashboards'
    ],
    tags: ['monitoring', 'devops', 'observability']
  }
];

// Seed deals endpoint (admin only in production)
export const seedDealsEndpoint = async (req: Request, res: Response) => {
  try {
    // In production, verify admin role here
    
    // Clear existing deals
    await Deal.deleteMany({});
    console.log('🗑️  Cleared existing deals');

    // Insert dummy deals
    const insertedDeals = await Deal.insertMany(dummyDeals);
    console.log(`    Successfully inserted ${insertedDeals.length} dummy deals`);

    res.status(201).json({
      success: true,
      message: `Successfully seeded ${insertedDeals.length} dummy deals`,
      count: insertedDeals.length,
      data: insertedDeals,
    });
  } catch (error) {
    console.error('  Error seeding deals:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding deals',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
