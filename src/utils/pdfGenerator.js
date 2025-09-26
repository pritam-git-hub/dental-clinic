import { jsPDF } from 'jspdf';

// PDF generation utility for dental clinic brochure
export const generateBrochurePDF = () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Colors matching the brand
  // const primaryBlue = '#3B4F9A';
  
  // Page 1 - Header and Basic Info
  pdf.setFillColor(59, 79, 154); // Primary blue
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  // Logo area (placeholder)
  pdf.setFillColor(255, 255, 255);
  pdf.circle(25, 20, 8, 'F');
  pdf.setTextColor(59, 79, 154);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DA', 22, 23);
  
  // Main title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text("DR. GANDHI'S", 45, 18);
  pdf.setTextColor(245, 166, 35); // Orange
  pdf.text('DENTAL AVENUE', 45, 28);
  
  // Tagline
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('One stop solution for all your dental needs!', 45, 35);
  
  // Contact Information
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Dental Avenue @ Disha Eye Hospital (New Town)', 20, 55);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('7th Floor, Premises No. 29, Street No 327, Plot No - DG – 20/22,', 20, 62);
  pdf.text('Action Area 1D, New Town, Kolkata – 700156', 20, 68);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Clinic Timings: 9 AM to 5 PM', 20, 78);
  
  // Phone numbers
  pdf.setFillColor(245, 166, 35); // Orange background
  pdf.rect(20, 85, 170, 15, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BOOK AN APPOINTMENT', 85, 95);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('+91 9051864455  |  +91 9830032088', 55, 110);
  
  // Our Doctors Section
  pdf.setFillColor(59, 79, 154);
  pdf.rect(20, 120, 80, 120, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Our Doctors', 35, 135);
  
  const doctors = [
    { name: 'Dr. Udey Vir Gandhi', role: 'Consultant Prosthodontist', cred: 'BDS, MDS (Cal), PGDHHM' },
    { name: 'Dr. Nipa Gandhi', role: 'Dental Surgeon & Laser Specialist', cred: 'BDS (Cal), PGDHHM' },
    { name: 'Dr Manas De', role: 'Oral & Maxillofacial Surgeon', cred: 'MDS (Perio, Cal). FDSRCS (Eng)' },
    { name: 'Dr. Angshuman Bhattacharya', role: 'Consultant Orthodontist', cred: 'BDS, MDS (AIIMS), DNB' },
    { name: 'Dr. Manela Shill', role: 'Consultant Prosthodontist & Implantologist', cred: 'BDS, MDS (UP)' },
    { name: 'Dr. Sourav Kirtania', role: 'Consultant Endodontist', cred: 'BDS, MDS (WBUHS)' }
  ];
  
  let yPos = 145;
  pdf.setFontSize(8);
  doctors.forEach((doctor, index) => {
    if (yPos > 230) return; // Don't overflow page
    pdf.setFont('helvetica', 'bold');
    pdf.text(doctor.name, 25, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(doctor.cred, 25, yPos + 3);
    pdf.text(doctor.role, 25, yPos + 6);
    yPos += 12;
  });
  
  // Add new page for services
  pdf.addPage();
  
  // Services Section
  pdf.setFillColor(59, 79, 154);
  pdf.rect(0, 0, pageWidth, 30, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Services Offered', 20, 20);
  
  const services = [
    'General Dentistry', 'Smile Design', 'Maxillofacial Prosthetics',
    'Dental Implants', 'Geriatric dentistry', 'Conservative Dentistry',
    'Invisalign Orthodontics', 'Artificial Dentures', 'Dental Hygiene Tips',
    'Cosmetic Dentistry', 'Laser Dentistry', 'Teeth Whitening',
    'Full Mouth Rehabilitation', 'Laminate Veneers', 'Periodontal Dentistry',
    'Maxillofacial Surgeries', 'Crown & Bridges', 'Master Dental Check',
    'Child Dentistry', 'Root Canal Treatment', 'Dental Jewellery',
    'Painless Dentistry'
  ];
  
  // Services in 3 columns
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const cols = 3;
  const colWidth = (pageWidth - 40) / cols;
  let currentCol = 0;
  let currentRow = 0;
  
  services.forEach((service, index) => {
    const x = 20 + (currentCol * colWidth);
    const y = 45 + (currentRow * 8);
    
    // Checkmark
    pdf.setTextColor(0, 128, 0);
    pdf.text('✓', x, y);
    pdf.setTextColor(0, 0, 0);
    pdf.text(service, x + 5, y);
    
    currentCol++;
    if (currentCol >= cols) {
      currentCol = 0;
      currentRow++;
    }
  });
  
  // Highlights Section
  pdf.setFillColor(59, 79, 154);
  pdf.rect(20, 140, pageWidth - 40, 20, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Highlights', 25, 153);
  
  const highlights = [
    'Painless Dentistry',
    'Modern Techniques and Equipment',
    'Comprehensive Preventive Care',
    'Over 20 Years of Experience',
    'Convenient Clinic Timings',
    'Management of Dental Emergencies',
    'Well Trained and Ethical Doctors',
    'Standardized Sterilization',
    'Friendly Staff',
    'Comfortable and Hygienic Environment'
  ];
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  let highlightY = 170;
  const highlightCols = 2;
  const highlightColWidth = (pageWidth - 40) / highlightCols;
  let highlightCol = 0;
  let highlightRow = 0;
  
  highlights.forEach((highlight, index) => {
    const x = 20 + (highlightCol * highlightColWidth);
    const y = highlightY + (highlightRow * 8);
    
    pdf.text('•', x, y);
    pdf.text(highlight, x + 5, y);
    
    highlightCol++;
    if (highlightCol >= highlightCols) {
      highlightCol = 0;
      highlightRow++;
    }
  });
  
  // Branches Section
  pdf.setFillColor(245, 166, 35); // Orange
  pdf.rect(20, 220, pageWidth - 40, 25, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Our Branches', 25, 235);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('• Lansdowne Paddapukur, Kolkata', 25, 250);
  pdf.text('• Medica Superspeciality Hospital, Kolkata', 25, 257);
  pdf.text('• Sunny Enclave, Mohali, Punjab', 25, 264);
  
  // Footer
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('www.drgandhis.in', 25, 275);
  pdf.text('dentalavenue14@gmail.com', 120, 275);
  
  return pdf;
};

export const downloadBrochurePDF = () => {
  try {
    const pdf = generateBrochurePDF();
    pdf.save('Dr-Gandhis-Dental-Avenue-Brochure.pdf');
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
