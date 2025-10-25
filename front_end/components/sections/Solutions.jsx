import SolutionImage from "@/public/ai_solution.jpg";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
export default function Solutions() {
  return (
    <section
      id="ai-solutions"
      className="flex flex-col justify-center max-w-5xl mx-auto"
    >
      <div className="grid md:grid-cols-2 gap-10 my-20">
        <div className="my-10 block">
          <Image src={SolutionImage} alt="ai-powered-solutions-image" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-emerald-700 mb-12 text-center mt-20">
            AI-Powered Solutions
          </h3>
          <div className="text-gray-700">
            Zemen Pharma is an AI-powered pharmacy management system designed to
            streamline operations, enhance efficiency, and provide real-time
            insights for pharmacy owners, staff, and customers.
          </div>
        </div>
      </div>
    </section>
  );
}
