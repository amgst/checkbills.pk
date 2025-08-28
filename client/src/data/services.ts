export const billServices = [
  {
    id: "lesco",
    name: "LESCO",
    category: "electricity",
    icon: "⚡",
    url: "https://www.lesco.gov.pk/modules/customerbill/checkbill.asp"
  },
  {
    id: "ssgc",
    name: "SSGC",
    category: "gas",
    icon: "🔥",
    url: "https://www.ssgc.com.pk/"
  },
  {
    id: "jazz",
    name: "Jazz",
    category: "mobile",
    icon: "📱",
    url: "https://www.jazz.com.pk/"
  },
  {
    id: "ptcl",
    name: "PTCL",
    category: "internet",
    icon: "🌐",
    url: "https://www.ptcl.com.pk/"
  }
];

export const getBillServices = () => billServices;

export const getBillServicesByCategory = (category: string) => 
  billServices.filter(service => service.category === category);

export const getBillService = (id: string) => 
  billServices.find(service => service.id === id);