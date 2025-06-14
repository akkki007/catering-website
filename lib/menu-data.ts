export interface MenuItemType {
  name: string
  price: string
  description?: string
}

export interface MenuDataType {
  [category: string]: MenuItemType[]
}

export const menuData: MenuDataType = {
  टिफिन: [
    {
      name: "साधी पोळी, भाजी, भात, आमटी, कोशिंबीर",
      price: "150",
      description: "Complete tiffin meal",
    },
  ],
  "रोटी / ब्रेड": [
    { name: "भाकरी (ज्वारी, बाजरी)", price: "40", description: "Per pair" },
    { name: "साधी पोळी", price: "24", description: "Per pair" },
    { name: "घडीची पोळी", price: "28", description: "Per pair" },
    { name: "फुलका", price: "20", description: "Per pair" },
    { name: "नान", price: "40", description: "Per pair" },
    { name: "तंदूर रोटी", price: "40", description: "Per pair" },
  ],
  पराठा: [
    { name: "ला्छा पराठा", price: "120", description: "Per pair" },
    { name: "बटाटा पराठा", price: "120", description: "Per pair" },
    { name: "मेथी पराठा", price: "120", description: "Per pair" },
    { name: "पालक पराठा", price: "120", description: "Per pair" },
    { name: "बीट-रूट पराठा", price: "120", description: "Per pair" },
    { name: "गाजर पराठा", price: "120", description: "Per pair" },
    { name: "पनीर पराठा", price: "160", description: "Per pair" },
  ],
  "भात (Rice)": [
    { name: "साधा भात", price: "40" },
    { name: "जीरा राईस", price: "60" },
    { name: "मसाले भात (मटार)", price: "60" },
    { name: "तोंडली भात", price: "60" },
    { name: "कोबी भात", price: "60" },
    { name: "पुलाव", price: "80" },
  ],
  "भाजी (Vegetables)": [
    { name: "गवार", price: "40" },
    { name: "भरलं वांग", price: "40" },
    { name: "लाल भोपळा", price: "40" },
    { name: "दुधी भोपळा", price: "40" },
    { name: "तोंडल", price: "40" },
    { name: "बटाटा काचऱ्या", price: "40" },
    { name: "बटाटा (डोसा भाजी)", price: "40" },
    { name: "पडवळ", price: "40" },
    { name: "दोडका", price: "40" },
    { name: "कोबी", price: "40" },
    { name: "फ्लॉवर", price: "40" },
    { name: "आळू", price: "60" },
    { name: "लसूनी पालक", price: "60" },
    { name: "लसूनी मेथी", price: "60" },
    { name: "पालक पनीर", price: "60" },
    { name: "पनीर मसाला", price: "60" },
  ],
  "दाल (Lentils)": [
    { name: "छोले", price: "40" },
    { name: "मूग", price: "40" },
    { name: "अख्खा मसूर", price: "40" },
    { name: "मटकी", price: "40" },
    { name: "चवळी", price: "40" },
    { name: "मटार", price: "40" },
    { name: "डब्बल बी", price: "40" },
    { name: "पावटा", price: "40" },
    { name: "राजमा", price: "40" },
  ],
  रायता: [
    { name: "गाजर", price: "15" },
    { name: "काकडी", price: "15" },
    { name: "टोमॅटो", price: "15" },
    { name: "कांदा", price: "15" },
    { name: "सलाड", price: "15" },
    { name: "कैरीडाळ", price: "15" },
    { name: "वाटली डाळ", price: "15" },
    { name: "हिरवा टोमॅटो", price: "15" },
    { name: "बीट रूट", price: "15" },
  ],
  भरीत: [
    { name: "बटाटा भरीत", price: "20" },
    { name: "लाल भोपळा भरीत", price: "20" },
    { name: "वांग भरीत", price: "20" },
  ],
  "सार / आमटी": [
    { name: "टोमॅटो सार", price: "40" },
    { name: "आमटी (चिंच-गूळ)", price: "40" },
    { name: "दालमेथी", price: "40" },
    { name: "कढी", price: "40" },
  ],
  "मिठाई (Desserts)": [
    { name: "मोदक (उकडीचे)", price: "80", description: "Per pair" },
    { name: "मोदक (तळलेले)", price: "40", description: "Per pair" },
    { name: "गुलाब जाम", price: "40" },
    { name: "आम्रखंड", price: "60" },
    { name: "श्रीखंड", price: "60" },
    { name: "गाजर हलवा", price: "40" },
    { name: "दुधी हलवा", price: "40" },
    { name: "शेवया खीर", price: "40" },
    { name: "गव्हाची खीर", price: "60" },
    { name: "पुरणपोळी", price: "80", description: "Per pair" },
    { name: "गुळपोळी", price: "80", description: "Per pair" },
  ],
  "नाष्टा (Breakfast)": [
    { name: "पोहे", price: "35" },
    { name: "उपीट", price: "35" },
    { name: "शिरा", price: "35" },
    { name: "इडली चटणी", price: "35" },
    { name: "डोसा-बटाटा भाजी", price: "80" },
    { name: "उडीद वडे", price: "80" },
    { name: "बटाटा वडे", price: "20" },
    { name: "भाजणी वडे", price: "35" },
    { name: "कांदा भजी", price: "35" },
    { name: "बटाटा भजी", price: "35" },
    { name: "पालक भजी", price: "35" },
    { name: "घोसावलं भजी", price: "35" },
  ],
}
