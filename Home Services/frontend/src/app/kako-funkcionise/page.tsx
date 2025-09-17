'use client';

export default function KakoFunkcionisePage() {
  const steps = [
    {
      number: 1,
      title: "Registruj se",
      description: "Kreiraj besplatan nalog kao korisnik ili majstor na našoj platformi."
    },
    {
      number: 2,
      title: "Pronađi majstora",
      description: "Pretraži po kategorijama i pronađi majstora koji odgovara tvojim potrebama."
    },
    {
      number: 3,
      title: "Kontaktiraj",
      description: "Pozovi direktno ili pošalji poruku majstoru da dogovoriš detalje posla."
    },
    {
      number: 4,
      title: "Dogovori posao",
      description: "Dogovorite termin i cenu direktno sa majstorom, bez posrednika."
    }
  ];

  const benefits = [
    {
      title: "Verifikovani majstori",
      description: "Svi majstori prolaze proces verifikacije i imaju potvrđeno iskustvo."
    },
    {
      title: "Ocene korisnika",
      description: "Vidi ocene i komentare prethodnih korisnika pre izbora majstora."
    },
    {
      title: "Direktan kontakt",
      description: "Kontaktiraj majstora direktno bez posrednika - telefon ili poruke."
    },
    {
      title: "Lokalni majstori",
      description: "Majstori iz tvog grada koji poznaju lokalne uslove i potrebe."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Kako funkcioniše Home Services
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Povezujemo ljude sa pouzdanim majstorima u samo nekoliko koraka
          </p>
        </div>

        {/* Koraci */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Jednostavan proces u 4 koraka
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Prednosti */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Zašto Home Services?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Često postavljana pitanja
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Da li je korišćenje platforme besplatno?
              </h3>
              <p className="text-gray-600">
                Da, za korisnike je potpuno besplatno. Majstori plaćaju malu mesečnu pretplatu.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Kako znam da je majstor pouzdan?
              </h3>
              <p className="text-gray-600">
                Svi majstori prolaze verifikaciju, a možeš videti ocene i komentare prethodnih korisnika.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Šta ako nisam zadovoljan uslugom?
              </h3>
              <p className="text-gray-600">
                Možeš ostaviti ocenu i komentar. Naš tim rešava sporove između korisnika i majstora.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Spreman za početak?
          </h2>
          <p className="text-gray-600 mb-8">
            Registruj se danas i pronađi idealnog majstora za svoj projekat
          </p>
          <button
            onClick={() => window.location.href = '/registracija'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium"
          >
            Registruj se besplatno
          </button>
        </div>
      </div>
    </div>
  );
}