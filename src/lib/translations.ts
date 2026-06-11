export interface TranslationSet {
  home: string;
  history: string;
  scan: string;
  guide: string;
  profile: string;
  detectProtectGrow: string;
  onSiteDiagnostics: string;
  scanDescription: string;
  newDiagnosis: string;
  activeOutbreaks: string;
  outbreaksDescription: string;
  recentDiagnostics: string;
  openMapLegend: string;
  noDetections: string;
  saveToHistory: string;
  communityFeedback: string;
  feedbackSub: string;
  addFeedback: string;
  writeFeedbackPlaceholder: string;
  submit: string;
  cancel: string;
  adminApproved: string;
  likes: string;
  noFeedback: string;
  cropPathologyGuide: string;
  guideSub: string;
  symptoms: string;
  treatment: string;
  preventive: string;
  adminAccessControl: string;
  adminDashboard: string;
  secured: string;
  regionalLanguage: string;
  activeLanguage: string;
  engineConfig: string;
  v4optimized: string;
  signInWithGoogle: string;
  signOut: string;
  notSignedIn: string;
  welcomeBack: string;
  clearanceL4: string;
  regionalAdmin: string;
  syncStatus: string;
  localCnnDb: string;
  languageSelect: string;
  resultTitle: string;
  resultHeader: string;
  affectedCrop: string;
  riskLevel: string;
  solutionsTitle: string;
  descriptionTitle: string;
  sensorConfidence: string;
  unknownPathogen: string;
}

