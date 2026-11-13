// Visual + educational metadata layered on top of the extracted curriculum text.
export type ChapterMeta = {
  n: number;
  short: string;
  tagline: string;
  hue: number; // 0-360 accent
  icon: string; // lucide icon name
  objectives: string[];
  pearls: string[];
};

export const CHAPTER_META: ChapterMeta[] = [
  {
    n: 1, short: "Growth & Development", tagline: "How children grow, mature and reach their milestones", hue: 172, icon: "Ruler",
    objectives: ["Interpret anthropometry, percentile charts and Z-scores", "Describe fontanelle closure, dentition and bone-age milestones", "Recognise red flags and apply developmental screening tools"],
    pearls: ["Weight is the earliest measurement affected by malnutrition; length only after >6 months of insult.", "After age 2 years: height (cm) = age × 5 + 80.", "Upper:lower segment ratio falls from 1.7:1 at birth to 1:1 after 12 years."],
  },
  {
    n: 2, short: "Behavior & Psychology", tagline: "Autism, ADHD, elimination and feeding disorders", hue: 285, icon: "Brain",
    objectives: ["Recognise core features of ASD and ADHD", "Differentiate primary vs secondary enuresis and encopresis", "Counsel parents on colic, pica and food refusal"],
    pearls: ["ASD = social-communication deficit + restricted, repetitive behaviour.", "Colic follows the rule of 3s: >3 h/day, >3 days/week, >3 weeks.", "Pica may signal iron or zinc deficiency and lead poisoning."],
  },
  {
    n: 3, short: "Nutrition", tagline: "Breast milk, malnutrition, vitamins and obesity", hue: 38, icon: "Apple",
    objectives: ["Explain benefits and contraindications of breastfeeding", "Classify and manage protein-energy malnutrition", "Diagnose vitamin deficiency syndromes, rickets and tetany"],
    pearls: ["Kwashiorkor = oedema + fatty liver; marasmus = severe wasting without oedema.", "Exclusive breastfeeding for the first 6 months; complementary feeding thereafter.", "Rickets: widened physis, rachitic rosary, craniotabes, Harrison sulcus."],
  },
  {
    n: 4, short: "Human Genetics", tagline: "Inheritance patterns, karyotypes and syndromes", hue: 320, icon: "Dna",
    objectives: ["Apply patterns of Mendelian inheritance and recurrence risks", "Identify numerical and structural chromosomal abnormalities", "Recognise Down, Turner and Klinefelter syndromes"],
    pearls: ["Autosomal recessive: 25 % recurrence risk per pregnancy.", "Down syndrome: trisomy 21 — most commonly non-disjunction (≈95 %).", "Turner = 45,X; Klinefelter = 47,XXY."],
  },
  {
    n: 5, short: "The Newborn Infant", tagline: "Neonatal care, resuscitation, jaundice and sepsis", hue: 200, icon: "Baby",
    objectives: ["Score the Apgar, assess gestational age and neonatal reflexes", "Manage perinatal asphyxia, seizures and respiratory distress", "Evaluate neonatal infection, anemia, polycythemia and jaundice"],
    pearls: ["Jaundice in the first 24 h is always pathological.", "Surfactant deficiency causes hyaline membrane disease in preterms.", "Hypoglycemia: plasma glucose <45 mg/dL (2.6 mmol/L) in the neonate."],
  },
  {
    n: 6, short: "Immunology", tagline: "Primary and acquired immunodeficiency", hue: 150, icon: "ShieldCheck",
    objectives: ["Classify immunodeficiency disorders", "Apply first-line immunologic testing", "Outline HIV/AIDS in children and management principles"],
    pearls: ["Never give live vaccines in severe T-cell defects.", "Recurrent sinopulmonary infection suggests antibody deficiency.", "Irradiated blood products only in immunodeficiency."],
  },
  {
    n: 7, short: "Allergic Diseases", tagline: "Asthma, anaphylaxis, rhinitis, eczema and food allergy", hue: 95, icon: "Flower2",
    objectives: ["Classify asthma severity and manage acute exacerbations", "Treat status asthmaticus stepwise", "Differentiate allergic emergencies and organ-specific allergy"],
    pearls: ["Adrenaline IM is first-line in anaphylaxis.", "Inhaled β2-agonist is the reliever; ICS is the controller of choice.", "Cow's milk, egg and peanut are the commonest food allergens."],
  },
  {
    n: 8, short: "Rheumatology", tagline: "JIA, SLE, HSP, Kawasaki disease and FMF", hue: 12, icon: "Bone",
    objectives: ["Diagnose JIA subtypes and systemic lupus (ACR criteria)", "Recognise HSP and Kawasaki disease early", "Approach the limping child"],
    pearls: ["Kawasaki disease: fever ≥5 days + 4/5 principal features; treat with IVIG + aspirin.", "HSP: palpable purpura, arthritis, abdominal pain, nephritis.", "Echocardiography is mandatory in Kawasaki disease."],
  },
  {
    n: 9, short: "Infectious Diseases", tagline: "Exanthems, bacterial & viral infections, TB, parasites, vaccines", hue: 355, icon: "Bug",
    objectives: ["Differentiate acute exanthematous diseases", "Manage meningitis, typhoid, pertussis, diphtheria and TB", "Apply the national immunization schedule"],
    pearls: ["Koplik spots are pathognomonic of measles.", "Diphtheria antitoxin must not wait for culture.", "Bacterial meningitis CSF: neutrophils, ↑ protein, ↓ glucose."],
  },
  {
    n: 10, short: "Gastrointestinal", tagline: "Gastroenteritis, dehydration, malabsorption, hepatomegaly", hue: 55, icon: "Utensils",
    objectives: ["Assess dehydration and choose WHO plan A/B/C", "Approach chronic diarrhea and malabsorption", "Differentiate causes of hepatomegaly and hepatosplenomegaly"],
    pearls: ["Low-osmolarity ORS and zinc reduce diarrheal morbidity.", "Plan C: IV fluids for severe dehydration.", "Coeliac disease: anti-tTG with villous atrophy."],
  },
  {
    n: 11, short: "Respiratory System", tagline: "Croup, bronchiolitis, pneumonia and pleural disease", hue: 190, icon: "Wind",
    objectives: ["Distinguish upper from lower airway symptoms", "Treat croup, bronchiolitis and pneumonia", "Approach the wheezy infant"],
    pearls: ["Steeple sign = croup; thumb sign = epiglottitis.", "RSV is the commonest cause of bronchiolitis.", "Tachypnea cut-offs are age-specific."],
  },
  {
    n: 12, short: "Cardiovascular", tagline: "Rheumatic fever and infective endocarditis", hue: 350, icon: "HeartPulse",
    objectives: ["Apply revised Jones criteria", "Prevent rheumatic recurrences with benzathine penicillin", "Diagnose infective endocarditis (Duke criteria)"],
    pearls: ["ARF follows GABHS pharyngitis by 2–4 weeks.", "Carditis is the only manifestation that leaves permanent damage.", "Secondary prophylaxis: benzathine penicillin G every 3–4 weeks."],
  },
  {
    n: 13, short: "Hematology", tagline: "Anemias, hemoglobinopathies, spleen and bleeding disorders", hue: 8, icon: "Droplets",
    objectives: ["Interpret CBC and classify anemia", "Manage thalassemia, sickle cell disease and G6PD deficiency", "Approach bleeding disorders: ITP, hemophilia, vWD and DIC"],
    pearls: ["Iron deficiency: ↓ MCV, ↓ ferritin, ↑ RDW.", "Hemophilia A = factor VIII; B = factor IX (X-linked recessive).", "ITP: isolated thrombocytopenia after viral illness."],
  },
  {
    n: 14, short: "Oncology", tagline: "Leukemia, lymphoma and solid tumors of childhood", hue: 268, icon: "Ribbon",
    objectives: ["Recognise ALL at presentation and its prognostic groups", "Distinguish Hodgkin from non-Hodgkin lymphoma", "Identify neuroblastoma, Wilms tumor and retinoblastoma"],
    pearls: ["ALL is the commonest childhood cancer.", "Leukocoria (white pupillary reflex) → retinoblastoma.", "Wilms tumor: asymptomatic abdominal mass; do not palpate repeatedly."],
  },
  {
    n: 15, short: "Nephrology", tagline: "Hematuria, proteinuria and nephrotic syndrome", hue: 215, icon: "Filter",
    objectives: ["Localise the source of hematuria", "Quantify proteinuria", "Manage nephrotic syndrome and its relapses"],
    pearls: ["Minimal change disease responds to prednisolone 2 mg/kg/day.", "Nephrotic range: >40 mg/m²/h or UPCR >2 mg/mg.", "Complications: infection, thrombosis, hyperlipidemia."],
  },
  {
    n: 16, short: "Endocrine", tagline: "Short stature and growth disorders", hue: 130, icon: "Gauge",
    objectives: ["Define short stature", "Differentiate familial from constitutional delay", "Direct work-up of pathological causes"],
    pearls: ["Familial short stature: normal growth velocity, bone age = chronological age.", "Constitutional delay: delayed bone age, late puberty, final height normal.", "Height <3rd percentile is short stature."],
  },
  {
    n: 17, short: "Nervous System", tagline: "Hydrocephalus, microcephaly and cerebral palsy", hue: 245, icon: "Network",
    objectives: ["Differentiate macrocephaly from hydrocephalus", "Evaluate microcephaly", "Classify cerebral palsy and its causes"],
    pearls: ["Setting-sun sign and bulging fontanelle suggest raised ICP.", "Spastic CP is the commonest type.", "Microcephaly: HC more than 2 SD below the mean."],
  },
  {
    n: 18, short: "Inborn Errors of Metabolism", tagline: "Metabolic emergencies and screening", hue: 305, icon: "FlaskConical",
    objectives: ["Suspect IEM in a sick neonate", "Order first-line metabolic investigations", "Know classic examples (PKU, galactosemia, GSD)"],
    pearls: ["PKU: phenylalanine hydroxylase deficiency; restrict dietary phenylalanine.", "Galactosemia: avoid lactose; E. coli sepsis risk.", "GSD Ia: hypoglycemia + hepatomegaly; give cornstarch."],
  },
  {
    n: 19, short: "Pediatric Emergencies", tagline: "BLS, PALS, drowning, burns and poisoning", hue: 18, icon: "Siren",
    objectives: ["Perform pediatric BLS (C-A-B)", "Manage arrhythmias and advanced life support", "Treat burns and common poisonings with correct antidotes"],
    pearls: ["Compression : ventilation = 15:2 for two rescuers.", "Paracetamol → N-acetylcysteine; organophosphates → atropine.", "Rule of nines is adjusted for the child's larger head."],
  },
];

export const metaFor = (n: number) => CHAPTER_META[n - 1];
