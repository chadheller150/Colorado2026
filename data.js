// All trip content lives here. Edit this file to update the site.
// Items marked "idea" are suggestions to confirm (hours/availability change in winter).
window.TRIP = {
  title: "Colorado",
  year: 2026,
  base: "Florissant, CO",
  start: "2026-12-19T00:00:00",
  end: "2026-12-23T23:59:59",
  dateLabel: "December 19 – 23, 2026",
  tagline: "A cozy cabin, fresh snow, and a very good day on the 21st.",
  elevation: "8,200 ft",
  home: { lat: 38.9889, lng: -105.283 },

  days: [
    {
      id: "d19", short: "Fri 12/19", name: "Arrival", date: "2026-12-19", icon: "bi-car-front",
      blurb: "Drive in, stock the kitchen, and settle in. Nothing scheduled after check-in.",
      items: [
        { time: "TBD", title: "Drive to Florissant", note: "Santa Fe Hybrid. Check CDOT road conditions (cotrip.org) before the final mountain stretch, and top off the tank before leaving the plains. If the drive is long, add an overnight stop to this day." },
        { time: "Afternoon", title: "Big grocery run in Woodland Park", note: "Closest full-size stores to Florissant (~20 min): Safeway and Walmart Supercenter (confirm hours). Buy everything for the stay now: breakfasts, dinners, snacks, drinks, cocoa. For specialty items, Colorado Springs (~1 hr) has Whole Foods, Trader Joe's, and Costco.", place: "grocery" },
        { time: "Check-in", title: "Settle in", note: "Confirm check-in time, door code, heat/fireplace and hot tub instructions, and the driveway snow plan." },
        { time: "Evening", title: "Easy dinner in + first hot tub soak", note: "Keep it simple, hydrate, and take it easy at altitude." }
      ]
    },
    {
      id: "d20", short: "Sat 12/20", name: "Scenic Hike", date: "2026-12-20", icon: "bi-tree",
      blurb: "One real hike, then back to the cabin for the cozy part.",
      items: [
        { time: "Morning", title: "Slow breakfast", note: "Coffee by the window, check the forecast and trail conditions." },
        { time: "Late morning", title: "Scenic hike: Mueller State Park (Outlook Ridge)", note: "Closest great winter hike (~25 min). Ridge views toward Pikes Peak and the Sangre de Cristos. Pack microspikes or traction, water, and a thermos. Colorado State Parks pass is needed at the gate. Backup: The Crags (Divide) or an easy loop at Florissant Fossil Beds.", place: "mueller" },
        { time: "Afternoon", title: "Hot tub + movie", note: "Soak, then blankets and the first movie of the trip." },
        { time: "Evening", title: "Cook a real dinner", note: "See the Cozy tab for the menu plan. Early night before the big day." }
      ]
    },
    {
      id: "d21", short: "Sun 12/21", name: "Elopement Day", date: "2026-12-21", icon: "bi-heart-fill", highlight: true,
      blurb: "The winter solstice, with a photographer. Details below are placeholders to fill in.",
      items: [
        { time: "Morning", title: "Getting ready", note: "Hair, outfits, rings, flowers. Slow and unhurried. Warm the car beforehand." },
        { time: "TBD", title: "Photographer arrives", note: "Add name, phone number, arrival time and shot list here. Ask about winter light and where they like to shoot." },
        { time: "TBD", title: "Ceremony + photos", note: "Location: TBD. Sunset near Pikes Peak is roughly 4:40 pm on the solstice, so aim for the golden hour before. Bring a warm layer to wear over outfits, boots to walk in, and a thermos.", place: "ceremony" },
        { time: "After", title: "Celebration dinner", note: "Reservation or an in-cabin feast. Confirm the license/legal steps if you haven't yet." },
        { time: "Night", title: "Hot tub + stargazing", note: "Dark skies out here. Champagne in the tub under the stars." }
      ]
    },
    {
      id: "d22", short: "Mon 12/22", name: "Scenic Adventure", date: "2026-12-22", icon: "bi-compass",
      blurb: "One scenic outing, then home for the last full cozy evening.",
      items: [
        { time: "Option A", title: "Garden of the Gods + Manitou Springs", note: "Snow on red rock, free entry, short paved loops, then shops and mineral springs. About 1 hr 15 min from Florissant. Easiest and most reliably open.", place: "gotg" },
        { time: "Option B", title: "Royal Gorge Bridge & Park", note: "Walk across America's highest suspension bridge, 956 ft over the Arkansas River. About 1 hr 30 min. Check winter hours and which attractions run in December.", place: "gorge" },
        { time: "Option C", title: "Wilkerson Pass + South Park overlook", note: "Quick, free scenic drive just west of Florissant with huge open views. Good if weather is iffy.", place: "wilkerson" },
        { time: "Afternoon", title: "Back for hot tub + movie marathon", note: "Leave enough daylight to be home before dark; mountain roads ice at night." },
        { time: "Evening", title: "Last cozy dinner", note: "Finish the groceries, so there's less to pack up." }
      ]
    },
    {
      id: "d23", short: "Tue 12/23", name: "Departure", date: "2026-12-23", icon: "bi-box-arrow-right",
      blurb: "One last slow morning before the drive home.",
      items: [
        { time: "Morning", title: "Breakfast + pack up", note: "Strip beds if required, empty the fridge, check every drawer and the hot tub cover." },
        { time: "Check-out", title: "Check out", note: "Confirm the checkout time." },
        { time: "TBD", title: "Drive home", note: "Check road conditions and fill up in Woodland Park or Colorado Springs before heading out." }
      ]
    }
  ],

  places: {
    home:     { name: "Florissant (Home Base)", lat: 38.9889, lng: -105.283, type: "base", note: "Quiet mountain town at ~8,200 ft." },
    grocery:  { name: "Woodland Park groceries", lat: 38.9939, lng: -105.0569, type: "town", note: "Closest large grocery stores (Safeway, Walmart), ~20 min. Confirm hours." },
    fossil:   { name: "Florissant Fossil Beds NM", lat: 38.9143, lng: -105.286, type: "activity", note: "Flat winter walks, petrified redwood stumps. Confirm winter hours." },
    mueller:  { name: "Mueller State Park", lat: 38.8727, lng: -105.1837, type: "activity", note: "Winter hiking and snowshoeing, elk. State parks pass required." },
    wilkerson:{ name: "Wilkerson Pass Overlook", lat: 39.0, lng: -105.5156, type: "activity", note: "Big open views over South Park, on US-24 west of Florissant." },
    manitou:  { name: "Manitou Springs", lat: 38.8597, lng: -104.9172, type: "town", note: "Shops, mineral springs, and a short drive to Garden of the Gods." },
    gotg:     { name: "Garden of the Gods", lat: 38.8783, lng: -104.8697, type: "activity", note: "Free park; snow on red rock is a postcard." },
    gorge:    { name: "Royal Gorge Bridge & Park", lat: 38.4616, lng: -105.3253, type: "activity", note: "Suspension bridge over the Arkansas River. Confirm winter hours." },
    cripple:  { name: "Cripple Creek", lat: 38.7466, lng: -105.1783, type: "town", note: "Historic mining town with wide mountain views." },
    ceremony: { name: "Ceremony location (TBD)", lat: null, lng: null, type: "base", note: "Add coordinates once decided." }
  },

  ideas: [
    { cat: "Do", name: "Mueller State Park hike", where: "mueller", detail: "The Sat 12/20 scenic hike. Ridge views, elk, quiet trails. Bring traction." },
    { cat: "Do", name: "Garden of the Gods", where: "gotg", detail: "Snow on red rock, free entry, short paved loops." },
    { cat: "Do", name: "Royal Gorge Bridge", where: "gorge", detail: "Dramatic scenic adventure if the weather is good. Check winter hours." },
    { cat: "Do", name: "Wilkerson Pass overlook", where: "wilkerson", detail: "Easy, free, wide-open views, right down the road." },
    { cat: "Do", name: "Florissant Fossil Beds", where: "fossil", detail: "Flat and quiet. A backup walk if the hike gets canceled." },
    { cat: "Do", name: "Cripple Creek", where: "cripple", detail: "Old gold-rush streets and views." },
    { cat: "Eat", name: "Stock-up grocery run", where: "grocery", detail: "Safeway / Walmart in Woodland Park on arrival day. Plan every meal first." },
    { cat: "Eat", name: "Manitou Springs dinner", where: "manitou", detail: "Optional night out on Mon 12/22 if you don't feel like cooking." },
    { cat: "Eat", name: "Elopement dinner", where: "home", detail: "Decide: reservation, caterer, private chef, or cook at the cabin." },
    { cat: "Stay", name: "Hot tub nights", where: "home", detail: "Every evening: soak, snow falling, stars out." },
    { cat: "Stay", name: "Movie marathon", where: "home", detail: "Blankets, fire, and the watchlist on the Cozy tab." }
  ],

  budget: [
    { id: "lodging", name: "Lodging", amount: 0, paid: false, note: "5 nights" },
    { id: "gas", name: "Gas + tolls", amount: 0, paid: false, note: "Santa Fe Hybrid round trip" },
    { id: "photo", name: "Photographer", amount: 0, paid: false, note: "" },
    { id: "officiant", name: "Officiant", amount: 0, paid: false, note: "" },
    { id: "license", name: "Marriage license", amount: 0, paid: false, note: "Colorado lets couples self-solemnize; confirm requirements with the county clerk." },
    { id: "flowers", name: "Flowers / bouquet", amount: 0, paid: false, note: "" },
    { id: "dinner", name: "Celebration dinner", amount: 0, paid: false, note: "" },
    { id: "groceries", name: "Groceries + drinks", amount: 0, paid: false, note: "Woodland Park run" },
    { id: "activities", name: "Activities / park fees", amount: 0, paid: false, note: "State park pass, Royal Gorge, etc." }
  ],

  packing: {
    "Cold weather": ["Insulated winter coat", "Base layers", "Warm socks (wool)", "Waterproof boots with grip", "Gloves + beanie", "Scarf / neck gaiter", "Hand + toe warmers"],
    "Hiking": ["Hiking boots", "Microspikes / traction", "Daypack + water", "Thermos for hot drinks", "Trekking poles (optional)", "Sunglasses"],
    "Elopement": ["Outfits (+ warm layer to wear over)", "Rings", "Marriage license / ID", "Dress shoes (and boots to walk in)", "Bouquet / boutonniere", "Vows", "Steamer or travel iron"],
    "Cozy + hot tub": ["Swimsuits", "Slippers", "Robes / big towels", "Pajamas", "Books / downloads", "Speaker + playlist", "Cooking basics (spices, favorite knife)", "Drinks for the tub"],
    "Altitude + skin": ["Refillable water bottle", "Lip balm with SPF", "Moisturizer", "Sunscreen", "Pain reliever", "Saline nasal spray"],
    "Car": ["Ice scraper + brush", "Phone mounts + chargers", "Offline maps downloaded", "Snacks + water", "Emergency kit + blanket", "Winter-rated tires / chains check"]
  },

  looks: [
    { id: "ceremony", title: "Ceremony look", note: "Layers that photograph well in snow: add a wrap, cape, or coat for warmth." },
    { id: "dinner", title: "Celebration dinner", note: "" },
    { id: "casual", title: "Cabin days", note: "Knit sweaters, flannels, slippers." }
  ],

  cozy: {
    meals: [
      { id: "m19", day: "Fri 12/19", note: "Easy arrival dinner (pasta, pizza kit, soup)" },
      { id: "m20", day: "Sat 12/20", note: "Big cooking night: something slow and comforting" },
      { id: "m21", day: "Sun 12/21", note: "Celebration dinner" },
      { id: "m22", day: "Mon 12/22", note: "Last cozy dinner / use up leftovers" },
      { id: "mb", day: "Breakfasts", note: "Pancakes, eggs, coffee, lots of cocoa" }
    ],
    movies: ["Home Alone", "Love Actually", "The Holiday", "Elf", "Little Women"]
  }
};
