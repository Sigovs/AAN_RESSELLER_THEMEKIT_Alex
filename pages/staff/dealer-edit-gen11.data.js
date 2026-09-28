/* AAN · Staff UI · Dealer Edit (Dealer File) — GENERATION 11 · fixture

   Read out of the production export, not authored:
     s12-dealer-file-1.html   fully-populated active dealer — Miller Motorcars #186
     s12-dealer-file-2.html   sparse trial dealer — Beat The Trade #1144 (Client Intake)
     s12-dealer-file-3.html   the blank new-dealer form

   `zones` is the field schema, identical across all three variants because the
   production component ships one form; what differs is the VALUES, the zone
   dots, the head chips, the side panels and the save bar. Two fields exist only
   on a stored record — Account Status and Billing Status — and carry `only`.

   Secrets are sealed in production and fetched on demand. This fixture stores
   no secret value: `__SEALED__` means "a value is stored on the server", and
   the seal's Reveal / Copy are disabled here because there is no server to ask.

   The three saved records are the three the export captured. Any other dealer
   id opens an honest empty state rather than a record invented to fill it.
*/
window.DE = {
 "user": "Ivaylo Guenkov",
 "base": "https://newbackendcert.aandemo.com",
 "nav": [
  {
   "g": "User Management",
   "i": [
    "Add New User",
    "View Users",
    "View User Tracking Log",
    "Add New Reseller",
    "View Reseller Accounts",
    "Add New Reseller Group",
    "View Reseller Groups",
    "Add New OEM",
    "View OEM Accounts"
   ]
  },
  {
   "g": "Dealer Management",
   "i": [
    "Add New Dealer",
    "View Dealers",
    "View New Dealer Orders",
    "View Pending Dealers"
   ],
   "on": true
  },
  {
   "g": "System Tools",
   "i": [
    "Sites Components/Versions"
   ]
  },
  {
   "g": "Marketing",
   "i": [
    "Sales CRM",
    "Co-Op Generator",
    "GMB Posting Scheduler DBA",
    "Master Marketing Project",
    "Master Marketing List",
    "Manychat - Social Message Bot"
   ]
  },
  {
   "g": "AAN Projects",
   "i": [
    "Home",
    "My Project Work List",
    "View All Projects",
    "All Projects Overview",
    "Client Content Calendar"
   ]
  },
  {
   "g": "Work",
   "i": [
    "My Work",
    "Create A Ticket",
    "Pending Work",
    "All Open Work",
    "Open Support Work",
    "Archived Support Work",
    "Open Client Project Work",
    "Holding Project Work",
    "Archived Client Project Work",
    "Open Mktg Proj Work",
    "Archived Mktg Proj Work",
    "Open Int Proj Work",
    "Archived Int Proj Work",
    "Client Leads Work",
    "Archived Client Leads Work",
    "Billing Work",
    "Archived Billing Work",
    "Activity Report"
   ]
  },
  {
   "g": "Feed Management",
   "i": [
    "Feeds Incoming",
    "Feeds Outgoing",
    "Craigslist stats",
    "Homenet Feeds",
    "Dealer Specialties Feeds",
    "Auto Uplink Feeds",
    "Auction123 Feeds",
    "Arkona Feeds",
    "Big Voice Feeds",
    "CDM Data Feeds",
    "Cobalt Feeds",
    "Diamond Lot Feeds",
    "eCarList Feeds",
    "Zeus Feeds",
    "Chicagoland Auto Search Feeds",
    "Out - AutoTrader Used Feeds",
    "Out - AutoTrader New Feeds",
    "Out - Cars.com Image Feeds",
    "Out - Cobalt Feeds",
    "Out - Dealer Specialty Feeds",
    "Out - eBizAutos Feeds"
   ]
  },
  {
   "g": "Accounting",
   "i": [
    "Accounting"
   ]
  }
 ],
 "zones": [
  {
   "id": "zIdent",
   "t": "Identity & Status",
   "s": "company · location · reseller · status",
   "fields": [
    {
     "k": "f.status",
     "l": "Account Status",
     "t": "select",
     "opts": [
      {
       "v": "T",
       "l": "Client Intake"
      },
      {
       "v": "P",
       "l": "Pending"
      },
      {
       "v": "A",
       "l": "Active"
      },
      {
       "v": "I",
       "l": "Inactive"
      }
     ],
     "only": [
      "186",
      "1144"
     ]
    },
    {
     "k": "flags.bill_stat",
     "l": "Billing Status",
     "t": "check",
     "help": "Admin only — bill_stat",
     "only": [
      "186",
      "1144"
     ]
    },
    {
     "k": "f.reseller_id",
     "l": "Reseller",
     "t": "select",
     "req": 1,
     "opts": [
      {
       "v": "",
       "l": "— choose —"
      },
      {
       "v": "1",
       "l": "All Auto Network"
      },
      {
       "v": "65",
       "l": "All Auto Network - A X A Boston"
      },
      {
       "v": "79",
       "l": "All Auto Network - Acton Auto"
      },
      {
       "v": "74",
       "l": "All Auto Network - Anthony Labalestra"
      },
      {
       "v": "58",
       "l": "All Auto Network - Aston Martin Summit"
      },
      {
       "v": "71",
       "l": "All Auto Network - Bentley Long Island"
      },
      {
       "v": "68",
       "l": "All Auto Network - Bul Auto Sales"
      },
      {
       "v": "72",
       "l": "All Auto Network - Cauley Ferrari"
      },
      {
       "v": "54",
       "l": "All Auto Network - CFL"
      },
      {
       "v": "78",
       "l": "All Auto Network - CMC"
      },
      {
       "v": "46",
       "l": "All Auto Network - EAG"
      },
      {
       "v": "67",
       "l": "All Auto Network - FC Kerbeck"
      },
      {
       "v": "73",
       "l": "All Auto Network - Fields Auto Group"
      },
      {
       "v": "39",
       "l": "All Auto Network - FMoA"
      },
      {
       "v": "49",
       "l": "All Auto Network - Glenview Luxury Imports"
      },
      {
       "v": "47",
       "l": "All Auto Network - Gravity"
      },
      {
       "v": "64",
       "l": "All Auto Network - Group Seven Automotive"
      },
      {
       "v": "60",
       "l": "All Auto Network - Lawrence Motorsport"
      },
      {
       "v": "36",
       "l": "All Auto Network - LFSC"
      },
      {
       "v": "51",
       "l": "All Auto Network - Long Island Sports Cars"
      },
      {
       "v": "55",
       "l": "All Auto Network - Marshall Goldman"
      },
      {
       "v": "62",
       "l": "All Auto Network - McLaren and Rimac Boston"
      },
      {
       "v": "42",
       "l": "All Auto Network - Miller"
      },
      {
       "v": "61",
       "l": "All Auto Network - Naples"
      },
      {
       "v": "59",
       "l": "All Auto Network - NYC Motorcars"
      },
      {
       "v": "69",
       "l": "All Auto Network - OGara Coach"
      },
      {
       "v": "48",
       "l": "All Auto Network - Paul Miller"
      },
      {
       "v": "66",
       "l": "All Auto Network - Platinum Cars"
      },
      {
       "v": "57",
       "l": "All Auto Network - S & E Auto Sales"
      },
      {
       "v": "56",
       "l": "All Auto Network - Shift Digital"
      },
      {
       "v": "53",
       "l": "All Auto Network - Summit"
      },
      {
       "v": "77",
       "l": "All Auto Network - TLC"
      },
      {
       "v": "76",
       "l": "All Auto Network - TLC LG"
      },
      {
       "v": "75",
       "l": "All Auto Network - TLC WC"
      },
      {
       "v": "70",
       "l": "All Auto Network - Towbin Motorcars"
      },
      {
       "v": "52",
       "l": "All Auto Network - zDev"
      },
      {
       "v": "80",
       "l": "All Auto Network - ZT AutoGroup"
      },
      {
       "v": "38",
       "l": "Aronson Advertising"
      },
      {
       "v": "40",
       "l": "Aronson Advertising - Ewald"
      },
      {
       "v": "32",
       "l": "Arrowhead Advertising"
      },
      {
       "v": "25",
       "l": "Auto Conversion"
      },
      {
       "v": "34",
       "l": "BBA & Beyond"
      },
      {
       "v": "21",
       "l": "Blugroup KS"
      },
      {
       "v": "13",
       "l": "BluSolutions GA"
      },
      {
       "v": "2",
       "l": "BluSolutions Texas"
      },
      {
       "v": "18",
       "l": "Cars By The Millions"
      },
      {
       "v": "43",
       "l": "Chicago Consortium"
      },
      {
       "v": "20",
       "l": "CMP Development"
      },
      {
       "v": "31",
       "l": "Cypress Alliance"
      },
      {
       "v": "41",
       "l": "Eikon Mobile"
      },
      {
       "v": "44",
       "l": "Ella's Bubbles"
      },
      {
       "v": "33",
       "l": "Ensure Productions"
      },
      {
       "v": "7",
       "l": "esolutions"
      },
      {
       "v": "14",
       "l": "GD2"
      },
      {
       "v": "45",
       "l": "Guidance Development"
      },
      {
       "v": "35",
       "l": "Infinity Publishing"
      },
      {
       "v": "50",
       "l": "Lifecycle Digital Marketing"
      },
      {
       "v": "22",
       "l": "Marni McClennan"
      },
      {
       "v": "6",
       "l": "Matrix Nationwide Inc."
      },
      {
       "v": "26",
       "l": "Mogulweb.com"
      },
      {
       "v": "27",
       "l": "Mojo Internet Marketing Company"
      },
      {
       "v": "8",
       "l": "Omnibus Advertising"
      },
      {
       "v": "9",
       "l": "Premier Solutionz"
      },
      {
       "v": "29",
       "l": "Redbumper LLC"
      },
      {
       "v": "30",
       "l": "Redline Edition"
      },
      {
       "v": "37",
       "l": "Simply Dealer"
      },
      {
       "v": "23",
       "l": "Source One Services"
      },
      {
       "v": "28",
       "l": "Steinberg Marketing"
      },
      {
       "v": "19",
       "l": "The BluSolutions Group, Inc."
      },
      {
       "v": "12",
       "l": "The Real BluSolutions, Inc. DBA - BluSolutions"
      }
     ],
     "optsNew": [
      {
       "v": "",
       "l": "— choose —"
      },
      {
       "v": "1",
       "l": "All Auto Network"
      },
      {
       "v": "65",
       "l": "All Auto Network - A X A Boston"
      },
      {
       "v": "79",
       "l": "All Auto Network - Acton Auto"
      },
      {
       "v": "74",
       "l": "All Auto Network - Anthony Labalestra"
      },
      {
       "v": "58",
       "l": "All Auto Network - Aston Martin Summit"
      },
      {
       "v": "71",
       "l": "All Auto Network - Bentley Long Island"
      },
      {
       "v": "68",
       "l": "All Auto Network - Bul Auto Sales"
      },
      {
       "v": "72",
       "l": "All Auto Network - Cauley Ferrari"
      },
      {
       "v": "54",
       "l": "All Auto Network - CFL"
      },
      {
       "v": "78",
       "l": "All Auto Network - CMC"
      },
      {
       "v": "46",
       "l": "All Auto Network - EAG"
      },
      {
       "v": "67",
       "l": "All Auto Network - FC Kerbeck"
      },
      {
       "v": "73",
       "l": "All Auto Network - Fields Auto Group"
      },
      {
       "v": "39",
       "l": "All Auto Network - FMoA"
      },
      {
       "v": "49",
       "l": "All Auto Network - Glenview Luxury Imports"
      },
      {
       "v": "47",
       "l": "All Auto Network - Gravity"
      },
      {
       "v": "64",
       "l": "All Auto Network - Group Seven Automotive"
      },
      {
       "v": "60",
       "l": "All Auto Network - Lawrence Motorsport"
      },
      {
       "v": "36",
       "l": "All Auto Network - LFSC"
      },
      {
       "v": "51",
       "l": "All Auto Network - Long Island Sports Cars"
      },
      {
       "v": "55",
       "l": "All Auto Network - Marshall Goldman"
      },
      {
       "v": "62",
       "l": "All Auto Network - McLaren and Rimac Boston"
      },
      {
       "v": "42",
       "l": "All Auto Network - Miller"
      },
      {
       "v": "61",
       "l": "All Auto Network - Naples"
      },
      {
       "v": "59",
       "l": "All Auto Network - NYC Motorcars"
      },
      {
       "v": "69",
       "l": "All Auto Network - OGara Coach"
      },
      {
       "v": "48",
       "l": "All Auto Network - Paul Miller"
      },
      {
       "v": "66",
       "l": "All Auto Network - Platinum Cars"
      },
      {
       "v": "57",
       "l": "All Auto Network - S & E Auto Sales"
      },
      {
       "v": "56",
       "l": "All Auto Network - Shift Digital"
      },
      {
       "v": "53",
       "l": "All Auto Network - Summit"
      },
      {
       "v": "77",
       "l": "All Auto Network - TLC"
      },
      {
       "v": "76",
       "l": "All Auto Network - TLC LG"
      },
      {
       "v": "75",
       "l": "All Auto Network - TLC WC"
      },
      {
       "v": "70",
       "l": "All Auto Network - Towbin Motorcars"
      },
      {
       "v": "52",
       "l": "All Auto Network - zDev"
      },
      {
       "v": "80",
       "l": "All Auto Network - ZT AutoGroup"
      },
      {
       "v": "38",
       "l": "Aronson Advertising"
      },
      {
       "v": "40",
       "l": "Aronson Advertising - Ewald"
      },
      {
       "v": "32",
       "l": "Arrowhead Advertising"
      },
      {
       "v": "25",
       "l": "Auto Conversion"
      },
      {
       "v": "34",
       "l": "BBA & Beyond"
      },
      {
       "v": "21",
       "l": "Blugroup KS"
      },
      {
       "v": "13",
       "l": "BluSolutions GA"
      },
      {
       "v": "2",
       "l": "BluSolutions Texas"
      },
      {
       "v": "18",
       "l": "Cars By The Millions"
      },
      {
       "v": "43",
       "l": "Chicago Consortium"
      },
      {
       "v": "20",
       "l": "CMP Development"
      },
      {
       "v": "31",
       "l": "Cypress Alliance"
      },
      {
       "v": "41",
       "l": "Eikon Mobile"
      },
      {
       "v": "44",
       "l": "Ella's Bubbles"
      },
      {
       "v": "33",
       "l": "Ensure Productions"
      },
      {
       "v": "7",
       "l": "esolutions"
      },
      {
       "v": "14",
       "l": "GD2"
      },
      {
       "v": "45",
       "l": "Guidance Development"
      },
      {
       "v": "35",
       "l": "Infinity Publishing"
      },
      {
       "v": "50",
       "l": "Lifecycle Digital Marketing"
      },
      {
       "v": "22",
       "l": "Marni McClennan"
      },
      {
       "v": "6",
       "l": "Matrix Nationwide Inc."
      },
      {
       "v": "26",
       "l": "Mogulweb.com"
      },
      {
       "v": "27",
       "l": "Mojo Internet Marketing Company"
      },
      {
       "v": "8",
       "l": "Omnibus Advertising"
      },
      {
       "v": "9",
       "l": "Premier Solutionz"
      },
      {
       "v": "29",
       "l": "Redbumper LLC"
      },
      {
       "v": "30",
       "l": "Redline Edition"
      },
      {
       "v": "37",
       "l": "Simply Dealer"
      },
      {
       "v": "23",
       "l": "Source One Services"
      },
      {
       "v": "28",
       "l": "Steinberg Marketing"
      },
      {
       "v": "19",
       "l": "The BluSolutions Group, Inc."
      },
      {
       "v": "12",
       "l": "The Real BluSolutions, Inc. DBA - BluSolutions"
      }
     ]
    },
    {
     "k": "f.oem_id",
     "l": "OEM",
     "t": "select",
     "opts": [
      {
       "v": "0",
       "l": "— none —"
      },
      {
       "v": "1",
       "l": "Shift Digital-Maserati"
      }
     ]
    },
    {
     "k": "f.company_name",
     "l": "Company Name",
     "t": "text",
     "req": 1
    },
    {
     "k": "f.web",
     "l": "Domain",
     "t": "text",
     "req": 1,
     "ph": "dealer-domain.com"
    },
    {
     "k": "f.multi_dealer",
     "l": "Multi Dealer",
     "t": "radio",
     "req": 1,
     "opts": [
      {
       "v": "Y",
       "l": "Yes"
      },
      {
       "v": "N",
       "l": "No"
      }
     ]
    },
    {
     "k": "f.address",
     "l": "Address",
     "t": "text",
     "req": 1
    },
    {
     "k": "f.city",
     "l": "City",
     "t": "text",
     "req": 1
    },
    {
     "k": "f.state",
     "l": "State",
     "t": "select",
     "req": 1,
     "opts": [
      {
       "v": "",
       "l": "—"
      },
      {
       "v": "AL",
       "l": "AL"
      },
      {
       "v": "AK",
       "l": "AK"
      },
      {
       "v": "AZ",
       "l": "AZ"
      },
      {
       "v": "AR",
       "l": "AR"
      },
      {
       "v": "CA",
       "l": "CA"
      },
      {
       "v": "CO",
       "l": "CO"
      },
      {
       "v": "CT",
       "l": "CT"
      },
      {
       "v": "DE",
       "l": "DE"
      },
      {
       "v": "DC",
       "l": "DC"
      },
      {
       "v": "FL",
       "l": "FL"
      },
      {
       "v": "GA",
       "l": "GA"
      },
      {
       "v": "HI",
       "l": "HI"
      },
      {
       "v": "ID",
       "l": "ID"
      },
      {
       "v": "IL",
       "l": "IL"
      },
      {
       "v": "IN",
       "l": "IN"
      },
      {
       "v": "IA",
       "l": "IA"
      },
      {
       "v": "KS",
       "l": "KS"
      },
      {
       "v": "KY",
       "l": "KY"
      },
      {
       "v": "LA",
       "l": "LA"
      },
      {
       "v": "ME",
       "l": "ME"
      },
      {
       "v": "MD",
       "l": "MD"
      },
      {
       "v": "MA",
       "l": "MA"
      },
      {
       "v": "MI",
       "l": "MI"
      },
      {
       "v": "MN",
       "l": "MN"
      },
      {
       "v": "MS",
       "l": "MS"
      },
      {
       "v": "MO",
       "l": "MO"
      },
      {
       "v": "MT",
       "l": "MT"
      },
      {
       "v": "NE",
       "l": "NE"
      },
      {
       "v": "NV",
       "l": "NV"
      },
      {
       "v": "NH",
       "l": "NH"
      },
      {
       "v": "NJ",
       "l": "NJ"
      },
      {
       "v": "NM",
       "l": "NM"
      },
      {
       "v": "NY",
       "l": "NY"
      },
      {
       "v": "NC",
       "l": "NC"
      },
      {
       "v": "ND",
       "l": "ND"
      },
      {
       "v": "OH",
       "l": "OH"
      },
      {
       "v": "OK",
       "l": "OK"
      },
      {
       "v": "OR",
       "l": "OR"
      },
      {
       "v": "PA",
       "l": "PA"
      },
      {
       "v": "RI",
       "l": "RI"
      },
      {
       "v": "SC",
       "l": "SC"
      },
      {
       "v": "SD",
       "l": "SD"
      },
      {
       "v": "TN",
       "l": "TN"
      },
      {
       "v": "TX",
       "l": "TX"
      },
      {
       "v": "UT",
       "l": "UT"
      },
      {
       "v": "VT",
       "l": "VT"
      },
      {
       "v": "VA",
       "l": "VA"
      },
      {
       "v": "WA",
       "l": "WA"
      },
      {
       "v": "WV",
       "l": "WV"
      },
      {
       "v": "WI",
       "l": "WI"
      },
      {
       "v": "WY",
       "l": "WY"
      }
     ]
    },
    {
     "k": "f.zip",
     "l": "ZIP",
     "t": "text",
     "req": 1
    },
    {
     "k": "f.phone",
     "l": "Phone",
     "t": "text",
     "req": 1
    },
    {
     "k": "f.fax",
     "l": "Fax",
     "t": "text"
    },
    {
     "k": "f.start_date",
     "l": "Start Date",
     "t": "date",
     "req": 1
    },
    {
     "sec": "Projects / My Garage"
    },
    {
     "k": "f.carfinder",
     "l": "My Garage URL",
     "t": "text"
    },
    {
     "k": "f.openproject_url",
     "l": "OpenProject URL",
     "t": "text"
    },
    {
     "k": "f.project_testing_url",
     "l": "Testing Notes URL",
     "t": "text"
    },
    {
     "t": "projact",
     "span": 1,
     "btns": [
      {
       "l": "Create Redesign Project",
       "confirm": "Project does Not exist. Create it?"
      },
      {
       "l": "Create Unified Project Testing Notes",
       "confirm": "Testing Notes do not exist. Create them?"
      }
     ],
     "hint": "Launches the OpenProject provisioning job; the URL fills in on success."
    }
   ]
  },
  {
   "id": "zPeople",
   "t": "People",
   "s": "contacts · billing contact",
   "fields": [
    {
     "sec": "Primary Contact"
    },
    {
     "k": "contacts.c1.name",
     "l": "Name",
     "t": "text",
     "req": 1
    },
    {
     "k": "contacts.c1.phone",
     "l": "Phone",
     "t": "text",
     "req": 1
    },
    {
     "k": "contacts.c1.email",
     "l": "Email",
     "t": "text",
     "req": 1
    },
    {
     "sec": "Contact 2 / Marketing Contact"
    },
    {
     "k": "contacts.c2.name",
     "l": "Contact 2 Name",
     "t": "text"
    },
    {
     "k": "contacts.c2.phone",
     "l": "Contact 2 Phone",
     "t": "text"
    },
    {
     "k": "contacts.c2.email",
     "l": "Contact 2 Email",
     "t": "text"
    },
    {
     "k": "contacts.c3.name",
     "l": "Marketing Name",
     "t": "text"
    },
    {
     "k": "contacts.c3.phone",
     "l": "Marketing Phone",
     "t": "text"
    },
    {
     "k": "contacts.c3.email",
     "l": "Marketing Email",
     "t": "text"
    },
    {
     "sec": "Billing Contact"
    },
    {
     "k": "contacts.billing.name",
     "l": "Name",
     "t": "text"
    },
    {
     "k": "contacts.billing.phone",
     "l": "Phone",
     "t": "text"
    },
    {
     "k": "contacts.billing.emails",
     "l": "Billing Emails",
     "t": "repeat",
     "span": 1,
     "add": "+ email",
     "help": "One BILLING contact row is stored per email."
    }
   ]
  },
  {
   "id": "zAccess",
   "t": "Backend Access",
   "s": "the dealer's own login to this backend",
   "fields": [
    {
     "k": "f.admin_user",
     "l": "Admin User",
     "t": "text",
     "req": 1
    },
    {
     "k": "f.admin_pass",
     "l": "Admin Password",
     "t": "seal",
     "req": 1
    },
    {
     "k": "f.comments",
     "l": "Comments",
     "t": "area",
     "rows": 2,
     "span": 1
    }
   ]
  },
  {
   "id": "zComm",
   "t": "Commercials",
   "s": "service level · pricing · invoicing",
   "fields": [
    {
     "k": "f.service_level",
     "l": "Service Level",
     "t": "select",
     "opts": [
      {
       "v": "",
       "l": "—"
      },
      {
       "v": "1",
       "l": "Lot frame in"
      },
      {
       "v": "2",
       "l": "Standard"
      },
      {
       "v": "3",
       "l": "Custom"
      }
     ]
    },
    {
     "k": "f.price",
     "l": "Retail Price",
     "t": "selother",
     "opts": [
      {
       "v": "",
       "l": "—"
      },
      {
       "v": "199",
       "l": "$199"
      },
      {
       "v": "299",
       "l": "$299"
      },
      {
       "v": "399",
       "l": "$399"
      },
      {
       "v": "499",
       "l": "$499"
      }
     ],
     "ph": "other…"
    },
    {
     "k": "f.website_type",
     "l": "Website Type",
     "t": "select",
     "opts": [
      {
       "v": "",
       "l": "—"
      },
      {
       "v": "2",
       "l": "Template"
      },
      {
       "v": "3",
       "l": "Semi custom"
      },
      {
       "v": "4",
       "l": "Custom"
      },
      {
       "v": "5",
       "l": "Other"
      }
     ]
    },
    {
     "k": "f.custom_work",
     "l": "Custom Work",
     "t": "area",
     "rows": 2
    },
    {
     "k": "f.invoice_method",
     "l": "Invoice Method",
     "t": "select",
     "opts": [
      {
       "v": "",
       "l": "—"
      },
      {
       "v": "1",
       "l": "Bill dealership"
      },
      {
       "v": "2",
       "l": "Bill reseller"
      }
     ]
    },
    {
     "k": "f.additional_service",
     "l": "Additional Services",
     "t": "area",
     "rows": 2
    }
   ]
  },
  {
   "id": "zInteg",
   "t": "Integrations",
   "s": "carfax · leads · craigslist · rocketium",
   "fields": [
    {
     "k": "f.carFaxAP",
     "l": "CARFAX Automated Process",
     "t": "radio",
     "span": 1,
     "opts": [
      {
       "v": "0",
       "l": "Not processed"
      },
      {
       "v": "1",
       "l": "Own inventory"
      },
      {
       "v": "2",
       "l": "External inventory"
      }
     ],
     "help": "Mirrored into the dealer-site settings on save."
    },
    {
     "sec": "Lead Management"
    },
    {
     "k": "leadType",
     "l": "Type",
     "t": "text"
    },
    {
     "k": "leadReq",
     "l": "Requirements",
     "t": "area",
     "rows": 2
    },
    {
     "k": "f.lmsmailbox",
     "l": "AAN LMS Mailbox",
     "t": "text",
     "help": "Do NOT change once used by 3rd parties — @allautonetwork.net local-part."
    },
    {
     "sec": "Craigslist Post"
    },
    {
     "k": "f.craigslist_em",
     "l": "Email",
     "t": "text",
     "help": "Top 3 fields must be set for craigslist to work."
    },
    {
     "k": "f.craigslist_pw",
     "l": "Password",
     "t": "seal"
    },
    {
     "k": "f.craigslist_ph",
     "l": "Phone",
     "t": "text"
    },
    {
     "k": "f.craigslist_nm",
     "l": "Contact Name",
     "t": "text"
    },
    {
     "k": "f.latitude",
     "l": "Latitude",
     "t": "text"
    },
    {
     "k": "f.longitude",
     "l": "Longitude",
     "t": "text"
    },
    {
     "sec": "Rocketium Video"
    },
    {
     "k": "f.RocketiumVideo",
     "l": "Video Ranges",
     "t": "text",
     "help": "e.g. 1-15 or 2,3,5-15"
    }
   ]
  },
  {
   "id": "zWeb",
   "t": "Web & Domains",
   "s": "current site · registrar · up to 6 domains",
   "fields": [
    {
     "k": "websiteInfo.current_website",
     "l": "Current Website",
     "t": "text"
    },
    {
     "k": "websiteInfo.webmaster_name",
     "l": "Webmaster Name",
     "t": "text"
    },
    {
     "k": "websiteInfo.webmaster_phone",
     "l": "Webmaster Phone",
     "t": "text"
    },
    {
     "k": "websiteInfo.webmaster_email",
     "l": "Webmaster Email",
     "t": "text"
    },
    {
     "k": "websiteInfo.manufacture_site",
     "l": "Manufacturer Site",
     "t": "text"
    },
    {
     "k": "websiteInfo.manufacture_ftplogin",
     "l": "Manufacturer FTP Login",
     "t": "text"
    },
    {
     "k": "websiteInfo.manufacture_ftppass",
     "l": "Manufacturer FTP Password",
     "t": "seal"
    },
    {
     "k": "websiteInfo.website_comments",
     "l": "Comments",
     "t": "text"
    },
    {
     "k": "websiteInfo.domains",
     "l": "Domains 1–6",
     "t": "domains",
     "span": 1,
     "n": 6
    },
    {
     "k": "websiteInfo.repoint_from",
     "l": "Repoint From",
     "t": "text"
    },
    {
     "k": "websiteInfo.current_registrar",
     "l": "Registrar",
     "t": "text"
    },
    {
     "k": "websiteInfo.registrar_uname",
     "l": "Registrar Username",
     "t": "text"
    },
    {
     "k": "websiteInfo.registrar_pass",
     "l": "Registrar Password",
     "t": "seal"
    }
   ]
  },
  {
   "id": "zEmail",
   "t": "Email Routing",
   "s": "AAN email service — the dealership's mailboxes, forwards, and lead-notification format",
   "fields": [
    {
     "t": "routing",
     "k": "emailSetup",
     "span": 1,
     "hint": "No saved mailboxes yet — the four rows below are <b>suggested defaults</b>; a row is stored once it has an email address.",
     "cols": [
      "Email address",
      "Purpose",
      "Forward to",
      "Lead format"
     ],
     "add": "+ Add mailbox",
     "xref": "HTML = formatted email · XML = machine payload for CRM ingestion · unset is allowed. Runtime routing keys (e.g. <span class=\"mono\">cf_email</span>) live in Setup → Remote Settings."
    }
   ]
  },
  {
   "id": "zInv",
   "t": "Inventory & DMS",
   "s": "lot mgmt · photos · data imports",
   "fields": [
    {
     "sec": "Inventory Setup"
    },
    {
     "k": "inventoryInfo.current_lmp",
     "l": "Current LMP",
     "t": "text"
    },
    {
     "k": "inventoryInfo.photo_service",
     "l": "Photo Service",
     "t": "selother",
     "opts": [
      {
       "v": "",
       "l": ""
      },
      {
       "v": "Dealer",
       "l": "Dealer"
      },
      {
       "v": "AllAuctionNetwork",
       "l": "AllAuctionNetwork"
      },
      {
       "v": "Auto Exact",
       "l": "Auto Exact"
      },
      {
       "v": "Blu Solutions",
       "l": "Blu Solutions"
      },
      {
       "v": "Car Soup",
       "l": "Car Soup"
      },
      {
       "v": "CDM Data",
       "l": "CDM Data"
      },
      {
       "v": "Cyber Leads",
       "l": "Cyber Leads"
      },
      {
       "v": "Dealer Fusion",
       "l": "Dealer Fusion"
      },
      {
       "v": "Dealer Specialties",
       "l": "Dealer Specialties"
      },
      {
       "v": "DMI",
       "l": "DMI"
      },
      {
       "v": "Zennonn",
       "l": "Zennonn"
      },
      {
       "v": "Other",
       "l": "Other"
      }
     ],
     "ph": "other…"
    },
    {
     "k": "inventoryInfo.picture_management",
     "l": "Picture Management",
     "t": "selother",
     "opts": [
      {
       "v": "",
       "l": ""
      },
      {
       "v": "Data Feed",
       "l": "Data Feed"
      },
      {
       "v": "FTP",
       "l": "FTP"
      },
      {
       "v": "Admin",
       "l": "Admin"
      },
      {
       "v": "Other",
       "l": "Other"
      }
     ],
     "ph": "other…"
    },
    {
     "k": "inventoryInfo.vehicles_types",
     "l": "Vehicle Types",
     "t": "checks",
     "span": 1,
     "opts": [
      {
       "v": "new",
       "l": "New"
      },
      {
       "v": "used",
       "l": "Used"
      },
      {
       "v": "certified",
       "l": "Certified"
      }
     ]
    },
    {
     "sec": "DMS Intake"
    },
    {
     "k": "dms.dms_import",
     "l": "DMS Import",
     "t": "radio",
     "span": 1,
     "opts": [
      {
       "v": "yes",
       "l": "Yes"
      },
      {
       "v": "no",
       "l": "No"
      }
     ],
     "help": "Intake spec only — live feed control stays in Feed Management."
    }
   ]
  }
 ],
 "flagList": [
  {
   "k": "flags.no_report",
   "l": "Exclude From Reports",
   "why": "Hidden from cross-dealer reporting"
  },
  {
   "k": "flags.marketing_package",
   "l": "Marketing Package",
   "why": "Counts toward marketing-dealer lists"
  },
  {
   "k": "flags.utm_tracking",
   "l": "UTM Tracking",
   "why": "Appends UTM params to lead sources"
  },
  {
   "k": "flags.ai_description",
   "l": "AI Description",
   "why": "AI vehicle descriptions in VMS"
  },
  {
   "k": "flags.logins_approved",
   "l": "Global Whitelist Site Content Manager",
   "why": "⚠ toggling cascades: revokes dealer-user permissions + IP whitelist",
   "cascade": 1
  }
 ],
 "records": {
  "186": {
   "id": 186,
   "title": "Edit Dealer — Miller Motorcars",
   "name": "Miller Motorcars",
   "badges": [
    {
     "l": "Active",
     "tone": "green"
    },
    {
     "l": "Billing ✓",
     "tone": "blue"
    }
   ],
   "db": {
    "l": "millermotorcars · Server 2",
    "href": "https://newbackendcert.aandemo.com/manage/dealers/186/setup#tab-dbsetup",
    "title": "Dealer database — Setup → DB Setup"
   },
   "audit": [
    {
     "l": "Created",
     "v": "12/09/2010"
    },
    {
     "l": "Modified",
     "v": "03/06/2026"
    }
   ],
   "quick": [
    {
     "l": "Setup",
     "href": "https://newbackendcert.aandemo.com/manage/dealers/186/setup"
    },
    {
     "l": "Packages",
     "href": "https://newbackendcert.aandemo.com/manage/packages"
    },
    {
     "l": "Control Panel",
     "href": "https://newbackendcert.aandemo.com/manage/dealers/186/cp",
     "ext": 1
    },
    {
     "l": "www.millermotorcars.com",
     "href": "https://www.millermotorcars.com",
     "ext": 1
    }
   ],
   "dots": {
    "zIdent": "green",
    "zPeople": "green",
    "zAccess": "green",
    "zComm": "grey",
    "zInteg": "grey",
    "zWeb": "amber",
    "zEmail": "grey",
    "zInv": "grey"
   },
   "save": {
    "primary": "Save Dealer",
    "temp": false
   },
   "notes": [
    {
     "who": "06/24/22 2:06 pm — Karen Conrad",
     "txt": "SEO Marketing Program"
    }
   ],
   "flags": {
    "flags.no_report": false,
    "flags.marketing_package": true,
    "flags.utm_tracking": false,
    "flags.ai_description": true,
    "flags.logins_approved": true
   },
   "lock": true,
   "v": {
    "f.status": "A",
    "flags.bill_stat": true,
    "f.reseller_id": "42",
    "f.oem_id": "0",
    "f.company_name": "Miller Motorcars",
    "f.web": "www.millermotorcars.com",
    "f.multi_dealer": "N",
    "f.address": "342 West Putnam",
    "f.city": "Greenwich",
    "f.state": "CT",
    "f.zip": "06803",
    "f.phone": "203.629.3890",
    "f.fax": "",
    "f.start_date": "2010-12-09",
    "f.carfinder": "my-garage/",
    "f.openproject_url": "",
    "f.project_testing_url": "",
    "contacts.c1.name": "Matthew Horowitz",
    "contacts.c1.phone": "203-900-4883",
    "contacts.c1.email": "mhorowitz@millermotorcars.com",
    "contacts.c2.name": "F. Bailey Vanneck",
    "contacts.c2.phone": "203.629.3890",
    "contacts.c2.email": "BVanneck@millermotorcars.com",
    "contacts.c3.name": "",
    "contacts.c3.phone": "",
    "contacts.c3.email": "",
    "contacts.billing.name": "Deborah Andujarah",
    "contacts.billing.phone": "203-629-4726 ext. 151",
    "contacts.billing.emails": [
     "mhorowitz@millermotorcars.com",
     "accountspayable@millermotorcars.com"
    ],
    "f.admin_user": "millermotorcars",
    "f.admin_pass": "__SEALED__",
    "f.comments": "",
    "f.service_level": "",
    "f.price": "0",
    "f.website_type": "",
    "f.custom_work": "",
    "f.invoice_method": "",
    "f.additional_service": "",
    "f.carFaxAP": "1",
    "leadType": "",
    "leadReq": "",
    "f.lmsmailbox": "",
    "f.craigslist_em": "",
    "f.craigslist_pw": "",
    "f.craigslist_ph": "",
    "f.craigslist_nm": "",
    "f.latitude": "0",
    "f.longitude": "0",
    "f.RocketiumVideo": "",
    "websiteInfo.current_website": "www.millermotorcars.com",
    "websiteInfo.webmaster_name": "",
    "websiteInfo.webmaster_phone": "",
    "websiteInfo.webmaster_email": "",
    "websiteInfo.manufacture_site": "",
    "websiteInfo.manufacture_ftplogin": "",
    "websiteInfo.manufacture_ftppass": "",
    "websiteInfo.website_comments": "",
    "websiteInfo.domains": [
     "",
     "",
     "",
     "",
     "",
     ""
    ],
    "websiteInfo.repoint_from": "",
    "websiteInfo.current_registrar": "",
    "websiteInfo.registrar_uname": "",
    "websiteInfo.registrar_pass": "",
    "emailSetup": [
     {
      "email_address": "",
      "email_description": "Contacts/Leads",
      "email_forward": "",
      "email_format": ""
     },
     {
      "email_address": "",
      "email_description": "Finance",
      "email_forward": "",
      "email_format": ""
     },
     {
      "email_address": "",
      "email_description": "Service",
      "email_forward": "",
      "email_format": ""
     },
     {
      "email_address": "",
      "email_description": "Parts",
      "email_forward": "",
      "email_format": ""
     }
    ],
    "emailSetupSaved": false,
    "inventoryInfo.current_lmp": "",
    "inventoryInfo.photo_service": "",
    "inventoryInfo.picture_management": "",
    "inventoryInfo.vehicles_types": [],
    "dms.dms_import": "no"
   }
  },
  "1144": {
   "id": 1144,
   "title": "Edit Dealer — Beat The Trade",
   "name": "Beat The Trade",
   "badges": [
    {
     "l": "Client Intake",
     "tone": "amber"
    }
   ],
   "db": null,
   "audit": [
    {
     "l": "Created",
     "v": "09/04/2026"
    },
    {
     "l": "Modified",
     "v": "—"
    }
   ],
   "quick": [
    {
     "l": "Setup",
     "href": "https://newbackendcert.aandemo.com/manage/dealers/1144/setup"
    },
    {
     "l": "Packages",
     "href": "https://newbackendcert.aandemo.com/manage/packages"
    },
    {
     "l": "Control Panel",
     "href": "https://newbackendcert.aandemo.com/manage/dealers/1144/cp",
     "ext": 1
    },
    {
     "l": "www.BeatTheTrade.com",
     "href": "https://www.BeatTheTrade.com",
     "ext": 1
    }
   ],
   "dots": {
    "zIdent": "green",
    "zPeople": "green",
    "zAccess": "green",
    "zComm": "grey",
    "zInteg": "grey",
    "zWeb": "grey",
    "zEmail": "grey",
    "zInv": "grey"
   },
   "save": {
    "primary": "Save Dealer",
    "temp": false
   },
   "notes": [],
   "flags": {
    "flags.no_report": false,
    "flags.marketing_package": false,
    "flags.utm_tracking": false,
    "flags.ai_description": false,
    "flags.logins_approved": false
   },
   "lock": true,
   "v": {
    "f.status": "T",
    "flags.bill_stat": false,
    "f.reseller_id": "1",
    "f.oem_id": "0",
    "f.company_name": "Beat The Trade",
    "f.web": "www.BeatTheTrade.com",
    "f.multi_dealer": "N",
    "f.address": "123 Haven St, Suite 113",
    "f.city": "Reading",
    "f.state": "MA",
    "f.zip": "01867",
    "f.phone": "781-205-0720",
    "f.fax": "",
    "f.start_date": "2026-09-04",
    "f.carfinder": "",
    "f.openproject_url": "",
    "f.project_testing_url": "",
    "contacts.c1.name": "John Tawadros",
    "contacts.c1.phone": "781-205-0720",
    "contacts.c1.email": "jt@BeatTheTrade.com",
    "contacts.c2.name": "",
    "contacts.c2.phone": "",
    "contacts.c2.email": "",
    "contacts.c3.name": "",
    "contacts.c3.phone": "",
    "contacts.c3.email": "",
    "contacts.billing.name": "John Tawadros",
    "contacts.billing.phone": "781-205-0720",
    "contacts.billing.emails": [
     "jt@BeatTheTrade.com"
    ],
    "f.admin_user": "beatthetrade",
    "f.admin_pass": "__SEALED__",
    "f.comments": "",
    "f.service_level": "",
    "f.price": "",
    "f.website_type": "",
    "f.custom_work": "",
    "f.invoice_method": "",
    "f.additional_service": "",
    "f.carFaxAP": "0",
    "leadType": "",
    "leadReq": "",
    "f.lmsmailbox": "",
    "f.craigslist_em": "",
    "f.craigslist_pw": "",
    "f.craigslist_ph": "",
    "f.craigslist_nm": "",
    "f.latitude": "",
    "f.longitude": "",
    "f.RocketiumVideo": "",
    "websiteInfo.current_website": "",
    "websiteInfo.webmaster_name": "",
    "websiteInfo.webmaster_phone": "",
    "websiteInfo.webmaster_email": "",
    "websiteInfo.manufacture_site": "",
    "websiteInfo.manufacture_ftplogin": "",
    "websiteInfo.manufacture_ftppass": "",
    "websiteInfo.website_comments": "",
    "websiteInfo.domains": [
     "",
     "",
     "",
     "",
     "",
     ""
    ],
    "websiteInfo.repoint_from": "",
    "websiteInfo.current_registrar": "",
    "websiteInfo.registrar_uname": "",
    "websiteInfo.registrar_pass": "",
    "emailSetup": [
     {
      "email_address": "",
      "email_description": "Contacts/Leads",
      "email_forward": "",
      "email_format": ""
     },
     {
      "email_address": "",
      "email_description": "Finance",
      "email_forward": "",
      "email_format": ""
     },
     {
      "email_address": "",
      "email_description": "Service",
      "email_forward": "",
      "email_format": ""
     },
     {
      "email_address": "",
      "email_description": "Parts",
      "email_forward": "",
      "email_format": ""
     }
    ],
    "emailSetupSaved": false,
    "inventoryInfo.current_lmp": "",
    "inventoryInfo.photo_service": "",
    "inventoryInfo.picture_management": "",
    "inventoryInfo.vehicles_types": [],
    "dms.dms_import": "no"
   }
  },
  "new": {
   "id": null,
   "title": "Add New Dealer",
   "name": "",
   "meta": "status will default to Client Intake / New Order",
   "badges": [],
   "db": null,
   "audit": [],
   "quick": [],
   "dots": {
    "zIdent": "grey",
    "zPeople": "grey",
    "zAccess": "grey",
    "zComm": "grey",
    "zInteg": "grey",
    "zWeb": "grey",
    "zEmail": "grey",
    "zInv": "grey"
   },
   "save": {
    "primary": "Create Dealer",
    "temp": true,
    "tempTitle": "Stores the dealer disabled (enabled=0)"
   },
   "notes": null,
   "flags": null,
   "lock": false,
   "v": {
    "f.reseller_id": "",
    "f.oem_id": "0",
    "f.company_name": "",
    "f.web": "",
    "f.multi_dealer": "N",
    "f.address": "",
    "f.city": "",
    "f.state": "",
    "f.zip": "",
    "f.phone": "",
    "f.fax": "",
    "f.start_date": "",
    "f.carfinder": "",
    "f.openproject_url": "",
    "f.project_testing_url": "",
    "contacts.c1.name": "",
    "contacts.c1.phone": "",
    "contacts.c1.email": "",
    "contacts.c2.name": "",
    "contacts.c2.phone": "",
    "contacts.c2.email": "",
    "contacts.c3.name": "",
    "contacts.c3.phone": "",
    "contacts.c3.email": "",
    "contacts.billing.name": "",
    "contacts.billing.phone": "",
    "contacts.billing.emails": [
     ""
    ],
    "f.admin_user": "",
    "f.admin_pass": "",
    "f.comments": "",
    "f.service_level": "",
    "f.price": "",
    "f.website_type": "",
    "f.custom_work": "",
    "f.invoice_method": "",
    "f.additional_service": "",
    "f.carFaxAP": "",
    "leadType": "",
    "leadReq": "",
    "f.lmsmailbox": "",
    "f.craigslist_em": "",
    "f.craigslist_pw": "",
    "f.craigslist_ph": "",
    "f.craigslist_nm": "",
    "f.latitude": "",
    "f.longitude": "",
    "f.RocketiumVideo": "",
    "websiteInfo.current_website": "",
    "websiteInfo.webmaster_name": "",
    "websiteInfo.webmaster_phone": "",
    "websiteInfo.webmaster_email": "",
    "websiteInfo.manufacture_site": "",
    "websiteInfo.manufacture_ftplogin": "",
    "websiteInfo.manufacture_ftppass": "",
    "websiteInfo.website_comments": "",
    "websiteInfo.domains": [
     "",
     "",
     "",
     "",
     "",
     ""
    ],
    "websiteInfo.repoint_from": "",
    "websiteInfo.current_registrar": "",
    "websiteInfo.registrar_uname": "",
    "websiteInfo.registrar_pass": "",
    "emailSetup": [
     {
      "email_address": "",
      "email_description": "Contacts/Leads",
      "email_forward": "",
      "email_format": ""
     },
     {
      "email_address": "",
      "email_description": "Finance",
      "email_forward": "",
      "email_format": ""
     },
     {
      "email_address": "",
      "email_description": "Service",
      "email_forward": "",
      "email_format": ""
     },
     {
      "email_address": "",
      "email_description": "Parts",
      "email_forward": "",
      "email_format": ""
     }
    ],
    "emailSetupSaved": false,
    "inventoryInfo.current_lmp": "",
    "inventoryInfo.photo_service": "",
    "inventoryInfo.picture_management": "",
    "inventoryInfo.vehicles_types": [],
    "dms.dms_import": "no"
   }
  }
 }
};
