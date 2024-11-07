'use client'

import Layout from '../components/Layout'

export default function MatchTypesGuide() {
  const matchTypes = [
    {
      type: 'Exakt matchning',
      description: 'Visar din annons endast när någon söker på exakt din sökfras eller mycket nära varianter av den.',
      examples: [
        {
          keyword: '[röda skor]',
          willMatch: ['röda skor', 'röd sko'],
          wontMatch: ['billiga röda skor', 'röda sportskor', 'röda och svarta skor']
        }
      ],
      pros: [
        'Högst relevans',
        'Bäst konverteringsgrad',
        'Mer kontroll över när annonsen visas'
      ],
      cons: [
        'Lägre sökvolym',
        'Kan missa relevanta sökningar',
        'Kräver fler nyckelord för bred täckning'
      ]
    },
    {
      type: 'Frasmatchning',
      description: 'Visar din annons när någon söker på din fras i den ordning du angett, med möjlighet till extra ord före eller efter.',
      examples: [
        {
          keyword: '"röda skor"',
          willMatch: ['köpa röda skor', 'röda skor online', 'billiga röda skor'],
          wontMatch: ['skor röda', 'röda sneakers', 'röda och svarta skor']
        }
      ],
      pros: [
        'Bra balans mellan relevans och räckvidd',
        'Fångar upp relevanta längre sökfraser',
        'Fortfarande god kontroll över när annonsen visas'
      ],
      cons: [
        'Kan visa annonser för mindre relevanta sökningar',
        'Dyrare än exakt matchning',
        'Kräver noggrann övervakning av söktermer'
      ]
    },
    {
      type: 'Bred matchning',
      description: 'Visar din annons för sökningar som är relaterade till ditt nyckelord, inklusive synonymer, felstavningar och relaterade sökningar.',
      examples: [
        {
          keyword: 'röda skor',
          willMatch: ['röda sneakers', 'röda kängor', 'röda damskor', 'röd sko'],
          wontMatch: ['skor', 'röda kläder', 'röda accessoarer']
        }
      ],
      pros: [
        'Störst räckvidd',
        'Fångar upp oväntade relevanta sökningar',
        'Bra för att upptäcka nya nyckelord'
      ],
      cons: [
        'Lägst relevans',
        'Kan vara kostsamt',
        'Kräver mycket övervakning och negativa nyckelord'
      ]
    }
  ]

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Match Types Guide</h1>
          
          {/* Introduction */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <p className="text-gray-600">
              Understanding match types is crucial for running effective Google Ads campaigns. 
              Each match type serves a different purpose and can help you reach your target audience in different ways.
            </p>
          </div>

          {/* Match Types */}
          <div className="space-y-8">
            {matchTypes.map((matchType) => (
              <div key={matchType.type} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">{matchType.type}</h2>
                  
                  <p className="text-gray-600 mb-6">
                    {matchType.description}
                  </p>

                  {/* Examples */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium mb-3">Examples</h3>
                    {matchType.examples.map((example, index) => (
                      <div key={index} className="space-y-2">
                        <p className="font-mono text-blue-600">
                          Keyword: {example.keyword}
                        </p>
                        <div className="ml-4">
                          <p className="text-sm text-gray-600 mb-2">Will match:</p>
                          <ul className="list-disc list-inside text-green-600 text-sm ml-4">
                            {example.willMatch.map((term, i) => (
                              <li key={i}>{term}</li>
                            ))}
                          </ul>
                          <p className="text-sm text-gray-600 mt-2 mb-2">Won't match:</p>
                          <ul className="list-disc list-inside text-red-600 text-sm ml-4">
                            {example.wontMatch.map((term, i) => (
                              <li key={i}>{term}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-green-600 mb-2">Pros</h3>
                      <ul className="space-y-1">
                        {matchType.pros.map((pro, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-600">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-red-600 mb-2">Cons</h3>
                      <ul className="space-y-1">
                        {matchType.cons.map((con, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-gray-600">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Best Practices */}
          <div className="bg-blue-50 rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">Start with exact and phrase match for better control and ROI</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">Use broad match with careful monitoring and negative keywords</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">Regularly review search terms report to optimize match types</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
} 