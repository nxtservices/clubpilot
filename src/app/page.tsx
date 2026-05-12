export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-brand-dark mb-4">
          ClubPilot
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          De slimme cockpit voor je vereniging
        </p>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Welkom</h2>
          <p className="text-gray-600">
            ClubPilot helpt verenigingen bij het organiseren van vrijwilligers, commissies, taken,
            agenda, documenten, vergaderingen, besluiten en stemmingen in één centraal smart
            werkgebied.
          </p>
        </div>
      </div>
    </main>
  );
}
