// uploadTiffinData.js
// Install dependencies first: npm install firebase
// Run with: node uploadTiffinData.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGrWeIw73Ntuva3z-Su4SIbMIF2IyFZ_I",
  authDomain: "website-b2814.firebaseapp.com",
  projectId: "website-b2814",
  storageBucket: "website-b2814.firebasestorage.app",
  messagingSenderId: "821495283209",
  appId: "1:821495283209:web:0b047887d3cfcbe512c2d8",
  measurementId: "G-XDFRFSNX3W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample tiffin data
const tiffinData = [
  {
    day: "Today",
    date: "Monday",
    order: 1,
    isSpecial: false,
    specialNote: "",
    items: [
      {
        name: "Dal Tadka",
        description: "Yellow lentils tempered with spices",
        isVeg: true
      },
      {
        name: "Jeera Rice",
        description: "Basmati rice with cumin",
        isVeg: true
      },
      {
        name: "Mix Veg Curry",
        description: "Seasonal vegetables in gravy",
        isVeg: true
      },
      {
        name: "Roti (4 pcs)",
        description: "Whole wheat flatbread",
        isVeg: true
      },
      {
        name: "Salad & Pickle",
        description: "Fresh salad with homemade pickle",
        isVeg: true
      }
    ]
  },
  {
    day: "Tomorrow",
    date: "Tuesday",
    order: 2,
    isSpecial: false,
    specialNote: "",
    items: [
      {
        name: "Rajma Masala",
        description: "Red kidney beans in spiced gravy",
        isVeg: true
      },
      {
        name: "Steamed Rice",
        description: "Fluffy basmati rice",
        isVeg: true
      },
      {
        name: "Aloo Gobi",
        description: "Potato and cauliflower curry",
        isVeg: true
      },
      {
        name: "Chapati (4 pcs)",
        description: "Soft whole wheat bread",
        isVeg: true
      },
      {
        name: "Raita & Papad",
        description: "Yogurt dip with crispy papad",
        isVeg: true
      }
    ]
  },
  {
    day: "Wednesday",
    date: "Wednesday",
    order: 3,
    isSpecial: false,
    specialNote: "",
    items: [
      {
        name: "Chole Masala",
        description: "Chickpeas in spicy gravy",
        isVeg: true
      },
      {
        name: "Bhature (2 pcs)",
        description: "Fluffy fried bread",
        isVeg: true
      },
      {
        name: "Jeera Rice",
        description: "Cumin flavored rice",
        isVeg: true
      },
      {
        name: "Onion Raita",
        description: "Yogurt with onions",
        isVeg: true
      }
    ]
  },
  {
    day: "Thursday",
    date: "Thursday",
    order: 4,
    isSpecial: false,
    specialNote: "",
    items: [
      {
        name: "Palak Paneer",
        description: "Cottage cheese in spinach gravy",
        isVeg: true
      },
      {
        name: "Dal Fry",
        description: "Tempered yellow lentils",
        isVeg: true
      },
      {
        name: "Steamed Rice",
        description: "Plain basmati rice",
        isVeg: true
      },
      {
        name: "Roti (4 pcs)",
        description: "Whole wheat flatbread",
        isVeg: true
      },
      {
        name: "Salad",
        description: "Fresh vegetable salad",
        isVeg: true
      }
    ]
  },
  {
    day: "Friday",
    date: "Friday",
    order: 5,
    isSpecial: false,
    specialNote: "",
    items: [
      {
        name: "Kadhi Pakora",
        description: "Yogurt curry with fritters",
        isVeg: true
      },
      {
        name: "Jeera Rice",
        description: "Cumin flavored rice",
        isVeg: true
      },
      {
        name: "Aloo Bhaji",
        description: "Spiced potato curry",
        isVeg: true
      },
      {
        name: "Chapati (4 pcs)",
        description: "Whole wheat bread",
        isVeg: true
      },
      {
        name: "Papad",
        description: "Crispy lentil wafer",
        isVeg: true
      }
    ]
  },
  {
    day: "Saturday",
    date: "Saturday",
    order: 6,
    isSpecial: false,
    specialNote: "",
    items: [
      {
        name: "Matar Paneer",
        description: "Peas and cottage cheese curry",
        isVeg: true
      },
      {
        name: "Dal Tadka",
        description: "Tempered lentils",
        isVeg: true
      },
      {
        name: "Pulao Rice",
        description: "Aromatic spiced rice",
        isVeg: true
      },
      {
        name: "Roti (4 pcs)",
        description: "Whole wheat flatbread",
        isVeg: true
      },
      {
        name: "Raita & Salad",
        description: "Yogurt dip with fresh salad",
        isVeg: true
      }
    ]
  },
  {
    day: "Sunday Special",
    date: "Sunday",
    order: 7,
    isSpecial: true,
    specialNote: "Premium menu with extra items",
    items: [
      {
        name: "Paneer Butter Masala",
        description: "Cottage cheese in rich tomato gravy",
        isVeg: true
      },
      {
        name: "Pulao Rice",
        description: "Aromatic spiced rice",
        isVeg: true
      },
      {
        name: "Dal Makhani",
        description: "Black lentils in creamy sauce",
        isVeg: true
      },
      {
        name: "Naan (3 pcs)",
        description: "Tandoor-baked flatbread",
        isVeg: true
      },
      {
        name: "Gulab Jamun",
        description: "Sweet dessert dumplings",
        isVeg: true
      },
      {
        name: "Salad & Raita",
        description: "Fresh accompaniments",
        isVeg: true
      }
    ]
  }
];

// Upload function
async function uploadTiffinData() {
  console.log('Starting upload...');
  
  try {
    for (const tiffin of tiffinData) {
      const docRef = await addDoc(collection(db, "TiffinMenu"), tiffin);
      console.log(`✅ Uploaded ${tiffin.day} with ID: ${docRef.id}`);
    }
    
    console.log('\n🎉 All data uploaded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error uploading data:', error);
    process.exit(1);
  }
}

// Run the upload
uploadTiffinData();