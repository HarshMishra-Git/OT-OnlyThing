import { Truck, Shield, Headphones, Award } from 'lucide-react';

export default function TrustBar({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over ₹500',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure processing',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated support team',
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: 'Premium products',
    },
  ];

  const isDark = variant === 'dark';
  const sectionClasses = isDark
    ? 'bg-black text-white border-y-2 border-white py-12'
    : 'bg-paper text-black border-y-2 border-black py-12';
  const iconBoxClasses = isDark
    ? 'inline-flex items-center justify-center w-16 h-16 border-2 border-white mb-4 transition-colors group-hover:bg-white'
    : 'inline-flex items-center justify-center w-16 h-16 border-2 border-black mb-4 transition-colors group-hover:bg-black';
  const iconClasses = isDark
    ? 'w-8 h-8 text-white transition-colors group-hover:text-black'
    : 'w-8 h-8 transition-colors group-hover:text-white';
  const descClasses = isDark ? 'text-sm text-white' : 'text-sm text-gray-600';
  const headingClasses = isDark
    ? 'text-lg font-bold mb-2 uppercase tracking-wide text-white'
    : 'text-lg font-bold mb-2 uppercase tracking-wide text-black';

  return (
    <section className={sectionClasses}>
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className={iconBoxClasses}>
                <feature.icon className={iconClasses} />
              </div>
              <h3 className={headingClasses}>
                {feature.title}
              </h3>
              <p className={descClasses}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}