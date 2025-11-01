import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
export default function WhoIsZemenPharma() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col justify-center py-20">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_25px_80px_-35px_rgba(59,130,246,0.45)] backdrop-blur">
        <h3 className="mb-8 text-center text-3xl font-bold text-emerald-200">
          Who is Zemen Inventory for?
        </h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 2500,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="gap-6">
              {/* 1. Inventory Operators */}
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <Card className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_20px_60px_-35px_rgba(16,185,129,0.45)] backdrop-blur">
                  <CardContent className="space-y-3 p-0 text-left">
                    <h4 className="text-lg font-semibold text-emerald-100">
                      For Inventory Operators
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-200">
                      Stay in control of multi-location operations with AI-driven dashboards,
                      predictive restocking, and centralized governance.
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
              {/* 2. Operations Leaders */}
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <Card className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_20px_60px_-35px_rgba(16,185,129,0.45)] backdrop-blur">
                  <CardContent className="space-y-3 p-0 text-left">
                    <h4 className="text-lg font-semibold text-emerald-100">
                      For Operations Leaders
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-200">
                      Activate AI copilots that surface demand forecasts, smart alerts, and
                      workflow recommendations to keep every location in sync.
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
              {/* 3. Security & Compliance */}
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <Card className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_20px_60px_-35px_rgba(16,185,129,0.45)] backdrop-blur">
                  <CardContent className="space-y-3 p-0 text-left">
                    <h4 className="text-lg font-semibold text-emerald-100">
                      For Security & Compliance Teams
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-200">
                      Enforce role-based access, maintain audit trails, and safeguard sensitive
                      business data with encryption-first architecture.
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
              {/* 4. Mobile Executives */}
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <Card className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-[0_20px_60px_-35px_rgba(16,185,129,0.45)] backdrop-blur">
                  <CardContent className="space-y-3 p-0 text-left">
                    <h4 className="text-lg font-semibold text-emerald-100">
                      For Mobile Executives
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-200">
                      Approve payouts, resolve issues, and track KPIs from any device with a
                      mobile-first command center.
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-emerald-100 shadow-[0_18px_55px_-30px_rgba(16,185,129,0.6)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:bg-gradient-to-br hover:from-emerald-500/40 hover:to-blue-500/40 hover:text-white hover:shadow-[0_28px_85px_-30px_rgba(16,185,129,0.7)] lg:flex" />
            <CarouselNext className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-emerald-100 shadow-[0_18px_55px_-30px_rgba(59,130,246,0.6)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:bg-gradient-to-br hover:from-emerald-500/40 hover:to-blue-500/40 hover:text-white hover:shadow-[0_28px_85px_-30px_rgba(59,130,246,0.7)] lg:flex" />
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}
