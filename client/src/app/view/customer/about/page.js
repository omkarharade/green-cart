// about/page.js
import Image from 'next/image';


export default function About() {
  const subscriptionPlans = [
    {
      name: "Basic Box",
      description: "A simple and affordable option.",
      validity: "Single Purchase Type",
      recurringOrder: "One-time purchase",
      price: "999.00",
    },
    {
      name: "Deluxe Box",
      description: "A curated selection of premium products.",
      validity: "6 Months",
      recurringOrder: "Every 14 Days",
      price: "1999.00",
    },
    {
      name: "Family Box",
      description: "Essentials for the whole family.",
      validity: "6 Months",
      recurringOrder: "Every Month",
      price: "1499.00",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">About GreenLiving</h1>

      <div className="flex flex-col md:flex-row gap-8"> {/* Responsive flex container */}
        <div className="md:w-1/2"> {/* Image container */}
          <Image
            src="/images/care1.jpg"
            alt="GreenLiving Image"
            width={500}  // Set explicit width and height
            height={300}
          />
        </div>

        <div className="md:w-1/2"> {/* Text content container */}
          <p className="mb-4">
            GreenLiving is your go-to source for eco-conscious living. We offer a
            variety of resources and tools to help you make sustainable choices.
            Explore our eco-friendly products, informative articles, and
            community forum.
          </p>


          <h2 className="text-2xl font-semibold mb-4">Our Subscription Boxes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <div key={plan.name} className="border rounded-lg p-4 shadow-md">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p>{plan.description}</p>
                <p>Validity: {plan.validity}</p>
                <p>Recurring Order: {plan.recurringOrder}</p>
                <p className="font-bold">₹{plan.price}</p>
              </div>
            ))}
          </div>


        </div>
      </div>
    </div>
  );
}
