/* AAN · Staff UI · Feeds Incoming — GENERATION 11 · fixture

   Read from the new backend (newbackendcert, /manage/feeds/inc) on 2026-11-17,
   read only. The roster has 364 dealers (A 319 · P 25 · T 20) and 102 incoming
   feeds on 69 of them; 295 dealers have none; 9 feeds are switched off.
   This sample carries 24 of the 69 dealers with feeds, picked to cover every
   case the screen has to show: several feeds on one dealer (up to 14), feeds
   switched off, file times weeks or months old, Pending dealers, and all six
   image modes. Values are the live ones; nothing is invented.

   feed = [name, file time, tag, image mode, runs in the last 24 h, on (1/0)] */
window.FI = {
  counts: { dealers: 364, A: 319, P: 25, T: 20, feeds: 102, withFeeds: 69, noFeeds: 295, off: 9 },
  /* the export's legend for the account mark and the image modes (titles as the backend ships them) */
  marks: { A: 'Active', P: 'Pending', T: 'Client Intake' },
  images: {
    NE: 'Overwrite if not equal', NM: 'Overwrite if not empty', RI: 'Replace images',
    MO: 'Overwrite main image only', GF: 'Overwrite if greater in feed', AO: 'Always overwrite'
  },
  statuses: ['All Statuses', 'No Feeds', 'Inactive', 'Outdated feed file'],
  tags: ['AutoFunds', 'DealerCarSearch', 'ebizautos', 'eCarList', 'eCarlist - FEX', 'KGIDealerSolutions', 'Netlook', 'SpeedDigital', 'vAuto'],
  /* the backend's main log for today, as the modal shows it */
  mainLog: { date: '2026/11/17', text: "Today's log not found!" },
  rows: [
    ['A', 873, 'A X A Boston', [
      ['vAuto-AXABoston_CadillacNorwood', '11/12/2026, 9:46:12 PM', 'vAuto', 'NE', 0, 1],
      ['vAuto-AXABoston_LotusAstonMartinBoston', '11/12/2026, 9:46:12 PM', 'vAuto', 'NE', 0, 1]]],
    ['A', 878, 'Autobyzack Inc', [['vAuto-Autobyzack Inc', '11/12/2026, 9:46:12 PM', 'vAuto', 'MO', 0, 1]]],
    ['A', 900, 'Beverly Hills Auto Group', [['DealrCloud - Beverly Hills Auto Group', '11/12/2026, 10:05:56 PM', '', 'NM', 0, 1]]],
    ['A', 1034, 'Blackdog Performance Cars', [['Frazer - Blackdog Performance Cars', '10/28/2026, 1:02:19 PM', '', '', 0, 1]]],
    ['A', 252, 'Cauley Ferrari', [['Homenet_Ferrari_Vin_Ver-CauleyFerrari', '11/12/2026, 8:25:16 PM', '', 'RI', 0, 1]]],
    ['A', 986, 'Clutch', [['Dealer Center - Clutch', '9/17/2026, 11:08:24 AM', '', '', 0, 0]]],
    ['A', 1068, 'Design Auto LLC', [
      ['vAuto (DesignAuto) - Bentley Pasadena', '11/12/2026, 9:46:12 PM', 'vAuto', '', 0, 1],
      ['DealrCloud (Non-AAN) - Blue Chip Services LLC', '11/12/2026, 10:05:56 PM', '', '', 0, 1],
      ['vAuto (DesignAuto) - HBI Auto', '11/12/2026, 9:46:12 PM', 'vAuto', '', 0, 1],
      ['eCarList (Design Auto) - Mark Motors Boerne', '11/12/2026, 9:40:55 PM', 'eCarList', '', 0, 1],
      ['eCarList (Design Auto) - Mark Motors Austin', '11/12/2026, 9:40:55 PM', 'eCarList', '', 0, 1],
      ['Dealer Center (Design Auto) - Young Motorcars', '11/12/2026, 5:43:19 PM', '', '', 0, 1],
      ['Dealer Car Search (Design Auto) - Brooklyn Auto Sales', '11/11/2026, 11:05:09 PM', 'DealerCarSearch', '', 0, 1],
      ['Dealer Center (Design Auto) - RP Exotics', '11/12/2026, 5:43:19 PM', '', '', 0, 1],
      ['eCarList FEX (Design Auto) - Motorenn', '11/11/2026, 11:00:22 PM', 'eCarlist - FEX', '', 0, 1],
      ['RV One Data (Design Auto) - Southern Luxury Sales', '11/12/2026, 9:05:04 PM', '', '', 0, 1],
      ['vAuto (DesignAuto) - Salt Lake City Motorcars', '11/12/2026, 9:46:12 PM', 'vAuto', '', 0, 1],
      ['Artura (Design Auto) - Tampa Auto Gallery', '8/19/2026, 1:00:47 PM', '', '', 0, 1],
      ["vAuto (DesignAuto) - O'Gara Coach", '11/12/2026, 9:46:12 PM', 'vAuto', '', 0, 1],
      ['vAuto (DesignAuto) - Cleveland Motorsports', '11/12/2026, 9:46:12 PM', 'vAuto', '', 0, 1]]],
    ['A', 1123, 'Drive Max USA', [['DealrCloud - Drive Max USA', '11/12/2026, 10:05:56 PM', '', 'NM', 0, 1]]],
    ['A', 772, 'duPont REGISTRY Select - West Coast Exotic Cars', [
      ['Homenet_WestCoastExoticCars', '11/12/2026, 3:15:13 AM', '', '', 0, 1],
      ['vAuto - duPont REGISTRY Select - Naples', '11/12/2026, 9:46:12 PM', 'vAuto', '', 0, 1],
      ['vAuto - duPont REGISTRY Select - Miami', '11/12/2026, 9:46:12 PM', 'vAuto', '', 0, 1]]],
    ['A', 306, 'Exclusive Automotive Group', [
      ['Homenet_ExclusiveAutoGroup (New)', '11/12/2026, 9:41:26 PM', '', '', 0, 1],
      ['vAuto-Exclusive Automotive Group (Used)', '11/12/2026, 9:46:12 PM', 'vAuto', '', 0, 1]]],
    ['A', 524, 'Executive Auto Sales', [['Frazer - Executive Auto Sales', '11/12/2026, 9:00:10 PM', '', 'GF', 0, 1]]],
    ['A', 368, 'FC Kerbeck - Bentley', [
      ['Homenet_FCKerbeckMaserati', '11/12/2026, 9:12:26 PM', '', 'NE', 0, 1],
      ['Homenet_FCKerbeckCadillac', '11/12/2026, 7:55:21 PM', '', 'NE', 0, 1],
      ['Homenet_FCKerbeck', '11/12/2026, 9:02:30 PM', '', '', 0, 1],
      ['Homenet_FCKerbeckGM', '11/12/2026, 7:54:36 PM', '', 'NE', 0, 1]]],
    ['A', 1118, 'Ferrari of Quebec', [['Homenet_Ferrari_Vin_Ver-Quebec', '11/12/2026, 8:29:48 PM', '', 'RI', 0, 1]]],
    ['A', 1129, 'GM Motors Inc.', [['DealrCloud - GM Motors Inc', '11/12/2026, 10:05:55 PM', '', 'NM', 0, 1]]],
    ['P', 1099, 'Key Cars Auto Group (aka JJ Motor Company) - Genesis of Milford', [['vAuto-Key_Cars_Auto_Group', '11/12/2026, 9:46:12 PM', 'vAuto', 'NE', 0, 1]]],
    ['A', 888, 'Montis Auto Center', [['MontisAutoCenter-DescriptionFeed(one time)', '10/20/2026, 11:10:56 AM', '', '', 0, 0]]],
    ['A', 822, 'Motorcars of Palm Beach', [
      ['ChromeCertifiedInventory (Accutrade) - Motorcars of Palm Beach', '11/12/2026, 10:02:15 PM', '', '', 0, 1],
      ['CarCutter (Images Only) - Motorcars of Palm Beach', '11/10/2026, 6:14:37 PM', '', 'AO', 0, 1]]],
    ['P', 1010, 'MotorcarsOnline.com', [['Homenet_MotorcarsOnline', '11/12/2026, 8:22:37 PM', '', 'NE', 0, 1]]],
    ['P', 1044, 'OC Auto Haus', [['automanager - OC Auto Haus', '3/6/2026, 8:16:42 AM', '', 'NE', 0, 0]]],
    ['P', 953, 'Ogara Coach Beverly Hills', [
      ['vAuto-OGara Westlake Village', '11/12/2026, 9:46:12 PM', 'vAuto', 'NE', 0, 0],
      ['vAuto-OGara Beverly Hills', '11/12/2026, 9:46:12 PM', 'vAuto', 'NE', 0, 0],
      ['vAuto-OGara La Jolla', '11/12/2026, 9:46:12 PM', 'vAuto', 'NE', 0, 0]]],
    ['A', 1095, 'Prestige Imports', [['Chrome Certified Inventory (ICC) - Prestige Imports', '11/5/2026, 1:02:11 AM', '', 'NE', 0, 0]]],
    ['A', 850, 'Private Collection Motors Inc', [
      ['eCarList - Private Collection Motors Inc', '11/12/2026, 9:40:55 PM', 'eCarList', '', 0, 1],
      ['Dealer Center - Private Collection Motors Inc', '6/29/2026, 11:17:35 AM', '', '', 0, 0]]],
    ['A', 972, 'Towbin Motorcars', [
      ['NetLook - Towbin Motorcars (Images Only)', '11/12/2026, 12:01:13 AM', 'Netlook', 'NM', 0, 1],
      ['vAuto-TowbinMotorcars', '11/12/2026, 9:46:12 PM', 'vAuto', '', 0, 1],
      ['Homenet_Ferrari_Vin_Ver-Towbin_Motorcars', '11/12/2026, 6:46:39 PM', '', '', 0, 1]]],
    ['A', 213, 'zz-AAN-Dev-Dmitriy', [['Loader Test', '8/27/2026, 11:54:40 AM', '', 'NE', 0, 0]]]
  ]
};
