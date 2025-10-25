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
    <section className="h-screen flex flex-col justify-center max-w-5xl mx-auto">
      <h3 className="text-2xl font-bold text-emerald-700 mb-12 text-center">
        Who is Zemen Pharma for?
      </h3>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full"
      >
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="gap-6">
            {" "}
            {/* adds space between cards */}
            {/* 1. Pharmacy Owners */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <Card className="h-full flex flex-col bg-white">
                <CardContent className="text-left p-6">
                  <h3 className="text-xl font-semibold mb-2 text-emerald-900">
                    For Pharmacy Owners
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Zemen Pharma helps you stay in control of your entire
                    operation — from inventory and branch performance to
                    supplier management — all powered by AI-driven dashboards
                    and real-time forecasting.
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
            {/* 2. Cashiers & Sales Staff */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <Card className="h-full flex flex-col bg-white">
                <CardContent className="text-left p-6">
                  <h3 className="text-xl font-semibold mb-2 text-emerald-900">
                    For Cashiers & Sales Staff
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Process daily transactions effortlessly using our intuitive
                    POS system — complete with support for cash, card, and
                    digital payments, plus automatic receipts and end-of-day
                    reporting.
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
            {/* 3. Customers */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <Card className="h-full flex flex-col bg-white">
                <CardContent className="text-left p-6">
                  <h3 className="text-xl font-semibold mb-2 text-emerald-900">
                    For Customers
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Customers can easily browse and order medicines online,
                    discover nearby pharmacies, and track deliveries — creating
                    a seamless and accessible healthcare shopping experience.
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
            {/* 4. Managers & Executives */}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
              <Card className="h-full flex flex-col bg-white">
                <CardContent className="text-left p-6">
                  <h3 className="text-xl font-semibold mb-2 text-emerald-900">
                    For Managers & Executives
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Gain complete business insight through AI-powered analytics
                    that predict stock shortages, identify sales trends, and
                    enhance decision-making across all branches and departments.
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          {/* Optional: Navigation arrows */}
          <CarouselPrevious className="hidden lg:block" />
          <CarouselNext className="hidden lg:block" />
        </Carousel>
      </motion.div>
    </section>
  );
}
