// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { motion, Variants, useReducedMotion } from "framer-motion";
// export default function Features() {
//   const reduceMotion = useReducedMotion();

//   const listVariants: Variants = {
//     hidden: {},
//     visible: {
//       transition: {
//         staggerChildren: 0.12,
//         delayChildren: 0.12,
//       },
//     },
//   };

//   const itemVariants: Variants = {
//     hidden: { opacity: 0, y: 12 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.45, ease: "easeOut" },
//     },
//   };

//   return (
//     <div
//       className="h-screen flex flex-col justify-center max-w-5xl mx-auto"
//       id="features"
//     >
//       <h3 className="text-2xl font-bold text-emerald-700 mb-12 text-center">
//         Features
//       </h3>
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <motion.div
//           // Parent controls stagger; if user prefers reduced motion, start visible immediately
//           initial={reduceMotion ? "visible" : "hidden"}
//           whileInView="visible"
//           variants={listVariants}
//           className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
//         >
//           <motion.div variants={itemVariants}>
//             <Card className="bg-white">
//               <CardHeader>
//                 <CardTitle className="text-lg text-emerald-900">
//                   Smart Inventory Management
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-700">
//                   AI predicts stock shortages before they happen and alerts you
//                   about expiring medicines, ensuring you never run out of
//                   essential medications.
//                 </p>
//               </CardContent>
//             </Card>
//           </motion.div>
//           <motion.div variants={itemVariants}>
//             <Card className="bg-white">
//               <CardHeader>
//                 <CardTitle className="text-lg text-emerald-900">
//                   Intelligent Sales Insights
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-700">
//                   Get automated insights on top-selling products, revenue
//                   trends, and customer preferences to make data-driven business
//                   decisions.
//                 </p>
//               </CardContent>
//             </Card>
//           </motion.div>
//           <motion.div variants={itemVariants}>
//             <Card className="bg-white">
//               <CardHeader>
//                 <CardTitle className="text-lg text-emerald-900">
//                   Smart Medicine Search
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-700">
//                   Customers can search medicines using text descriptions or even
//                   images, with intelligent matching to find exactly what they
//                   need.
//                 </p>
//               </CardContent>
//             </Card>
//           </motion.div>
//           <motion.div variants={itemVariants}>
//             <Card className="bg-white">
//               <CardHeader>
//                 <CardTitle className="text-lg text-emerald-900">
//                   Automated Customer Support
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-700">
//                   AI chatbot helps customers find medicines, locate nearby
//                   pharmacies, and get instant answers to their questions 24/7.
//                 </p>
//               </CardContent>
//             </Card>
//           </motion.div>
//           <motion.div variants={itemVariants}>
//             <Card className="bg-white">
//               <CardHeader>
//                 <CardTitle className="text-lg text-emerald-900">
//                   Real-time Business Dashboards
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-700">
//                   Monitor your entire pharmacy operation in real-time with
//                   customizable dashboards that show key performance indicators
//                   at a glance.
//                 </p>
//               </CardContent>
//             </Card>
//           </motion.div>
//           <motion.div variants={itemVariants}>
//             <Card className="bg-white">
//               <CardHeader>
//                 <CardTitle className="text-lg text-emerald-900">
//                   Multi-Branch Management
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-700">
//                   Seamlessly manage multiple pharmacy locations from a single
//                   platform with centralized control and individual branch
//                   insights.
//                 </p>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
import { motion, Variants, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function Features() {
  const reduceMotion = useReducedMotion();

  const listVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.12,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div
      className="md:h-screen flex flex-col justify-center max-w-5xl mx-auto"
      id="features"
    >
      <h3 className="text-2xl font-bold text-emerald-700 mb-12 text-center">
        Features
      </h3>

      <motion.div
        // Parent controls stagger; if user prefers reduced motion, start visible immediately
        initial={reduceMotion ? "visible" : "hidden"}
        whileInView="visible"
        variants={listVariants}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Wrap each Card in a motion.div that uses itemVariants */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-900">
                Unified Integration Hub
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Connect Google Sheets, Zoho Books, Odoo ERP, and Notion in a few
                clicks. OAuth onboarding, token rotation, and staged sync jobs keep
                every data source in lockstep with your inventory operations.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-900">
                AI Inventory Analyst
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Ask the LangGraph-powered assistant anything about sales, stock,
                or staff performance. It runs safe, read-only SQL, adds operational
                notes, and cites provenance so you can act with confidence.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-900">
                Real-Time Admin Command Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Segment businesses by free trial, payment pending, blocked, or
                active. Track tool usage, branches, and users per tenant so your
                back office can intervene before issues become outages.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-900">
                Guided Free-Trial to Pro Upgrade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Trial businesses can explore every pro feature, while upgrade
                prompts lead them straight to payment-code approval. Owners feel the
                value early, and monetisation stays in your control.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-900">
                Role-Aware Automations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Owners manage integrations and the AI, staff run imports, and
                admins oversee everything. Daily chat quotas, tenant scopes, and
                audit trails ensure every automation stays accountable.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-emerald-900">
                Compliance-Ready Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Every sync, payment verification, and credential change is logged
                for audit review. Token storage uses encryption and admins can
                drill into tenant histories in seconds.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
