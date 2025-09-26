// All doctors from PDF in exact order with precise credentials and roles
export const doctors = [
  {
    id: "dr-udey-gandhi",
    name: "Dr. Udey Vir Gandhi",
    credentials: "BDS, MDS (Cal), PGDHHM",
    role: "Consultant Prosthodontist",
    department: "prosthodontics",
    featured: true
  },
  {
    id: "dr-nipa-gandhi", 
    name: "Dr. Nipa Gandhi",
    credentials: "BDS (Cal), PGDHHM",
    role: "Dental Surgeon & Laser Specialist",
    department: "laser",
    featured: true
  },
  {
    id: "dr-manas-de",
    name: "Dr Manas De",
    credentials: "MDS (Perio, Cal). FDSRCS (Eng)",
    role: "Oral & Maxillofacial Surgeon",
    department: "surgery"
  },
  {
    id: "dr-angshuman-bhattacharya",
    name: "Dr. Angshuman Bhattacharya", 
    credentials: "BDS, MDS (AIIMS), DNB",
    role: "Consultant Orthodontist",
    department: "orthodontics"
  },
  {
    id: "dr-manela-shill",
    name: "Dr. Manela Shill",
    credentials: "BDS, MDS (UP)",
    role: "Consultant Prosthodontist & Implantologist",
    department: "implants"
  },
  {
    id: "dr-sourav-kirtania",
    name: "Dr. Sourav Kirtania",
    credentials: "BDS, MDS (WBUHS)",
    role: "Consultant Endodontist",
    department: "endodontics"
  },
  {
    id: "dr-sanchaita-chowdhury",
    name: "Dr Sanchaita Chowdhury",
    credentials: "BDS (Cal)",
    role: "Consultant Dental Surgeon",
    department: "general"
  },
  {
    id: "dr-abhisikta-ghosh",
    name: "Dr. Abhisikta Ghosh",
    credentials: "BDS, MDS (WBUHS)",
    role: "Consultant Paedodontist",
    department: "pediatric"
  },
  {
    id: "dr-kumarjyoti-chatterjee",
    name: "Dr KumarJyoti Chatterjee",
    credentials: "BDS, PGCE",
    role: "Dental Surgeon",
    department: "general"
  },
  {
    id: "dr-amrita-das",
    name: "Dr Amrita Das",
    credentials: "B.D.S(WBUHS), MPH (U.K.), FAGE",
    role: "Dental Surgeon",
    department: "general"
  },
  {
    id: "dr-anant-pal-singh",
    name: "Dr Anant Pal Singh",
    credentials: "BDS",
    role: "Dental Surgeon",
    department: "general"
  },
  {
    id: "dr-tanushree-bera",
    name: "Dr. Tanushree Bera",
    credentials: "BDS, MDS",
    role: "Consultant Periodontist",
    department: "periodontics"
  },
  {
    id: "dr-divya-chadda",
    name: "Dr. Divya Chadda",
    credentials: "BDS, MDS (Cal), FAOMSI (OGS)",
    role: "Consultant Oral & Maxillofacial Surgeon",
    department: "surgery"
  },
  {
    id: "dr-neelam-chatterjee",
    name: "Dr. Neelam Chatterjee",
    credentials: "BDS, MDS; Consultant Periodontist",
    role: "Consultant Periodontist",
    department: "periodontics"
  }
];

// Featured doctors (first 2)
export const featuredDoctors = doctors.filter(doctor => doctor.featured);

// All other doctors
export const teamDoctors = doctors.filter(doctor => !doctor.featured);
