"use client";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";

export default function TestimonialsSection() {
  const { t } = useLanguage();

  // Check if current language is Amharic
  const isAmharic = t.nav.features === "ባህሪያት";

  const testimonials = [
    {
      name: isAmharic ? "አለማየሁ ታደሰ" : "Alemayehu Tadesse",
      role: isAmharic ? "የመድሃኒት ቤት ባለቤት፣ ቢሾፍቱ" : "Pharmacy Owner, Bishoftu",
      image:
        "https://images.unsplash.com/photo-1687422809654-579d81c29d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYnVzaW5lc3MlMjBvd25lcnxlbnwxfHx8fDE3NjIzMzk1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      content: isAmharic
        ? "የእቃዎቼን መረጃ ማጣት ለማቆም ዝግጁ ነኝ። AI እንዴት የመድሃኒት ቤት ቅርንጫፎቼን በብቃት ለማስተዳደር እንደሚረዳኝ ለማየት ጓጉቻለሁ።"
        : "I'm ready to stop losing track of my inventory and finally get real-time insights. Can't wait to see how AI will help me manage my pharmacy branches efficiently.",
      rating: 5,
    },
    {
      name: isAmharic ? "መሰረት ሀይሌ" : "Meseret Haile",
      role: isAmharic ? "የችርቻሮ መደብር ሰንሰለት ስራ አስኪያጅ" : "Retail Store Chain Manager",
      image:
        "https://images.unsplash.com/photo-1687422809654-579d81c29d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYnVzaW5lc3MlMjBvd25lcnxlbnwxfHx8fDE3NjIzMzk1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      content: isAmharic
        ? "በርካታ መደብሮችን በእጅ ማስተዳደር አድካሚ ነው። ሁሉንም በአንድ ዳሽቦርድ ላይ ለማግኘት እና በገበያ ቦታው በኩል ከተሻሉ አቅራቢዎች ጋር ለመገናኘት ጓጉቻለሁ።"
        : "Managing multiple stores manually is exhausting. I'm excited to have everything in one dashboard and connect with better suppliers through the marketplace.",
      rating: 5,
    },
    {
      name: isAmharic ? "ዳዊት ከበደ" : "Dawit Kebede",
      role: isAmharic ? "ጅምላ ሻጭ፣ ሀዋሳ" : "Wholesaler, Hawassa",
      image:
        "https://images.unsplash.com/photo-1687422809654-579d81c29d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYnVzaW5lc3MlMjBvd25lcnxlbnwxfHx8fDE3NjIzMzk1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      content: isAmharic
        ? "ከመጠን በላይ ክምችትን ወይም እጥረትን ለማስወገድ ትክክለኛ የፍላጎት ትንበያ ያስፈልገኛል። በብልህነት ለማከማቸት እና ገቢዬን ለማሳደግ የሚረዱኝን የ AI ትንበያዎች በጉጉት እጠብቃለሁ።"
        : "I need accurate demand forecasting to avoid overstocking or running out. Looking forward to AI predictions that will help me stock smarter and grow my revenue.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl text-gray-900 mb-4">
            {t.testimonials.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-xl transition-shadow h-full">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-600">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
