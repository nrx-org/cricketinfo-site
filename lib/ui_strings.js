import { getPrivacyPolicyUrl, getTermsOfUseUrl } from "./urls";

export const commonUiStrings = {
  no: {
    en: "No",
    hi: "नहीं",
    ta: "வேண்டாம், நன்றி"
  },
  close: {
    en: "Close",
    hi: "बंद करे",
    ta: "மூடு"
  },
  retry: {
    en: "Retry",
    hi: "पुन: प्रयास करें",
    ta: "மீண்டும் முயலவும்"
  },
  notFound: {
    en: "This page could not be found",
    hi: "यह पृष्ठ नहीं मिला",
    ta: "இந்தப் பக்கம் கிடைக்கவில்லை "
  },
  privacyPolicy: {
    en: "Privacy policy",
    hi: "गोपनीयता नीति",
    ta: "தனியுரிமைக் கொள்கை"
  },
  surveyPolicy: {
    en: "Survey statement",
    hi: "Survey statement",
    ta: "ஆய்வு அறிக்கை"
  },
  seeImageLicenses: {
    en: "See licenses for images used on this page",
    hi: "इस पृष्ठ पर उपयोग की गई छवियों के लाइसेंस देखें",
    ta: "இந்த பக்கத்தில் பயன்படுத்தப்படும் படங்களுக்கான உரிமங்களைப் பார்க்கவும்"
  },
  usesCookies: {
    en: () =>
      `This site uses cookies to give you the best experience on our website as well as help us understand how to make it better for you.  By using cricketinfo, you agree with our <a href="${getPrivacyPolicyUrl(
        "en"
      )}">privacy notice</a> and <a href="${getTermsOfUseUrl()}">terms of use</a>.`,
    hi: () =>
      `यह साइट आपको सबसे अच्छा अनुभव देने के लिए कुकीज़ का उपयोग करती है, जो साथ ही साथ हमें यह समझने में मदद देती है कि इसे आपके लिए और बेहतर कैसे बनाया जा सकता है। क्रिकेटइन्फो का उपयोग करके, आप हमारी <a href="${getPrivacyPolicyUrl(
        "hi"
      )}">गोपनीयता सूचना</a> और <a href="${getTermsOfUseUrl()}">उपयोग की शर्तों</a> से सहमत हैं।`,
    ta: () =>
      `எங்கள் தளத்தில் நீங்கள் சிறந்த அனுபவத்தை பெறுவதற்கு குக்கீகளைப் பயன்படுத்துவதோடு, அதை எவ்வாறு சிறப்பாக செய்யலாம் என்பதைப் புரிந்து கொள்ளவும் எங்களுக்கு உதவுகிறது. கிரிக்கெட்இன்ஃபோவைப் பயன்படுத்துவதன் மூலம், எங்கள் <a href="${getPrivacyPolicyUrl(
        "ta"
      )}">தனியுரிமை அறிவிப்பு</a> மற்றும் <a href="${getTermsOfUseUrl()}">பயன்பாட்டு விதிமுறைகளை </a> நீங்கள் ஒப்புக்கொள்கிறீர்கள்.`
  },
  contactUs: {
    en: "Contact us",
    hi: "हमसे संपर्क करें",
    ta: "தொடர்பு கொள்க"
  },
  license: {
    en: `All content on this page has been adapted from <a href="https://en.wikipedia.org">Wikipedia</a> under the terms of the <a href="https://creativecommons.org/licenses/by-sa/3.0/legalcode">CC-BY-SA 3.0 license</a>.`,
    hi: `इस पृष्ठ की सभी सामग्री <a href="https://hi.wikipedia.org">विकिपीडिया</a> से <a href="https://creativecommons.org/licenses/by-sa/3.0/legalcode">CC-BY-SA 3.0 लाइसेंस</a> की शर्तों के तहत ली गई है।`,
    ta: `இந்த பக்கத்தின் உள்ளடக்கத்தை <a href="https://creativecommons.org/licenses/by-sa/3.0/legalcode">CC-BY-SA 3.0 உரிமத்தின்</a> கீழ் <a href="https://ta.wikipedia.org">விக்கிப்பீடியாவில்</a> இருந்து மாற்றியமைக்கப்பட்டுள்ளது.</a>.`
  }
};

