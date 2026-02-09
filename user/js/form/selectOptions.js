export const SelectOptions = {
  item: [
    "Server (System Unit)", "Thin Client Server(Set)", "Server (Bundle)",
    "Desktop (Package)", "Laptop", "2-in-1 Tablet", "Tablet", "Smartphone",
    "External Hard Drive", "USB Flash Drive", "Smart TV", "Standard TV",
    "Monitor", "CPU", "Keyboard", "Mouse", "Trackpad", "Stylus", "Signature pad",
    "Power Generator", "UPS", "AVR", "Charging Cart", "Software Licenses",
    "Rack Cabinet", "Pocket Wifi", "Mobile Broadband USB Stick", "Modem / Router",
    "Access Point", "Dish (Satellite Internet Communication System)",
    "Network Switch", "Firewall Appliance", "Bluetooth / Wi-Fi Adapter",
    "Docking Station / USB Hub", "PABX", "Fax Machine", "Computer Table",
    "Printer", "Scanner", "Copier / Xerox Machine", "Multifunction Printer",
    "Biometric Readers", "Barcode or QR Scanner", "Microphone", "Lapel",
    "Speakers", "Headset with Microphone", "Webcam", "Digital Camera",
    "Voice Recorder", "Document Camera / Visualizers",
    "Interactive Whiteboards / Smartboards", "DVD Player", "Projector",
    "Projector Screen", "Laser Pointer", "Network Cable Tester",
    "Cables Adaptor", "Power Cords", "Extension Cords",
    "USB Charger", "Power Bank"
  ],

  uom: [
    { value: 1, label: "pcs" },
    { value: 2, label: "set (bundle)" },
    { value: 3, label: "lot" }
  ],

  brand: [
    { value: 1, label: "Acer" }, { value: 2, label: "Adobe" }, { value: 3, label: "Amazon" },
    { value: 4, label: "AMD" }, { value: 5, label: "Apple" }, { value: 6, label: "Asus" },
    { value: 7, label: "BenQ" }, { value: 8, label: "Brother" }, { value: 9, label: "Canon" },
    { value: 10, label: "Cisco" }, { value: 11, label: "Dell" }, { value: 12, label: "Epson" },
    { value: 13, label: "HP (Hewlett-Packard)" }, { value: 14, label: "Huawei" }, { value: 15, label: "IBM" },
    { value: 16, label: "Intel" }, { value: 17, label: "Lenovo" }, { value: 18, label: "LG" },
    { value: 19, label: "Logitech" }, { value: 20, label: "Microsoft" }, { value: 21, label: "MSI" },
    { value: 22, label: "Netgear" }, { value: 23, label: "NVIDIA" }, { value: 24, label: "Panasonic" },
    { value: 25, label: "Samsung" }, { value: 26, label: "Seagate" }, { value: 27, label: "Sony" },
    { value: 28, label: "TP-Link" }, { value: 29, label: "Western Digital(WD)" },
    { value: 30, label: "Xerox" }, { value: 31, label: "Xiaomi" }, { value: 32, label: "Others" }
  ],

  nonDCP: [{ value: "✓", label: "✓" }],

  dcpPackage: [
    "E-Textbooks", "eLearning Cart Package", "G4-G6 ICT Package",
    "IT Equipment", "JHS/SHS ICT Package", "Laptop for Teaching",
    "Laptop for Non-Teaching", "Multimedia Package", "Smart TV Package"
  ],

  category: [
    { value: 1, label: "Low-Value" },
    { value: 2, label: "High-Value" }
  ],

  classification: [
    { value: 1, label: "Office, ICT Equipment, Furniture & Fixtures" }
  ],

  modeAcquisition: [
    { value: "DepEd Purchase", label: "DepEd Purchase" },
    { value: "Donation", label: "Donation" },
    { value: "Grant", label: "Grant" }
  ],

  sourceAcquisition: [
    "Central Office", "Regional Office", "School Division Office", "School",
    "Local Government Unit (LGU)", "Private Corporation",
    "Non-Governmental Organization (NGO)", "DICT",
    "Other National Government Agency", "Parent Teacher's Association"
  ],

  sourceFunds: [
    { value: "Program Support Funds", label: "Program Support Funds" },
    { value: "General Fund", label: "General Fund" },
    { value: "School Education Fund", label: "School Education Fund" },
    { value: "Trust Fund", label: "Trust Fund" },
    { value: "Not Applicable", label: "Not Applicable" }
  ],

  allotmentClass: [
    "Personal Services (PS)",
    "Maintenance and Other Operating Expenses (MOOE)",
    "Capital Outlay (CO)",
    "Not Applicable"
  ],

  supportDocs: [
    "Sales Invoice (SI)", "Official Receipt (OR)", "Delivery Receipt (DR)",
    "Inspection Acceptance Report (IAR)",
    "Property Acknowledgement Receipt (PAR)",
    "Inventory Custodian Slip (ICS)",
    "Return and Receipt of Property/Equipment (RRPE)",
    "Waste Material Report (WMR)"
  ],

  transactionType: [
    "Delivery", "Inspection", "Beginning Inventory",
    "Issuance/Transfer", "Return", "Disposal", "Stock Position"
  ],

  supportDocs2: [
    "Sales Invoice (SI)", "Official Receipt (OR)", "Delivery Receipt (DR)",
    "Inspection Acceptance Report (IAR)",
    "Report of Receipt and Stock Position",
    "Property Acknowledgement Receipt (PAR)",
    "Inventory Custodian Slip (ICS)",
    "Return and Receipt of Property/Equipment (RRPE)",
    "Waste Material Report (WMR)"
  ],

  warranty: [{ value: "✓", label: "✓" }],
  nonFunctional: [{ value: "✓", label: "✓" }],
  condition: ["Serviceable", "For Repair", "Unserviceable", "Not Applicable"],
  disposition: [
    "Normal", "Transferred", "Stolen", "Lost",
    "Damaged due to calamity", "For Disposal", "Disposed", "Donated"
  ]
};
