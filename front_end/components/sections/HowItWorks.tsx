export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="md:h-screen py-30 flex flex-col justify-center max-w-4xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-emerald-700 mb-12 text-center">
        How Zemen Pharma Works
      </h3>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-emerald-700">1</span>
          </div>
          <h4 className="text-xl font-semibold text-emerald-900 mb-3">
            Setup & Integration
          </h4>
          <p className="text-gray-700">
            Quick setup with your existing pharmacy data. Integrate with your
            suppliers and payment systems seamlessly.
          </p>
        </div>

        <div className="text-center">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-emerald-700">2</span>
          </div>
          <h4 className="text-xl font-semibold text-emerald-900 mb-3">
            AI Optimization
          </h4>
          <p className="text-gray-700">
            Our AI analyzes your operations and starts providing insights,
            predictions, and automated recommendations.
          </p>
        </div>

        <div className="text-center">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-emerald-700">3</span>
          </div>
          <h4 className="text-xl font-semibold text-emerald-900 mb-3">
            Grow & Scale
          </h4>
          <p className="text-gray-700">
            Expand your business with confidence using real-time data,
            multi-branch support, and continuous AI improvements.
          </p>
        </div>
      </div>
    </section>
  );
}
