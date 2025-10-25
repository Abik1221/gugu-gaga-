import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function Benefits() {
  return (
    <section
      id="benefits"
      className="lg:h-screen flex flex-col justify-center max-w-5xl mx-auto"
    >
      <h3 className="text-2xl font-bold text-emerald-700 mb-12 text-center">
        Why Choose Zemen Pharma?
      </h3>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-white border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-900">
              Increased Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Automate routine tasks, reduce manual errors, and streamline
              operations across all your pharmacy locations.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-900">
              Better Decision Making
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Make informed decisions with AI-powered insights and real-time
              data about your business performance.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-900">
              Enhanced Customer Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Provide seamless shopping experiences with online ordering,
              medicine search, and delivery tracking.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-emerald-500">
          <CardHeader>
            <CardTitle className="text-lg text-emerald-900">
              Cost Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Reduce waste with smart inventory management and optimize staffing
              with sales pattern analysis.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