export const articleUiStrings = {
  shareLinkError: {
    en: "Could not get share link",
    hi: "आपका शेयर लिंक बनाते समय एक त्रुटि हुई",
    ta: "Could not get share link"
  },
  goHome: {
    en: "Go to CricketInfo.io",
    hi: "CricketInfo.io पर जाएं",
    ta: "CricketInfo.io க்குச் செல்க"
  },
  takeSurvey: {
    en: "Please give us your feedback on cricketinfo by filling a short survey",
    hi:
      "कृपया एक छोटा सा सर्वेक्षण भरकर हमें क्रिकेटइंफो के बारे में अपनी प्रतिक्रिया दें",
    ta:
      "ஒரு குறுகிய ஆய்வை பூர்த்தி செய்வதன் மூலம் கிரிக்கெட்இன்ஃபோ பற்றிய உங்கள் கருத்துகளை எங்களுக்குத் தெரிவிக்கவும்"
  },
  getUpdatesOnWhatsApp: {
    en: "Get updates on WhatsApp",
    hi: "व्हाट्सएप पर अपडेट प्राप्त करें",
    ta: "வாட்ஸ்அப்பில் மேலும் தகவல்களைப் பெறவும்"
  },
  confirmSubscription: {
    en: "Do you want similar fun and engaging information on WhatsApp?",
    hi: "क्या आप व्हाट्सएप पर ऐसी ही मज़ेदार और आकर्षक जानकारी चाहते हैं?",
    ta:
      "வாட்ஸ்அப்பில் இது போன்ற கேளிக்கையான மற்றும் சுவாரஸ்யமான தகவல்களைப் பெற வேண்டுமா?"
  },
  yesImInterested: {
    en: "Yes, I'm interested",
    hi: "हां, मुझे दिलचस्पी है",
    ta: "ஆம், தெரிந்துகொள்ள ஆர்வமாக இருக்கிறேன்"
  },
  enterNumber: {
    en:
      "Enter your WhatsApp number below to start receiving interesting articles on your WhatsApp.",
    hi:
      "अपने व्हाट्सएप पर दिलचस्प लेख पाने के लिए नीचे अपना व्हाट्सएप नंबर दर्ज करें।",
    ta:
      "உங்கள் வாட்ஸ்அப்பில் சுவாரஸ்யமான தகவல்களைப் பெறுவதற்கு கீழே  உங்கள் வாட்ஸ்அப் எண்ணை உள்ளிடவும்."
  },
  enterNumberInput: {
    en: "Enter WhatsApp number",
    hi: "व्हाट्सएप नंबर डालें",
    ta: "வாட்ஸ்அப் எண்ணை உள்ளிடவும்"
  },
  subscribeToUpdates: {
    en: "Subscribe to updates",
    hi: "अपडेट के लिए सब्सक्राइब करें",
    ta: "மேலும் தகவல்களைப் பெற சப்ஸ்கிரைப் செய்யவும்"
  },
  downloadPdf: {
    en: "Download PDF",
    hi: "पीडीएफ़ डाउनलोड करें",
    ta: "பி.டி.எஃப்-ஐப் டவுன்லோட் செய்யவும் "
  },
  whatsAppSubscribeError: {
    en:
      "There was an error while subscribing you to WhatsApp updates. Please try again.",
    hi:
      "व्हाट्सएप अपडेट के लिए आपको सब्सक्राइब करते समय एक त्रुटि हुई। कृपया पुन: प्रयास करें।",
    ta:
      "வாட்ஸ்அப் புதுப்பிப்புகளுக்கு நீங்கள் சப்ஸ்கிரைப் செய்த போது பிழை ஏற்பட்டு விட்டது. மீண்டும் முயலவும்."
  },
  readInLanguage: {
    en: "Read in English",
    hi: "हिंदी में पढ़ें",
    ta: "தமிழ் படிக்கவும்"
  },
  readInOtherLanguages: {
    en: "Read in other language(s)",
    hi: "अन्य भाषा(ओं) में पढ़ें",
    ta: "பிற மொழி(களில்) படிக்கவும்"
  },
  saveForLater: {
    en: "Save for later",
    hi: "भविष्य के लिए सेव करें",
    ta: "கட்டுரையை சேமிக்க"
  },
  shareArticle: {
    en: "Share article",
    hi: "लेख साझा करें",
    ta: "கட்டுரையை பகிர்"
  },
  shareOnFacebook: {
    en: "Share on Facebook",
    hi: "फेसबुक पर साझा करें",
    ta: "பேஸ்புக்கில் பகிர்"
  },
  shareOnWhatsApp: {
    en: "Share on WhatsApp",
    hi: "व्हाट्सएप पर साझा करें",
    ta: "வாட்ஸ்அப்பில் பகிர்"
  },
  copyLink: {
    en: "Copy link to share",
    hi: "साझा करने के लिए लिंक कॉपी करें",
    ta: "பகிர்ந்து கொள்ள இணைப்பை நகல் எடு"
  },
  shareLinkCopied: {
    en: "Share link copied!",
    hi: "साझा लिंक कॉपी हो गई!",
    ta: "பகிர்வதற்கான இணைப்பு நகலெடுக்கப்பட்டது!"
  },
  readOnWikipedia: {
    en: "Read more on Wikipedia",
    hi: "विकिपीडिया पर और पढ़ें",
    ta: "விக்கிப்பீடியாவில் மேலும் படிக்கவும்"
  },
  readOnWikipediaConfirmation: {
    en: "Would you like to read more about this topic on Wikipedia?",
    hi: "क्या आप विकिपीडिया पर इस विषय के बारे में अधिक पढ़ना चाहेंगे?",
    ta: "இதைப் பற்றி விக்கிபீடியாவில் மேலும் படிக்க விரும்புகிறீர்களா?"
  },
  yesReadMore: {
    en: "Yes, read more",
    hi: "हां, और पढ़ें",
    ta: "ஆம், மேலும் படி"
  },
  noThanks: {
    en: "No, thanks",
    hi: "जी नहीं, धन्यवाद",
    ta: "வேண்டாம், நன்றி"
  },
  retry: {
    en: "Retry",
    hi: "पुन: प्रयास करें",
    ta: "மீண்டும் முயலவும்"
  },
  notFound: {
    en: "This page could not be found",
    hi: "यह पृष्ठ नहीं मिला",
    ta: "இந்தப் பக்கம் கண்டறியப்படவில்லை"
  },
  networkError: {
    en: "There was a network error. Please try again.",
    hi: "नेटवर्क में गड़बड़ी आ गई। कृपया पुन: प्रयास करें।",
    ta: "நெட்வொர்க் பிழை ஏற்பட்டது. மீண்டும் முயலவும்."
  },
  readThisArticle: {
    en: "Read this article",
    hi: "इस लेख को पढ़ें",
    ta: "இந்தக் கட்டுரையைப் படிக்கவும்"
  }
};

