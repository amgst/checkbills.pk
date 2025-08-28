export const BILL_CATEGORIES = {
  electricity: {
    name: "Electricity",
    icon: "fas fa-bolt",
    color: "text-yellow-500",
  },
  gas: {
    name: "Gas",
    icon: "fas fa-fire",
    color: "text-orange-500",
  },
  mobile: {
    name: "Mobile",
    icon: "fas fa-mobile-alt",
    color: "text-blue-500",
  },
  internet: {
    name: "Internet",
    icon: "fas fa-wifi",
    color: "text-purple-500",
  },
  water: {
    name: "Water",
    icon: "fas fa-tint",
    color: "text-blue-400",
  },
  other: {
    name: "Other Services",
    icon: "fas fa-cogs",
    color: "text-gray-500",
  },
} as const;

export const ELECTRICITY_PROVIDERS = [
  "LESCO", "FESCO", "MEPCO", "IESCO", "GEPCO", "HESCO", "SEPCO", "TESCO"
] as const;

export const GAS_PROVIDERS = [
  "SNGPL", "SSGCL"
] as const;

export const MOBILE_PROVIDERS = [
  "Jazz", "Telenor", "Zong", "Ufone"
] as const;

export const INTERNET_PROVIDERS = [
  "PTCL", "Jazz", "Telenor", "Zong", "Ufone", "StormFiber", "Nayatel"
] as const;

export const WATER_PROVIDERS = [
  "WASA Lahore", "WASA Karachi", "WASA Islamabad", "WASA Faisalabad"
] as const;

export const OTHER_SERVICES = [
  "Vehicle Registration", "Traffic Challan", "Property Tax"
] as const;

export function formatCurrency(amount: number): string {
  return `PKR ${amount.toLocaleString()}`;
}

export function formatBillNumber(billNumber: string): string {
  // Remove any non-alphanumeric characters and format consistently
  return billNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

export function validateBillNumber(billNumber: string, provider: string): boolean {
  // Basic validation - can be extended based on provider-specific formats
  const cleanNumber = formatBillNumber(billNumber);
  
  if (cleanNumber.length < 6) {
    return false;
  }
  
  // Provider-specific validation can be added here
  switch (provider) {
    case "LESCO":
      return cleanNumber.length >= 10 && cleanNumber.length <= 14;
    case "FESCO":
      return cleanNumber.length >= 10 && cleanNumber.length <= 14;
    default:
      return cleanNumber.length >= 6;
  }
}