export const translations: Record<string, TranslationSet> = {
  en: {
    home: "Home",
    history: "History",
    scan: "Scan",
    guide: "Guide",
    profile: "Profile",
    detectProtectGrow: "DETECT. PROTECT. GROW.",
    onSiteDiagnostics: "On-site AI Crop Pathology Diagnostics",
    scanDescription: "Capture leaf anomalies with low latency local scanning",
    newDiagnosis: "New Diagnosis Scan",
    activeOutbreaks: "Active Pathogen Threats",
    outbreaksDescription: "Visualizer map of localized outbreak centers",
    recentDiagnostics: "Recent Diagnostics",
    openMapLegend: "Open Map Legend",
    noDetections: "No active diagnostics registry records captured.",
    saveToHistory: "Save to History",
    communityFeedback: "Community Feedback",
    feedbackSub: "View crop inquiries and tips from other farmers around the region.",
    addFeedback: "Add Feedback",
    writeFeedbackPlaceholder: "Write a question, share crop status or recommend remedies...",
    submit: "Submit",
    cancel: "Cancel",
    adminApproved: "Admin Approved",
    likes: "Likes",
    noFeedback: "Be the first to share your crop health updates or ask questions!",
    cropPathologyGuide: "Crop Pathology Resource Guide",
    guideSub: "Official encyclopedic index of Solanaceae disease symptoms and mitigations",
    symptoms: "Symptoms",
    treatment: "Treatment",
    preventive: "Preventive Measures",
    adminAccessControl: "System Access Control",
    adminDashboard: "Admin Dashboard",
    secured: "Secured",
    regionalLanguage: "Regional Language",
    activeLanguage: "English (Active)",
    engineConfig: "CNN Engine Config",
    v4optimized: "v4.2 Optimized",
    signInWithGoogle: "Sign in with Google",
    signOut: "Sign out",
    notSignedIn: "Please sign in to save data and share community feedback.",
    welcomeBack: "Welcome back",
    clearanceL4: "CLEARANCE: L4",
    regionalAdmin: "REGIONAL ADMIN",
    syncStatus: "Offline High-Performance Sync",
    localCnnDb: "Local CNN Database: active (PlantVillage Sync v4) • 0 SEC LATENCY",
    languageSelect: "Select Your Language",
    resultTitle: "Detect Disease",
    resultHeader: "Result",
    affectedCrop: "Affected Crop",
    riskLevel: "Risk Level",
    solutionsTitle: "Recommended Solutions",
    descriptionTitle: "Description",
    sensorConfidence: "CNN SENSOR CONFIDENCE",
    unknownPathogen: "Pathogen species unknown",
  },
  hi: {
    home: "मुख्य पृष्ठ",
    history: "इतिहास",
    scan: "स्कैन करें",
    guide: "विवरणिका",
    profile: "प्रोफ़ाइल",
    detectProtectGrow: "पहचानें. रक्षा करें. उगाएं।",
    onSiteDiagnostics: "ऑन-साइट एआई फसल रोग निदान",
    scanDescription: "कम समय में पत्ती की असामान्यताओं को कैप्च और स्कैन करें",
    newDiagnosis: "नया निदान स्कैन",
    activeOutbreaks: "सक्रिय रोगज़नक़ खतरे",
    outbreaksDescription: "स्थानीयकृत प्रकोप केंद्रों का नक्शा",
    recentDiagnostics: "हालिया विश्लेषण",
    openMapLegend: "नक्शा विवरण खोलें",
    noDetections: "कोई सक्रिय निदान रिकॉर्ड नहीं मिला।",
    saveToHistory: "इतिहास में सहेजें",
    communityFeedback: "समुदाय प्रतिक्रिया",
    feedbackSub: "क्षेत्र के अन्य किसानों से फसल संबंधी प्रश्न और सुझाव देखें।",
    addFeedback: "प्रतिक्रिया जोड़ें",
    writeFeedbackPlaceholder: "कोई प्रश्न लिखें, फसल की स्थिति साझा करें या उपचार सुझाएं...",
    submit: "प्रस्तुत करें",
    cancel: "रद्द करें",
    adminApproved: "व्यवस्थापक स्वीकृत",
    likes: "पसंद",
    noFeedback: "अपनी फसल अपडेट साझा करने या प्रश्न पूछने वाले पहले व्यक्ति बनें!",
    cropPathologyGuide: "फसल रोग संसाधन गाइड",
    guideSub: "सोलेनेसी रोग के लक्षणों और शमन का आधिकारिक विश्वकोश सूचकांक",
    symptoms: "लक्षण",
    treatment: "उपचार",
    preventive: "निवारक उपाय",
    adminAccessControl: "सिस्टम एक्सेस कंट्रोल",
    adminDashboard: "एडमिन डैशबोर्ड",
    secured: "सुरक्षित",
    regionalLanguage: "क्षेत्रीय भाषा",
    activeLanguage: "हिन्दी (सक्रिय)",
    engineConfig: "सीएनएन इंजन कॉन्फिग",
    v4optimized: "v4.2 अनुकूलित",
    signInWithGoogle: "गूगल से साइन इन करें",
    signOut: "साइन आउट करें",
    notSignedIn: "डेटा सहेजने और प्रतिक्रिया साझा करने के लिए कृपया साइन इन करें।",
    welcomeBack: "आपका स्वागत है",
    clearanceL4: "अनुमति स्तर: L4",
    regionalAdmin: "क्षेत्रीय प्रशासक",
    syncStatus: "ऑफ़लाइन उच्च-प्रदर्शन सिंक",
    localCnnDb: "स्थानीय सीएनएन डेटाबेस: सक्रिय (प्लांटविलेज सिंक v4) • 0 सेकंड विलंबता",
    languageSelect: "अपनी भाषा चुनें",
    resultTitle: "रोग की पहचान",
    resultHeader: "परिणाम",
    affectedCrop: "प्रभावित फसल",
    riskLevel: "जोखिम स्तर",
    solutionsTitle: "अनुशंसित समाधान",
    descriptionTitle: "विवरण",
    sensorConfidence: "सीएनएन सेंसर सटीकता",
    unknownPathogen: "अज्ञात रोगज़नक़ प्रजाति",
  },
  kn: {
    home: "ಮುಖಪುಟ",
    history: "ಇತಿಹಾಸ",
    scan: "ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    guide: "ಮಾರ್ಗದರ್ಶಿ",
    profile: "ಪ್ರೊಫೈಲ್",
    detectProtectGrow: "ಪತ್ತೆ ಮಾಡಿ. ರಕ್ಷಿಸಿ. ಬೆಳೆಸಿ.",
    onSiteDiagnostics: "ಸ್ಥಳದಲ್ಲೇ ಎಐ ಬೆಳೆ ರೋಗ ಪತ್ತೆ ಹಚ್ಚುವಿಕೆ",
    scanDescription: "ಸ್ಥಳೀಯ ಸ್ಕ್ಯಾನಿಂಗ್‌ನೊಂದಿಗೆ ಎಲೆಗಳ ವೈಪರೀತ್ಯಗಳನ್ನು ಸುಲಭವಾಗಿ ಗುರುತಿಸಿ",
    newDiagnosis: "ಹೊಸ ರೋಗ ಪತ್ತೆ ಹಚ್ಚುವಿಕೆ",
    activeOutbreaks: "ಸಕ್ರಿಯ ರೋಗಕಾರಕ ಬೆದರಿಕೆಗಳು",
    outbreaksDescription: "ಸ್ಥಳೀಯ ರೋಗ ಹರಡುವಿಕೆಯ ನಕ್ಷೆ",
    recentDiagnostics: "ಇತ್ತೀಚಿನ ವಿಶ್ಲೇಷಣೆಗಳು",
    openMapLegend: "ನಕ್ಷೆ ವಿವರ ನೋಡಿ",
    noDetections: "ಯಾವುದೇ ಸಕ್ರಿಯ ರೋಗ ಪತ್ತೆಹಚ್ಚುವಿಕೆಯ ದಾಖಲೆಗಳಿಲ್ಲ.",
    saveToHistory: "ಇತಿಹಾಸಕ್ಕೆ ಸೇರಿಸಿ",
    communityFeedback: "ಸಮುದಾಯ ಪ್ರತಿಕ್ರಿಯೆ",
    feedbackSub: "ಪ್ರದೇಶದ ಇತರ ರೈತರಿಂದ ಬೆಳೆ ವಿಚಾರಣೆಗಳು ಮತ್ತು ಸಲಹೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ.",
    addFeedback: "ಪ್ರತಿಕ್ರಿಯೆ ಸೇರಿಸಿ",
    writeFeedbackPlaceholder: "ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ, ಬೆಳೆ ಸ್ಥಿತಿಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ ಅಥವಾ ಪರಿಹಾರಗಳನ್ನು ಸೂಚಿಸಿ...",
    submit: "ಸಲ್ಲಿಸಿ",
    cancel: "ರದ್ದುಮಾಡು",
    adminApproved: "ನಿರ್ವಾಹಕರು ಅನುಮೋದಿಸಿದ್ದಾರೆ",
    likes: "ಲೈಕ್‌ಗಳು",
    noFeedback: "ನಿಮ್ಮ ಬೆಳೆ ಆರೋಗ್ಯದ ನವೀಕರಣಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳುವ ಅಥವಾ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳುವ ಮೊದಲಿಗರಾಗಿರಿ!",
    cropPathologyGuide: "ಬೆಳೆ ರೋಗಶಾಸ್ತ್ರ ಸಂಪನ್ಮೂಲ ಮಾರ್ಗದರ್ಶಿ",
    guideSub: "ಬೆಳೆ ರೋಗದ ಲಕ್ಷಣಗಳು ಮತ್ತು ತಡೆಗಟ್ಟುವ ಕ್ರಮಗಳ ಅಧಿಕೃತ ಸೂಚ್ಯಂಕ",
    symptoms: "ಲಕ್ಷಣಗಳು",
    treatment: "ಚಿಕ್ಸಿತೆ ವಿಧಾನ",
    preventive: "ಮುನ್ನೆಚ್ಚರಿಕೆ ಕ್ರಮಗಳು",
    adminAccessControl: "ಸಿಸ್ಟಮ್ ಪ್ರವೇಶ ನಿಯಂತ್ರಣ",
    adminDashboard: "ನಿರ್ವಾಹಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    secured: "ಸುರಕ್ಷಿತಗೊಳಿಸಲಾಗಿದೆ",
    regionalLanguage: "ಪ್ರಾದೇಶಿಕ ಭಾಷೆ",
    activeLanguage: "ಕನ್ನಡ (ಸಕ್ರಿಯ)",
    engineConfig: "ಸಿಎನ್ಎನ್ ಎಂಜಿನ್ ಕಾನ್ಫಿಗರೇಶನ್",
    v4optimized: "v4.2 ಅತ್ಯುತ್ತಮಗೊಳಿಸಲಾಗಿದೆ",
    signInWithGoogle: "ಗೂಗಲ್ ಪೋರ್ಟಲ್ ಪ್ರವೇಶ",
    signOut: "ಖಾತೆಯಿಂದ ನಿರ್ಗಮಿಸಿ",
    notSignedIn: "ಮಾಹಿತಿ ಉಳಿಸಲು ಮತ್ತು ಸಮುದಾಯದಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಲು ಲಾಗ್ ಇನ್ ಮಾಡಿ.",
    welcomeBack: "ಸ್ವಾಗತ",
    clearanceL4: "ಭದ್ರತಾ ಮಟ್ಟ: L4",
    regionalAdmin: "ಪ್ರಾದೇಶಿಕ ನಿರ್ವಾಹಕ",
    syncStatus: "ಆಫ್‌ಲೈನ್ ಹೈ-ಪರ್ಫಾರ್ಮೆನ್ಸ್ ಸಿಂಕ್",
    localCnnDb: "ಸ್ಥಳೀಯ ಸಿಎನ್ಎನ್ ಡೇಟಾಬೇಸ್: ಸಕ್ರಿಯ (ಪ್ಲಾಂಟ್ ವಿಲೇಜ್ ಸಿಂಕ್ v4) • 0 ಸೆಕೆಂಡ್ ವಿಳಂಬತೆ",
    languageSelect: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆರಿಸಿ",
    resultTitle: "ರೋಗ ಪತ್ತೆ ಹಚ್ಚಿ",
    resultHeader: "ಫಲಿತಾಂಶ",
    affectedCrop: "ಬಾಧಿತ ಬೆಳೆ",
    riskLevel: "ಅಪಾಯದ ಮಟ್ಟ",
    solutionsTitle: "ಶಿಫಾರಸು ಮಾಡಿದ ಪರಿಹಾರಗಳು",
    descriptionTitle: "ವಿವರಣೆ",
    sensorConfidence: "ಸಿಎನ್ಎನ್ ಸೆನ್ಸರ್ ನಿಖರತೆ",
    unknownPathogen: "ಸ್ಪೀಸೀಸ್ ಅಪರಿಚಿತವಾಗಿದೆ",
  }
};