export const homeUiStrings = {
  correctAnswer: {
    en: "Correct answer! Learn more:",
    hi: "सही उत्तर! अधिक जानें:",
    ta: "சரியான பதில்! மேலும் அறிக:"
  },
  wrongAnswer: {
    en: option => `Wrong answer! The correct answer is ${option}. Learn more:`,
    hi: option => `गलत जवाब! ${option} सही उत्तर है। अधिक जानें:`,
    ta: option =>
      `தவறான பதில்! சரியான பதில் விருப்பத்தேர்வு ${option}. மேலும் அறிக:`
  },
  playersToLookOutFor: {
    en: "Players to look out for",
    hi: "दिलचस्प खिलाड़ी",
    ta: "வீரர்கள் எதற்காக வெளியே பார்க்கிறார்கள்"
  },
  seeAllPlayers: {
    en: "See all players",
    hi: "सभी खिलाड़ियों को देखें",
    ta: "எல்லா வீரர்களையும் பார்க்கவும்"
  },
  funFacts: {
    en: "Fun facts",
    hi: "मज़ेदार तथ्य",
    ta: "வேடிக்கையான தகவல்கள்"
  },
  playingTeams: {
    en: "Playing teams",
    hi: "खेलने वाली टीमें",
    ta: "விளையாடும் அணிகள்"
  },
  seeAllParticipatingTeams: {
    en: "See all participating teams",
    hi: "भाग लेने वाली सभी टीमों को देखें",
    ta: "அனைத்து விளையாடும் அணிகளையும் பார்க்கவும்"
  },
  allParticipatingTeams: {
    en: "All Participating Teams",
    hi: "भाग लेने वाली सभी टीमें",
    ta: "அனைத்து விளையாடும் அணிகள்"
  },
  doYouKnow: {
    en: "Do You Know?",
    hi: "क्या आपको पता है?",
    ta: "உங்களுக்குத் தெரியுமா?"
  },
  interestingArticles: {
    en: "Interesting Articles",
    hi: "रोचक लेख",
    ta: "சுவாரசியமான கட்டுரைகள்"
  }
};
