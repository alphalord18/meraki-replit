import { motion } from 'framer-motion';
import { ticketOptions } from '@/lib/data';
import { TicketOption } from '@/lib/types';

const TicketCard = ({ ticket }: { ticket: TicketOption }) => {
  return (
    <motion.div 
      className={`bg-white text-[#0E1F33] rounded-lg shadow-lg overflow-hidden ${
        ticket.isPopular ? 'transform scale-105 z-10' : ''
      }`}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`${ticket.isPopular ? 'bg-[#FF5376]' : 'bg-[#0E1F33]'} text-white p-4 text-center`}>
        <h3 className="text-xl font-semibold">{ticket.title}</h3>
      </div>
      <div className="p-8 text-center">
        <div className="text-4xl font-bold mb-4">${ticket.price}</div>
        {ticket.isPopular && (
          <div className="text-[#FF5376] text-sm font-semibold mb-4">MOST POPULAR</div>
        )}
        <ul className="mb-8 space-y-3">
          {ticket.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <button 
          className={`w-full px-6 py-3 ${
            ticket.buttonStyle === 'primary' ? 'bg-[#06D6A0]' : 'bg-[#FF5376]'
          } text-white rounded-full font-medium hover:bg-opacity-90 transition`}
        >
          Buy Now
        </button>
      </div>
    </motion.div>
  );
};

const Tickets = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="tickets" className="py-20 bg-[#06D6A0] text-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Your Tickets</h2>
          <div className="w-20 h-1 bg-white mx-auto mb-8"></div>
          <p className="text-lg max-w-3xl mx-auto">
            Secure your spot at Meraki Fest 2023 with our range of ticket options.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {ticketOptions.map((ticket) => (
            <motion.div key={ticket.id} variants={itemVariants}>
              <TicketCard ticket={ticket} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Tickets;
