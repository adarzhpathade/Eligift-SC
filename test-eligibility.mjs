import fetch from 'node-fetch';

async function test() {
  console.log('Testing Eligibility Engine...');

  const inputs = [
    {
      name: 'Eligible for MCF (Low Income, Low Cost)',
      payload: {
        category: 'sc',
        annualIncome: 150000, // < 3Lakh
        projectCost: 100000,  // < 1.4Lakh
      }
    },
    {
      name: 'Income Exceeds Limit',
      payload: {
        category: 'sc',
        annualIncome: 400000, // > 3Lakh
        projectCost: 100000,
      }
    },
    {
      name: 'Eligible for TLS (High Cost)',
      payload: {
        category: 'sc',
        annualIncome: 250000, // < 3Lakh
        projectCost: 2000000, // > 1.4Lakh, < 50Lakh
      }
    },
    {
      name: 'Eligible for SUY (No Income Limit, Safai Karamchari)',
      payload: {
        category: 'sc',
        annualIncome: 500000, // Normally rejected, but SUY allows 999999999
        projectCost: 2000000,
        isSafaiKaramchari: true
      }
    }
  ];

  for (const input of inputs) {
    console.log(`\n--- Test: ${input.name} ---`);
    try {
      const res = await fetch('http://localhost:3000/api/eligibility/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input.payload)
      });

      const latency = res.headers.get('x-response-time');
      console.log(`Response Time: ${latency}`);

      const data = await res.json();
      console.log(`Is Eligible: ${data.isEligible}`);
      if (data.isEligible && data.primaryScheme) {
        console.log(`Primary Scheme: ${data.primaryScheme.title} (${data.primaryScheme.slug})`);
      } else {
        console.log('Primary Scheme: None');
      }

      console.log(`Alternative count: ${data.alternatives.length}`);
    } catch (e) {
      console.error('Error:', e);
    }
  }
}

test();
