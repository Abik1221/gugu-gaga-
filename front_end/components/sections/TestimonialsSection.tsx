"use client"
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Alemayehu Tadesse",
      role: "Pharmacy Owner, Addis Ababa",
      image: "https://images.unsplash.com/photo-1687422809654-579d81c29d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYnVzaW5lc3MlMjBvd25lcnxlbnwxfHx8fDE3NjIzMzk1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      content: "Mesob AI has completely transformed how I manage my three pharmacy branches. The AI assistant alerts me before I run out of critical medications, and I've reduced waste by 40%. Game-changer!",
      rating: 5
    },
    {
      name: "Meseret Haile",
      role: "Retail Store Chain Manager",
      image: "https://images.unsplash.com/photo-1687422809654-579d81c29d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYnVzaW5lc3MlMjBvd25lcnxlbnwxfHx8fDE3NjIzMzk1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      content: "Managing 7 retail stores was a nightmare before Mesob AI. Now I can see everything in one dashboard, transfer stock between branches, and the supplier marketplace has helped me find better deals. Worth every Birr!",
      rating: 5
    },
    {
      name: "Dawit Kebede",
      role: "Wholesaler, Hawassa",
      image: "https://images.unsplash.com/photo-1687422809654-579d81c29d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYnVzaW5lc3MlMjBvd25lcnxlbnwxfHx8fDE3NjIzMzk1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      content: "The AI forecasting is incredibly accurate. It predicted the spike in demand for school supplies two weeks before it happened, allowing me to stock up. My revenue increased 35% this quarter!",
      rating: 5
    },
    {
      name: "Sara Mohammed",
      role: "Grocery Store Owner, Dire Dawa",
      image: "https://images.unsplash.com/photo-1687422809654-579d81c29d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYnVzaW5lc3MlMjBvd25lcnxlbnwxfHx8fDE3NjIzMzk1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      content: "I was skeptical about AI, but the chat assistant is like having a business consultant available 24/7. It answers all my questions about inventory, gives insights, and helps me make better decisions.",
      rating: 5
    },
    {
      name: "Tesfaye Girma",
      role: "Affiliate Partner",
      image: "https://images.unsplash.com/photo-1687422809654-579d81c29d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYnVzaW5lc3MlMjBvd25lcnxlbnwxfHx8fDE3NjIzMzk1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      content: "I'm earning consistent income through the affiliate program by simply sharing my link with local businesses. The commission structure is fair, and tracking is transparent. Highly recommend!",
      rating: 5
    },
    {
      name: "Hanna Assefa",
      role: "Supermarket Manager, Bahir Dar",
      image: "https://images.unsplash.com/photo-1687422809654-579d81c29d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYnVzaW5lc3MlMjBvd25lcnxlbnwxfHx8fDE3NjIzMzk1NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      content: "The Google Sheets integration saved us so much time. We were manually entering data for hours each day. Now everything syncs automatically. The platform paid for itself in the first month!",
      rating: 5
    }
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
            Trusted by <span className="text-emerald-600">Ethiopian Business Owners</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hundreds of successful businesses already using Mesob AI
            to streamline their operations and grow their revenue.
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
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-600">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
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
