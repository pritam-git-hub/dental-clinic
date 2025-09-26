// All 21 services from PDF - exact text matching
export const services = [
  "General Dentistry",
  "Dental Implants", 
  "Invisalign Orthodontics",
  "Cosmetic Dentistry",
  "Child Dentistry",
  "Full Mouth Rehabilitation",
  "Maxillofacial Surgeries",
  "Maxillofacial Prosthetics",
  "Conservative Dentistry",
  "Teeth Whitening",
  "Periodontal Dentistry",
  "Master Dental Check",
  "Dental Jewellery",
  "Laser Dentistry",
  "Laminate Veneers",
  "Crown & Bridges",
  "Root Canal Treatment",
  "Artificial Dentures",
  "Smile Design",
  "Geriatric dentistry",
  "Painless Dentistry"
];

// Services grouped for UI display (preserving exact names)
export const serviceGroups = [
  {
    id: "general-preventive",
    title: "General & Preventive",
    items: [
      { name: "General Dentistry", benefit: "Comprehensive oral health assessment and routine care" },
      { name: "Master Dental Check", benefit: "Thorough examination to detect issues early" },
      { name: "Painless Dentistry", benefit: "Advanced techniques ensuring comfortable treatment experience" }
    ]
  },
  {
    id: "restorative-prosthodontics", 
    title: "Restorative & Prosthodontics",
    items: [
      { name: "Crown & Bridges", benefit: "Restore damaged teeth with natural-looking replacements" },
      { name: "Root Canal Treatment", benefit: "Save infected teeth with painless endodontic therapy" },
      { name: "Artificial Dentures", benefit: "Custom-fitted prosthetics for missing teeth replacement" },
      { name: "Full Mouth Rehabilitation", benefit: "Complete restoration of oral function and aesthetics" }
    ]
  },
  {
    id: "cosmetic-smile",
    title: "Cosmetic & Smile", 
    items: [
      { name: "Smile Design", benefit: "Personalized treatment plan for your perfect smile" },
      { name: "Teeth Whitening", benefit: "Professional brightening for a confident smile" },
      { name: "Laminate Veneers", benefit: "Ultra-thin porcelain shells for smile transformation" },
      { name: "Dental Jewellery", benefit: "Safe and stylish tooth gems and accessories" },
      { name: "Cosmetic Dentistry", benefit: "Aesthetic treatments for beautiful smiles" }
    ]
  },
  {
    id: "specialty-care",
    title: "Specialty Care",
    items: [
      { name: "Dental Implants", benefit: "Permanent tooth replacement with titanium implants" },
      { name: "Invisalign Orthodontics", benefit: "Clear aligners for discreet teeth straightening" },
      { name: "Periodontal Dentistry", benefit: "Specialized gum disease treatment and prevention" },
      { name: "Conservative Dentistry", benefit: "Tooth-preserving treatments with minimal intervention" }
    ]
  },
  {
    id: "surgery-advanced",
    title: "Surgery & Advanced",
    items: [
      { name: "Maxillofacial Surgeries", benefit: "Complex oral and facial surgical procedures" },
      { name: "Maxillofacial Prosthetics", benefit: "Specialized prosthetics for facial reconstruction" },
      { name: "Laser Dentistry", benefit: "Precise, minimally invasive laser treatments" },
      { name: "Child Dentistry", benefit: "Gentle, specialized care for young patients" },
      { name: "Geriatric dentistry", benefit: "Comprehensive dental care for senior patients" }
    ]
  }
];
