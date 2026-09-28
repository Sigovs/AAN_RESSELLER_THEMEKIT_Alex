/* ==========================================================================
   AAN . Dealer UI . Single Vehicle - GENERATION 11 . fixture data

   Every value below was read out of the production export at
   aan-design-export-2026-09-09/pages/. Nothing here was invented.

     V1  d05-vehicle-editor-1.html   2023 Ferrari 812 GTS  - everything full, 64 photos
     V2  d05-vehicle-editor-2.html   2026 AGROTK KKTA27    - new unit, short description
     V3  d05-vehicle-editor-3.html   2019 Porsche 911      - warning state: $0, no photos,
                                                             empty description

   The cockpit's prev / next buttons walk these three, which is what they do in
   the export (they link to the previous and next vehicle in the current list).

   Two gaps, stated rather than filled:
     . only the Ferrari's main thumbnail exists in this kit
       (pages/dealer/img/277624e2-13868_main_t.jpg - the same file
       all-vehicles-gen11.data.js maps to stock 0P0300236 PS). Every other photo
       tile renders as a marked placeholder; the counts are the export's own.
     . main_text_1 for the Ferrari is the export's stored HTML with the Google
       paste-noise attributes stripped from its <br> and <div> tags. No visible
       text was changed, added or removed.
   ========================================================================== */
(function () {
  'use strict';

  /* the dealer's 31 marketplace feeds - name and token, exactly as the export lists them */
  var FEEDS = [["Autotrader_used", "n_1844"], ["EBay Motors", "n_2108"], ["EBay Motors", "n_2109"], ["Liquid Motors - Chicago Motor Cars", "n_2177"], ["GlobalAutoSports - Chicago Motor Cars - East", "n_2220"], ["GlobalAutoSports - Chicago Motor Cars - West", "n_2221"], ["GlobalAutoSports - Chicago Motor Cars - Naperville", "n_2222"], ["dupont_chicagomotorcars", "n_2245"], ["CarsForSale - Chicago Motor Cars", "n_2298"], ["CarGuru", "n_2722"], ["CarGuru", "n_2724"], ["CarGuru", "n_2725"], ["DoubleClutch", "n_2902"], ["Cars.com (Inventory Command Center) - Chicago Motor Cars", "n_3119"], ["eCarList_ChicagoMotorCars", "n_3120"], ["Homenet - (VIN Solutions) Chicago Motor Cars", "n_3121"], ["Homenet - Chicago Motor Cars East", "n_3137"], ["CommercialTruckTrader - Chicago Motor Cars", "n_3151"], ["Vast(Carfax)", "n_3383"], ["CUDL - Chicago Motor Cars", "n_3437"], ["Authenticom", "n_3759"], ["Liquid Motors - Chicago Motor Cars - SC", "n_3764"], ["Liquid Motors - Chicago Motor Cars - Naperville", "n_3765"], ["Classic.com - Chicago Motor Cars", "n_4205"], ["Design Auto - Chicago Motor Cars", "n_4304"], ["Cars.com (Inventory Command Center) - Chicago Motor Cars SC", "n_4314"], ["MPH", "n_4320"], ["AutosToday - Chicago Motor Cars", "n_4447"], ["RV Trader - Chicago Motor Cars", "n_4457"], ["Custom Cars - Chicago Motor Cars", "n_4601"], ["DealerCenter - Nowcom", "n_4647"]];

  /* Standard equipment, as stored in the features XML: category . value pairs */
  var STD_FERRARI = [["Entertainment_and_Technology", "Audio System : Antenna type : diversity"], ["Entertainment_and_Technology", "Audio System : Antenna type : element"], ["Entertainment_and_Technology", "Audio System : Auxiliary audio input : Bluetooth"], ["Entertainment_and_Technology", "Audio System : Auxiliary audio input : iPod/iPhone"], ["Entertainment_and_Technology", "Audio System : Auxiliary audio input : jack"], ["Entertainment_and_Technology", "Audio System : Auxiliary audio input : USB"], ["Entertainment_and_Technology", "Audio System : Hard drive"], ["Entertainment_and_Technology", "Audio System : Radio : AM/FM"], ["Entertainment_and_Technology", "Audio System : Radio : voice operated"], ["Entertainment_and_Technology", "Audio System : Radio data system"], ["Entertainment_and_Technology", "Audio System : Satellite radio : SiriusXM"], ["Entertainment_and_Technology", "Audio System : Speed sensitive volume control"], ["Entertainment_and_Technology", "Audio System : Total speakers : 6"], ["Entertainment_and_Technology", "Telematics : Electronic messaging assistance : voice operated"], ["Entertainment_and_Technology", "Telematics : Electronic messaging assistance : with read function"], ["Entertainment_and_Technology", "Telematics : Hands-free phone call integration : voice operated"], ["Entertainment_and_Technology", "Telematics : Navigation system : hard drive"], ["Entertainment_and_Technology", "Telematics : Navigation system : voice operated"], ["Entertainment_and_Technology", "Telematics : Wireless data link : Bluetooth"], ["Exterior", "Exterior Features : Active grille shutters"], ["Exterior", "Exterior Features : Door handle color : body-color"], ["Exterior", "Exterior Features : Exhaust : quad tip"], ["Exterior", "Exterior Features : Exhaust tip color : stainless steel"], ["Exterior", "Exterior Features : Front bumper color : body-color"], ["Exterior", "Exterior Features : Grille color : black"], ["Exterior", "Exterior Features : Ground effects/lower spoilers"], ["Exterior", "Exterior Features : Mirror color : body-color"], ["Exterior", "Exterior Features : Rear bumper color : body-color"], ["Exterior", "Exterior Features : Rear spoiler : lip"], ["Exterior", "Exterior Features : Rear spoiler color : body-color"], ["Exterior", "Exterior Features : Rocker panel color : black"], ["Exterior", "Exterior Features : Window trim : black"], ["Exterior", "Lights : Daytime running lights : LED"], ["Exterior", "Lights : Exterior entry lights : approach lamps"], ["Exterior", "Lights : Headlights : auto delay off"], ["Exterior", "Lights : Headlights : auto on/off"], ["Exterior", "Lights : Headlights : LED"], ["Exterior", "Lights : Rear fog lights"], ["Exterior", "Lights : Taillights : LED"], ["Exterior", "Mirrors : Side mirror adjustments : power"], ["Exterior", "Mirrors : Side mirror adjustments : power folding"], ["Exterior", "Mirrors : Side mirrors : heated"], ["Exterior", "Roof : Convertible rear window : glass"], ["Exterior", "Roof : Convertible roof : power retractable hard top"], ["Exterior", "Roof : Convertible roof wind blocker"], ["Exterior", "Wheels and Tires : Spare tire kit : inflator kit"], ["Exterior", "Wheels and Tires : Spare tire kit : tire sealant"], ["Exterior", "Wheels and Tires : Tire Pressure Monitoring System"], ["Exterior", "Wheels and Tires : Wheels : aluminum alloy"], ["Exterior", "Windows : Front wipers : rain sensing"], ["Exterior", "Windows : Front wipers : variable intermittent"], ["Exterior", "Windows : Power windows : safety reverse"], ["Exterior", "Windows : Tinted glass"], ["Exterior", "Windows : Window defogger : rear"], ["Interior", "Air Conditioning : Air filtration"], ["Interior", "Air Conditioning : Front air conditioning : automatic climate control"], ["Interior", "Air Conditioning : Front air conditioning zones : dual"], ["Interior", "Comfort Features : Center console trim : leather"], ["Interior", "Comfort Features : Dash trim : leather"], ["Interior", "Comfort Features : Door sill trim : aluminum"], ["Interior", "Comfort Features : Door trim : leather"], ["Interior", "Comfort Features : Floor mat material : carpet"], ["Interior", "Comfort Features : Floor material : carpet"], ["Interior", "Comfort Features : Floor mats : front"], ["Interior", "Comfort Features : Foot pedal trim : aluminum"], ["Interior", "Comfort Features : Interior accents : aluminum"], ["Interior", "Comfort Features : Steering wheel trim : leather"], ["Interior", "Convenience Features : Capless fuel filler system"], ["Interior", "Convenience Features : Cargo area light"], ["Interior", "Convenience Features : Cargo cover : hard"], ["Interior", "Convenience Features : Center console : front console with armrest and storage"], ["Interior", "Convenience Features : Cruise control"], ["Interior", "Convenience Features : Cupholders : front"], ["Interior", "Convenience Features : Multi-function remote : keyless entry"], ["Interior", "Convenience Features : Multi-function remote : panic alarm"], ["Interior", "Convenience Features : Multi-function remote : trunk release"], ["Interior", "Convenience Features : One-touch windows : 2"], ["Interior", "Convenience Features : Overhead console : front"], ["Interior", "Convenience Features : Power outlet(s) : 12V front"], ["Interior", "Convenience Features : Power outlet(s) : USB front"], ["Interior", "Convenience Features : Power steering : electric"], ["Interior", "Convenience Features : Power steering : variable/speed-proportional"], ["Interior", "Convenience Features : Push-button start"], ["Interior", "Convenience Features : Reading lights : front"], ["Interior", "Convenience Features : Rearview mirror : auto-dimming"], ["Interior", "Convenience Features : Steering wheel : tilt and telescopic"], ["Interior", "Convenience Features : Steering wheel mounted controls : audio"], ["Interior", "Convenience Features : Steering wheel mounted controls : multi-function"], ["Interior", "Convenience Features : Steering wheel mounted controls : paddle shifter"], ["Interior", "Convenience Features : Steering wheel mounted controls : phone"], ["Interior", "Convenience Features : Steering wheel mounted controls : voice control"], ["Interior", "Convenience Features : Storage : cargo tie-down anchors and hooks"], ["Interior", "Convenience Features : Storage : door pockets"], ["Interior", "Convenience Features : Tool kit"], ["Interior", "Convenience Features : Vanity mirrors : passenger illuminating"], ["Interior", "Instrumentation : Clock"], ["Interior", "Instrumentation : Compass"], ["Interior", "Instrumentation : Customizable instrument cluster"], ["Interior", "Instrumentation : Digital odometer"], ["Interior", "Instrumentation : External temperature display"], ["Interior", "Instrumentation : Fuel economy display : MPG"], ["Interior", "Instrumentation : Fuel economy display : range"], ["Interior", "Instrumentation : Gauge : tachometer"], ["Interior", "Instrumentation : Instrument cluster screen size : 5 in. (dual)"], ["Interior", "Instrumentation : Multi-function display"], ["Interior", "Instrumentation : Trip odometer"], ["Interior", "Instrumentation : Warnings and reminders : coolant temperature warning"], ["Interior", "Instrumentation : Warnings and reminders : lamp failure"], ["Interior", "Instrumentation : Warnings and reminders : low battery"], ["Interior", "Instrumentation : Warnings and reminders : low fuel level"], ["Interior", "Instrumentation : Warnings and reminders : low oil pressure"], ["Interior", "Instrumentation : Warnings and reminders : low washer fluid"], ["Interior", "Instrumentation : Warnings and reminders : maintenance due"], ["Interior", "Seats : Driver seat power adjustments : 8"], ["Interior", "Seats : Driver seat power adjustments : height"], ["Interior", "Seats : Driver seat power adjustments : reclining"], ["Interior", "Seats : Front headrests : 2"], ["Interior", "Seats : Front headrests : integrated"], ["Interior", "Seats : Front seat type : sport bucket"], ["Interior", "Seats : Passenger seat power adjustments : 8"], ["Interior", "Seats : Passenger seat power adjustments : height"], ["Interior", "Seats : Passenger seat power adjustments : reclining"], ["Interior", "Seats : Upholstery : premium leather"], ["Performance", "Powertrain : Auto start/stop"], ["Performance", "Powertrain : Auxiliary oil cooler"], ["Performance", "Powertrain : Battery : maintenance-free"], ["Performance", "Powertrain : Battery saver"], ["Performance", "Powertrain : Drive mode selector"], ["Performance", "Powertrain : Limited slip differential : rear"], ["Performance", "Powertrain : Performance exhaust"], ["Performance", "Suspension : 4-Wheel steering"], ["Performance", "Suspension : Active suspension"], ["Performance", "Suspension : Driver adjustable suspension : ride control"], ["Performance", "Suspension : Front shock type : monotube"], ["Performance", "Suspension : Front spring type : coil"], ["Performance", "Suspension : Front stabilizer bar"], ["Performance", "Suspension : Front struts"], ["Performance", "Suspension : Front suspension classification : independent"], ["Performance", "Suspension : Front suspension type : double wishbone"], ["Performance", "Suspension : Rear shock type : monotube"], ["Performance", "Suspension : Rear spring type : coil"], ["Performance", "Suspension : Rear stabilizer bar"], ["Performance", "Suspension : Rear suspension classification : independent"], ["Performance", "Suspension : Rear suspension type : multi-link"], ["Performance", "Suspension : Suspension control : magnetic"], ["Performance", "Suspension : Tuned suspension : sport"], ["Safety_and_Security", "Airbags : Front airbags : dual"], ["Safety_and_Security", "Airbags : Side airbags : front"], ["Safety_and_Security", "Airbags : Side airbags : head protection chambers"], ["Safety_and_Security", "Brakes : ABS : 4-wheel"], ["Safety_and_Security", "Brakes : Braking assist"], ["Safety_and_Security", "Brakes : Cornering brake control"], ["Safety_and_Security", "Brakes : Electronic brakeforce distribution"], ["Safety_and_Security", "Brakes : Electronic parking brake"], ["Safety_and_Security", "Brakes : Front brake type : carbon ceramic disc"], ["Safety_and_Security", "Brakes : Painted brake calipers"], ["Safety_and_Security", "Brakes : Power brakes"], ["Safety_and_Security", "Brakes : Premium brakes : Brembo"], ["Safety_and_Security", "Brakes : Rear brake type : carbon ceramic disc"], ["Safety_and_Security", "Safety : Automatic hazard warning lights"], ["Safety_and_Security", "Safety : Camera system : rearview"], ["Safety_and_Security", "Safety : Crumple zones : front"], ["Safety_and_Security", "Safety : Crumple zones : rear"], ["Safety_and_Security", "Safety : Emergency interior trunk release"], ["Safety_and_Security", "Safety : Impact sensor : fuel cut-off"], ["Safety_and_Security", "Safety : Parking sensors : front"], ["Safety_and_Security", "Safety : Parking sensors : rear"], ["Safety_and_Security", "Safety : Rearview monitor : in dash"], ["Safety_and_Security", "Safety : Rollover protection system"], ["Safety_and_Security", "Seatbelts : Emergency locking retractors : front"], ["Safety_and_Security", "Seatbelts : Front seatbelts : 3-point"], ["Safety_and_Security", "Seatbelts : Seatbelt force limiters : front"], ["Safety_and_Security", "Seatbelts : Seatbelt pretensioners : front"], ["Safety_and_Security", "Seatbelts : Seatbelt warning sensor : front"], ["Safety_and_Security", "Security : Anti-theft system : alarm"], ["Safety_and_Security", "Security : Anti-theft system : anti-tow sensor"], ["Safety_and_Security", "Security : Anti-theft system : interior motion sensor"], ["Safety_and_Security", "Security : Anti-theft system : perimeter alarm"], ["Safety_and_Security", "Security : Anti-theft system : vehicle immobilizer"], ["Safety_and_Security", "Security : Power door locks : auto-locking"], ["Safety_and_Security", "Stability and Traction : Hill holder control"], ["Safety_and_Security", "Stability and Traction : Stability control"], ["Safety_and_Security", "Stability and Traction : Traction control"]];

  var STD_PORSCHE = [["Entertainment_and_Technology", "Audio System : Antenna type : diversity"], ["Entertainment_and_Technology", "Audio System : Auxiliary audio input : Bluetooth"], ["Entertainment_and_Technology", "Audio System : Auxiliary audio input : jack"], ["Entertainment_and_Technology", "Audio System : Auxiliary audio input : memory card slot"], ["Entertainment_and_Technology", "Audio System : Auxiliary audio input : USB"], ["Entertainment_and_Technology", "Audio System : Hard drive : 11GB"], ["Entertainment_and_Technology", "Audio System : In-Dash CD : DVD audio"], ["Entertainment_and_Technology", "Audio System : In-Dash CD : single disc"], ["Entertainment_and_Technology", "Audio System : Radio : AM/FM"], ["Entertainment_and_Technology", "Audio System : Radio : HD radio"], ["Entertainment_and_Technology", "Audio System : Radio : touch screen display"], ["Entertainment_and_Technology", "Audio System : Radio data system"], ["Entertainment_and_Technology", "Audio System : Satellite radio : SiriusXM"], ["Entertainment_and_Technology", "Audio System : Speed sensitive volume control"], ["Entertainment_and_Technology", "Audio System : Total speakers : 8"], ["Entertainment_and_Technology", "Audio System : Watts : 150"], ["Entertainment_and_Technology", "In Car Entertainment : Infotainment : Porsche Communication Management"], ["Entertainment_and_Technology", "In Car Entertainment : Infotainment screen size : 7 in."], ["Entertainment_and_Technology", "In Car Entertainment : Smartphone integration : Apple CarPlay"], ["Entertainment_and_Technology", "Telematics : Driver assistance app : roadside assistance"], ["Entertainment_and_Technology", "Telematics : Hands-free phone call integration"], ["Entertainment_and_Technology", "Telematics : Navigation system : hard drive"], ["Entertainment_and_Technology", "Telematics : Navigation system : touch screen display"], ["Entertainment_and_Technology", "Telematics : Navigation system : voice operated"], ["Entertainment_and_Technology", "Telematics : Smart device app compatibility : Porsche Connect"], ["Entertainment_and_Technology", "Telematics : Smart device app function : lock operation"], ["Entertainment_and_Technology", "Telematics : Smart device app function : maintenance status"], ["Entertainment_and_Technology", "Telematics : Smart device app function : vehicle location"], ["Entertainment_and_Technology", "Telematics : Wi-Fi : hotspot"], ["Entertainment_and_Technology", "Telematics : Wireless data link : Bluetooth"], ["Exterior", "Exterior Features : Door handle color : body-color"], ["Exterior", "Exterior Features : Exhaust : dual tip"], ["Exterior", "Exterior Features : Exhaust tip color : black"], ["Exterior", "Exterior Features : Front bumper color : body-color"], ["Exterior", "Exterior Features : Grille color : black"], ["Exterior", "Exterior Features : Mirror color : body-color"], ["Exterior", "Exterior Features : Rear bumper color : body-color"], ["Exterior", "Exterior Features : Rear spoiler : electronically controlled"], ["Exterior", "Exterior Features : Rear spoiler : lip"], ["Exterior", "Exterior Features : Rear spoiler color : black"], ["Exterior", "Exterior Features : Window trim : black"], ["Exterior", "Lights : Daytime running lights : LED"], ["Exterior", "Lights : Exterior entry lights : approach lamps"], ["Exterior", "Lights : Headlights : auto delay off"], ["Exterior", "Lights : Headlights : auto on/off"], ["Exterior", "Lights : Headlights : HID/Xenon"], ["Exterior", "Lights : Headlights : self-leveling"], ["Exterior", "Lights : Taillights : adaptive"], ["Exterior", "Lights : Taillights : LED"], ["Exterior", "Mirrors : Side mirror adjustments : manual folding"], ["Exterior", "Mirrors : Side mirror adjustments : power"], ["Exterior", "Mirrors : Side mirrors : heated"], ["Exterior", "Roof : Convertible rear window : glass"], ["Exterior", "Roof : Convertible roof : power"], ["Exterior", "Roof : Convertible roof : remote operation"], ["Exterior", "Roof : Convertible roof : soft top"], ["Exterior", "Roof : Convertible roof wind blocker"], ["Exterior", "Wheels and Tires : Spare tire kit : tire sealant"], ["Exterior", "Wheels and Tires : Tire Pressure Monitoring System"], ["Exterior", "Wheels and Tires : Wheels : aluminum alloy"], ["Exterior", "Windows : Front wipers : rain sensing"], ["Exterior", "Windows : Front wipers : variable intermittent"], ["Exterior", "Windows : Heated windshield washer jets"], ["Exterior", "Windows : Power windows : safety reverse"], ["Exterior", "Windows : Tinted glass"], ["Exterior", "Windows : Window defogger : rear"], ["Interior", "Air Conditioning : Air filtration : active charcoal"], ["Interior", "Air Conditioning : Front air conditioning : automatic climate control"], ["Interior", "Air Conditioning : Front air conditioning zones : single"], ["Interior", "Comfort Features : Center console trim : leather"], ["Interior", "Comfort Features : Dash trim : leather"], ["Interior", "Comfort Features : Door trim : leather"], ["Interior", "Comfort Features : Floor mat material : carpet"], ["Interior", "Comfort Features : Floor material : carpet"], ["Interior", "Comfort Features : Floor mats : front"], ["Interior", "Comfort Features : Foot pedal trim : aluminum"], ["Interior", "Comfort Features : Interior accents : leather"], ["Interior", "Comfort Features : Shift knob trim : leather"], ["Interior", "Comfort Features : Steering wheel trim : leather"], ["Interior", "Convenience Features : Cargo area light"], ["Interior", "Convenience Features : Center console : front console with armrest and storage"], ["Interior", "Convenience Features : Cruise control"], ["Interior", "Convenience Features : Cupholders : front"], ["Interior", "Convenience Features : Easy entry : manual driver seat"], ["Interior", "Convenience Features : Easy entry : manual passenger seat"], ["Interior", "Convenience Features : Footwell lights"], ["Interior", "Convenience Features : Multi-function remote : keyless entry"], ["Interior", "Convenience Features : Multi-function remote : panic alarm"], ["Interior", "Convenience Features : Multi-function remote : trunk release"], ["Interior", "Convenience Features : One-touch windows : 2"], ["Interior", "Convenience Features : Power outlet(s) : 12V"], ["Interior", "Convenience Features : Power steering : electric"], ["Interior", "Convenience Features : Power steering : variable/speed-proportional"], ["Interior", "Convenience Features : Power windows : lockout button"], ["Interior", "Convenience Features : Reading lights : front"], ["Interior", "Convenience Features : Rearview mirror : auto-dimming"], ["Interior", "Convenience Features : Steering wheel : tilt and telescopic"], ["Interior", "Convenience Features : Steering wheel mounted controls : audio"], ["Interior", "Convenience Features : Steering wheel mounted controls : cruise control"], ["Interior", "Convenience Features : Steering wheel mounted controls : multi-function"], ["Interior", "Convenience Features : Steering wheel mounted controls : paddle shifter"], ["Interior", "Convenience Features : Steering wheel mounted controls : phone"], ["Interior", "Convenience Features : Storage : door pockets"], ["Interior", "Convenience Features : Universal remote transmitter : Homelink - garage door opener"], ["Interior", "Convenience Features : Vanity mirrors : dual illuminating"], ["Interior", "Instrumentation : Clock"], ["Interior", "Instrumentation : Compass"], ["Interior", "Instrumentation : Digital odometer"], ["Interior", "Instrumentation : External temperature display"], ["Interior", "Instrumentation : Fuel economy display : MPG"], ["Interior", "Instrumentation : Fuel economy display : range"], ["Interior", "Instrumentation : Gauge : oil pressure"], ["Interior", "Instrumentation : Gauge : tachometer"], ["Interior", "Instrumentation : Instrument cluster screen size : 4.6 in."], ["Interior", "Instrumentation : Multi-function display"], ["Interior", "Instrumentation : Trip odometer"], ["Interior", "Instrumentation : Warnings and reminders : coolant temperature warning"], ["Interior", "Instrumentation : Warnings and reminders : lamp failure"], ["Interior", "Instrumentation : Warnings and reminders : low fuel level"], ["Interior", "Instrumentation : Warnings and reminders : low oil pressure"], ["Interior", "Instrumentation : Warnings and reminders : maintenance due"], ["Interior", "Seats : Driver seat manual adjustments : height"], ["Interior", "Seats : Driver seat power adjustments : 2"], ["Interior", "Seats : Driver seat power adjustments : reclining"], ["Interior", "Seats : Front headrests : 2"], ["Interior", "Seats : Front headrests : integrated"], ["Interior", "Seats : Front seat type : sport bucket"], ["Interior", "Seats : Passenger seat manual adjustments : height"], ["Interior", "Seats : Passenger seat power adjustments : 2"], ["Interior", "Seats : Passenger seat power adjustments : reclining"], ["Interior", "Seats : Upholstery : leather"], ["Performance", "Powertrain : Auto start/stop"], ["Performance", "Powertrain : Drive mode selector"], ["Performance", "Powertrain : Mid-mounted engine"], ["Performance", "Suspension : Active suspension"], ["Performance", "Suspension : Driver adjustable suspension : ride control"], ["Performance", "Suspension : Front shock type : gas"], ["Performance", "Suspension : Front spring type : coil"], ["Performance", "Suspension : Front stabilizer bar"], ["Performance", "Suspension : Front struts : MacPherson"], ["Performance", "Suspension : Front suspension classification : independent"], ["Performance", "Suspension : Front suspension type : lower control arms"], ["Performance", "Suspension : Rear shock type : gas"], ["Performance", "Suspension : Rear spring type : coil"], ["Performance", "Suspension : Rear stabilizer bar"], ["Performance", "Suspension : Rear struts : MacPherson"], ["Performance", "Suspension : Rear suspension classification : independent"], ["Performance", "Suspension : Rear suspension type : multi-link"], ["Performance", "Suspension : Suspension control : electronic"], ["Performance", "Suspension : Tuned suspension : sport"], ["Safety_and_Security", "Airbags : Airbag deactivation : occupant sensing passenger"], ["Safety_and_Security", "Airbags : Front airbags : dual"], ["Safety_and_Security", "Airbags : Knee airbags : dual front"], ["Safety_and_Security", "Airbags : Side airbags : front"], ["Safety_and_Security", "Airbags : Side airbags : head protection chambers"], ["Safety_and_Security", "Brakes : ABS : 4-wheel"], ["Safety_and_Security", "Brakes : Brake drying"], ["Safety_and_Security", "Brakes : Braking assist"], ["Safety_and_Security", "Brakes : Electronic brakeforce distribution"], ["Safety_and_Security", "Brakes : Electronic parking brake : auto off"], ["Safety_and_Security", "Brakes : Emergency braking preparation"], ["Safety_and_Security", "Brakes : Front brake type : carbon ceramic disc"], ["Safety_and_Security", "Brakes : Painted brake calipers"], ["Safety_and_Security", "Brakes : Power brakes"], ["Safety_and_Security", "Brakes : Rear brake type : carbon ceramic disc"], ["Safety_and_Security", "Safety : Camera system : rearview"], ["Safety_and_Security", "Safety : Crumple zones : front"], ["Safety_and_Security", "Safety : Crumple zones : rear"], ["Safety_and_Security", "Safety : Emergency interior trunk release"], ["Safety_and_Security", "Safety : Parking sensors : front"], ["Safety_and_Security", "Safety : Parking sensors : rear"], ["Safety_and_Security", "Safety : Rearview monitor : in dash"], ["Safety_and_Security", "Safety : Rollover protection system"], ["Safety_and_Security", "Seatbelts : Emergency locking retractors : front"], ["Safety_and_Security", "Seatbelts : Front seatbelts : 3-point"], ["Safety_and_Security", "Seatbelts : Seatbelt force limiters : front"], ["Safety_and_Security", "Seatbelts : Seatbelt pretensioners : front"], ["Safety_and_Security", "Seatbelts : Seatbelt warning sensor : front"], ["Safety_and_Security", "Security : Anti-theft system : alarm"], ["Safety_and_Security", "Security : Anti-theft system : interior motion sensor"], ["Safety_and_Security", "Security : Anti-theft system : vehicle immobilizer"], ["Safety_and_Security", "Security : Power door locks : auto-locking"], ["Safety_and_Security", "Stability and Traction : Hill holder control"], ["Safety_and_Security", "Stability and Traction : Stability control"], ["Safety_and_Security", "Stability and Traction : Traction control"]];

  var MAIN_TEXT_FERRARI = "<span style=\"color:#000000;\">https://www.chicagomotorcars.com/</span><br /><br /><span style=\"font-size:14px;\"><strong><span style=\"color:#FF0000;\"><u><span style=\"font-size:20px;\">2023 Ferrari 812 GTS - Tailor Made</span></u></span><br /><br />Tailor Made Verde Zeltweg Exterior over Heritage Castagno 6370 Leather Interior</strong></span><br /><br /><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><span style=\"font-size:14px;\"><strong><span style=\"font-size:18px;\">ONLY 1,600 MILES</span></strong></span><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><br /><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><span style=\"font-size:14px;\"><strong><span style=\"font-size:18px;\">TAILOR MADE VEHICLE</span></strong></span><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><br /><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><span style=\"font-size:14px;\"><strong><span style=\"font-size:18px;\">HIGHLY OPTIONED 812 GTS</span></strong></span><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><br /><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><span style=\"font-size:14px;\"><strong><span style=\"font-size:18px;\">INCREDIBLE COLOR COMBO</span></strong></span><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><br /><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><span style=\"font-size:14px;\"><strong><span style=\"font-size:18px;\">GENTLEMAN'S SPEC FERRARI</span></strong></span><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><br /><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><span style=\"font-size:14px;\"><strong><span style=\"font-size:18px;\">FULLY CUSTOM 1 OF 1 SPECIFICATION</span></strong></span><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><br /><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><span style=\"font-size:14px;\"><strong><span style=\"font-size:18px;\">LOADED WITH CONVENIENCE OPTIONS</span></strong></span><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><br /><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><span style=\"font-size:14px;\"><strong><span style=\"font-size:18px;\">BEAUTIFUL CUSTOM TAILOR MADE INTERIOR</span></strong></span><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><br /><br /><span style=\"font-size:14px;\"><strong><u>FACTORY OPTIONS INCLUDE:</u><br /><span style=\"color:#FF0000;\"><span style=\"font-size:16px;\">Apple CarPlay<br /><br />Internal Painted Aluminum Elements - Extra Range<br /><br />Black Air Vent Grips on Dashboard<br /><br />Brake Calipers in Aluminum Finish<br /><br />Colored Passenger Compartment Details - Extra Range<br /><br />Central Console in Leather - Extra Range<br /><br />Dedication Plaque in Silver<br /><br />Cavallino Stitched on Headrest - Extra Range<br /><br />Embroidered Prancing Horse (EMPH) in Special Thread - Extra Range<br /><br />Black Tailpipe Tips<br /><br />Advanced Front Driving Camera<br /><br />Long, Narrow Italian Flag Motif<br /><br />Additional Colored Mats with Logo<br /><br />LEDs w/Steering Wheel Rims in Leather - Nero 8500<br /><br />Carbon Fiber Steering Wheel + LEDs<br /><br />Scuderia Ferrari Shields<br /><br />Parking Camera<br /><br />Special 2-Layer Colors - Verde Zeltweg 610<br /><br />Matte Wheels - Matte Gold<br /><br />Matte Silver Forged Racing Wheels<br /><br />Aluminum Rev Counter<br /><br />Full Electric Seats<br /><br />EE Functionality<br /><br />Custom Specifications<br /><br />STC1 in Special Thread - Extra Range<br /><br />Colored Standard Stitching O.R. (On Request) -&nbsp; Extra Range<br /><br />Colored Steering Wheel - Extra Range<br /><br />Tailor Made Shanghai<br /><br />Upper Part of Passenger Compartment in Leather Nero 8500<br /><br />SPECIALIZED EQUIPMENT:<br />Tailor Made Vehicle<br /><br />Verde Zeltweg Car Paint<br /><br />Matte Gold Wheels<br /><br />Upholstery in Heritage Castagno 6370 Leather<br /><br />Comfort Seats in Heritage Castagno 6370 Leather with Narrow, Rounded Vertical Piping<br /><br />Lower Part of Dashboard &amp; Door Panel Inserts in Heritage Castagno 6370 Leather, Door Handle in Standard Black Leather<br /><br />Centre Console in Heritage Castagno 6370 Leather w/Front Part of Centre Console in Standard Black Leather &amp; Storage Compartment in Black Alcantara<br /><br />Colored Inner Seat Detail Inserts in Heritage Castagno 6370 Leather (Except for Insert on Central Upper Part of Dashboard in Standard Black Leather)<br /><br />F1 Paddles in Verde Zeltweg<br /><br />Black Leather Steering Wheel<br /><br />Central Part of Centre Console in Honduras Mahogany 2021003 Wood<br /><br />Internal Aluminum Elements in Matte Canna Di Fucile (including Edge of Odometer, F1 Button Housings Are Standard)<br /><br />Additional Black Carpet Mats w/Side Insert &amp; Edge Trim in Black Leather w/\"812 GTS\" Logo Embroidered in Verde 757 Thread<br /><br />STC1 Stitching and EMPH in Verde 757 Thread<br /><br />Kick-Plate (Driver Side) in Honduras Mahogany 2021003 Wood w/Tailor Made Logo and \"Yu Li\" in Matte Argento Nurburgring, Stripe in Matte Verde Zeltweg<br /><br />Kickplate (Driver Side) in Honduras Mahogany 2021003 Wood w/Tailor Made Logo &amp; \"Squamish\" in Matte Argento Nurburgring, Stripe in Matte Verde Zeltweg<br /><br />Dedication Plate in Honduras Mahogany 2021003 Wood w/Tailor Made Logo &amp; \"Specially Crafted w/Ferrari\" in Matte Argento Nurburgring, Stripe in Matte Verde Zeltweg</span></span><br /><br /><u>VEHICLE HIGHLIGHTS:</u><br /><span style=\"color:#FF0000;\"><span style=\"font-size:18px;\">6.5 Liter N/A 12-Cylinder Engine</span><br /><span style=\"font-size:16px;\">-789 Horsepower-<br />-530 lb/ft of Torque-</span></span><br />Rear Wheel Drive<br />7-Speed Dual-Clutch Automatic Transmission<br />20\" Wheels in Matte Gold Finish<br /><br /><u>EXTERIOR HIGHLIGHTS:</u><br />Rear Quad LED Taillights<br />Front &amp; Rear View Cameras<br />Front &amp; Rear Parking Distance Sensors<br />LED Automatic Daytime Running Lights<br />Brake Calipers Painted in Aluminum Finish<br />Carbon Ceramic High-Performance Brakes<br />Scuderia Ferrari Shields on Front Side Fenders<br />MagnetoRheological Suspension Damping System<br />Power Adjustable Folding &amp; Heated Exterior Mirrors<br />Automatic Power Retractable Hard Top-Body Color Roof<br />Dual-Rear / Quad-Tip Active Exhaust System w/Black Tips<br /><br /><u>INTERIOR HIGHLIGHTS:</u><br />Apple CarPlay Compatibility<br />F1 Paddles in Verde Zeltweg<br />Rev Counter in Aluminum Color<br />Bluetooth Wireless Connectivity<br />Verde 757 Thread Contrast Stitching<br />Adjustable Driving Modes &amp; Suspension<br />Multifunction Entertainment Driver Display Screen<br />Central Part of Centre Console in Honduras Mahogany Wood<br />\"Tailor Made\" Plaque in Honduras Mahogany Wood on Rear Wall<br />Black &amp; Heritage Castagno 6370 Full Leather Tailor Made Interior<br />Multifunction Leather Wrapped Steering Wheel w/LED Shift Lights<br />Power Adjustable Heated Seats Finished in&nbsp;&nbsp;Heritage Castagno 6370 Leather<br /><br /><u>VEHICLE HISTORY:</u><br /><span style=\"color:#FF0000;\"><span style=\"font-size:18px;\">Only 1,600 Miles!<br />Beautiful Color Combo!<br />Gentlemans Spec Ferrari!<br /><span style=\"text-align: center;\">Highly Desired \"GTS\" Model!</span><br />Custom 1 of 1 Tailor Made 812 GTS!</span></span><br /><br /><u>INCLUDES:</u></strong></span><br /><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><span style=\"font-size:14px;\"><strong><span style=\"font-size:18px;\">Owners Manual</span></strong></span><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><br /><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><span style=\"font-size:14px;\"><strong><span style=\"font-size:18px;\"><span style=\"text-align: center;\">Ferrari Car Cover &amp; Bag</span></span></strong></span><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><br /><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><span style=\"font-size:14px;\"><strong><span style=\"font-size:18px;\">Two Master Remote Keys</span></strong></span><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><br /><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><span style=\"font-size:14px;\"><strong><span style=\"font-size:18px;\">Carpeted Floor Mats w/Custom Stitching</span></strong></span><strong style=\"font-size: 14px; text-align: center;\"><span style=\"font-size: 18px;\"><span style=\"color: rgb(255, 0, 0);\">*</span></span></strong><br /><br /><strong style=\"color: rgb(255, 0, 0);\">********************</strong></div></div><div style=\"text-align: center;\"><span style=\"font-size: 18px\"><strong><span style=\"font-size: 22px\">FOLLOW US ONLINE!</span></strong><br /><br /><img alt=\"\" src=\"http://www.chicagomotorcars.com/contentimages/contentimages/img_2083455265.png\" style=\"height: 100px; width: 100px\" /><br /><a href=\"https://www.facebook.com/chicagomotorcars\">FOLLOW US ON FACEBOOK</a><br /><br /><img alt=\"\" src=\"http://www.chicagomotorcars.com/contentimages/contentimages/img_379506815.png\" style=\"height: 100px; width: 100px\" /><br /><a href=\"https://www.instagram.com/chicagomotorcars/\">FOLLOW US ON INSTAGRAM</a><br /><br /><img alt=\"\" src=\"http://www.chicagomotorcars.com/contentimages/contentimages/img_2333825112.png\" style=\"height: 100px; width: 100px\" /><br /><a href=\"https://www.youtube.com/user/ChicagoMotorCars\">FOLLOW US ON YOUTUBE</a><br /><br /><img alt=\"\" src=\"http://www.chicagomotorcars.com/contentimages/contentimages/img_2417488591.png\" style=\"height: 100px; width: 100px\" /><br /><a href=\"https://twitter.com/chgomotorcars\">FOLLOW US ON TWITTER</a></span><br /><br /><span style=\"color: rgb(255,0,0)\"><strong><span style=\"font-size: 22px\">WE FINANCE!</span></strong></span><br /><strong>WE CAN TAILOR FINANCING TO MEET YOUR NEEDS!<br />INCLUDING LONG-TERM FINANCING OPTIONS!</strong><br /><br /><strong><span style=\"color: rgb(255,0,0)\"><span style=\"font-size: 20px\">WE CAN SHIP YOUR CAR WORLDWIDE!</span></span><br /><span style=\"font-size: 20px\">CONTACT US FOR DETAILS!</span></strong><br /><br /><strong><span style=\"font-size: 18px\">CALL US AT</span></strong><br /><span style=\"color: rgb(255,0,0)\"><span style=\"font-size: 28px\"><a href=\"tel:+1 (630) 221-1800\">+1 (630) 221-1800</a></span></span></div><div style=\"text-align: center;\"><br /><span style=\"font-size: 10px\">Please remember, every one of our cars has been enjoyed by their original owners, and these are not factory-new cars. &nbsp;This means they have actually been driven, and regardless of the level of care, every car will exhibit some wear-and-tear. Our vehicles are advertised with the current mileage at the time of listing, so mileage at the time of sale may vary due to test drives, transportation for reconditioning, etc. &nbsp;We go above and beyond to be as accurate as possible in our listings and descriptions, but remember, we are still human just like you. &nbsp;Cars leave the factory with unattached accessories (i.e. floor mats, extra keys, owners manuals, headsets, remotes, etc), and while it would be ideal to have all original accessories included with every car, this is not always the case. &nbsp;We will note in our listings any accessories that will be included, and provide a picture within the listing of all accessories. &nbsp;We do all within our power to avoid mistakes or misprints, so if you see any inaccuracy within our listing, we only ask that you bring this to our attention so that we can immediately rectify the information. &nbsp;We cannot be held responsible for any purely accidental inaccuracies. &nbsp;Since our ultimate goal is 100% customer satisfaction, we ask every customer to verify the listed equipment at the time of purchase with their salesperson. &nbsp;Please do not make any assumptions regarding condition or equipment. &nbsp;If you have any questions or concerns, call us at <a href=\"tel:(630) 221-1800\">(630) 221-1800</a>&nbsp;and ask to speak with a sales manager to discuss. &nbsp;We also ask that you not misinterpret anything in this disclaimer, as it is intended to be understood exactly as it is written. &nbsp;We are here to provide only the very best in quality and customer service!&nbsp; All sales must add tax, title, license and $300.00 Illinois Doc fee. Fees may vary by state and county of new vehicle registration. Contact dealer for details.</span></div>";

  var MAIN_TEXT_AGROTK = "<div style=\"text-align: center;\"><strong>2026 CFG KKTA27&nbsp;<br />Mini Compact Track Loader&nbsp;<br />Kobota Engine<br />Unused&nbsp;<br />Open Operator Station<br />Joystick Steering&nbsp;<br />Manual Coupler&nbsp;<br />43.5 in. Bucket<br />Counterweight Kit</strong></div>";

  /* option lists, verbatim from the export's own <select> elements */
  var OPT = {
    leaseTerm: (function () { var a = []; for (var i = 1; i <= 144; i++) { a.push(String(i)); } return a; })(),
    cylinders: ['-1', '2', '3', '4', '5', '6', '8', '10', '12', '16'],
    location: ['Boats', 'Chicago Motor Cars', 'Chicago Motor Cars - KC', 'Chicago Motor Cars - Naperville', 'Chicago Motor Cars - SC', 'CMS Diesel'],
    basicExt: ['', 'Beige/Tan', 'Black', 'Blue', 'Blue-Metallic', 'Brown', 'Burgundy/Maroon', 'Gold', 'Gray', 'Green', 'Green Metallic', 'Orange', 'Purple', 'Red', 'Red-Metallic', 'Silver', 'Teal', 'White', 'Yellow', 'Other Color'],
    basicInt: ['', 'Beige/Tan', 'Black', 'Blue', 'Brown', 'Burgundy/Maroon', 'Gold', 'Gray', 'Gray-Light', 'Gray-Dark', 'Green', 'Orange', 'Red', 'Silver', 'White', 'Other Color'],
    tone: ['Normal Style', 'Expository Style', 'Descriptive Style', 'Action Packed Style', 'Business Style', 'Creative Non-Fiction Style', 'Formal Style', 'Journalistic Style', 'Review Style', 'Press Release Style', 'Speech Writing Style', 'Technical Writing Style']
  };

  /* the ten extra columns this dealer carries, in the export's order.
     `raw` is the database column name the export prints beside the friendly label. */
  var CUSTOM = [
    { id: 'cfx_date',               label: 'Carfax Report Date',            raw: 'cfx_date',               type: 'text' },
    { id: 'trucks_and_equipment',   label: 'Trucks And Equipment',          raw: 'trucks_and_equipment',   type: 'switch' },
    { id: 'ove_feed_data',          label: 'OVE Feed Data',                 raw: 'ove_feed_data',          type: 'text' },
    { id: 'no_carfax',              label: 'Do Not Report VIN To Carfax',   raw: 'no_carfax',              type: 'switch' },
    { id: 'pending_sale_name',      label: 'Pending Sale Name',             raw: 'pending_sale_name',      type: 'text' },
    { id: 'truck_trailer',          label: 'Truck / Trailer',               raw: 'truck_trailer',          type: 'switch' },
    { id: 'truck_trailer_caregory', label: 'Truck / Trailer Category',      raw: 'truck_trailer_caregory', type: 'text' },
    { id: 'images_timestamp',       label: 'Images Timestamp',              raw: 'images_timestamp',       type: 'switch' },
    { id: 'no_vin',                 label: 'Do Not Display VIN On Website', raw: 'no_vin',                 type: 'switch' },
    { id: 'carfax_timestamp',       label: 'Carfax Timestamp',              raw: 'carfax_timestamp',       type: 'text' }
  ];

  /* the five visibility switches, with the export's own helper sentences.
     `tone: danger` marks the two whose ON state takes the car off the market. */
  var VIS = [
    { id: 'specials',           label: 'Specials',               help: "Feature this car in the site's Specials rail" },
    { id: 'incoming_data_feed', label: 'Incoming Data Feed',     help: 'Allow the nightly DMS feed to update this car \u2014 turn OFF to protect manual edits' },
    { id: 'no_display',         label: 'Do Not Display on Site', help: 'Hides the car from the public website entirely', tone: 'danger' },
    { id: 'pending_sale',       label: 'Pending Sale',           help: 'Shows the "sale pending" ribbon on the site' },
    { id: 'nofeedout',          label: 'Do Not Feed Out',        help: 'Master off-switch for all marketplace feeds \u00b7 auto-flips ON when every feed in the Feeds section is excluded', tone: 'danger' }
  ];

  /* the window sticker and the eight buyers guides, as the Prints menu lists them */
  var PRINTS = {
    sticker: ['Window Sticker'],
    guides: [
      'Print "As Is" Buyers Guide',
      'Print "As Is" Buyers Guide w/ No Service Contract',
      'Print "As Is" Buyers Guide w/ Manufacturer Warranty',
      'Print "In House" Limited Buyers Guide',
      'Print "Factory" Buyers Guide',
      'Print "Factory Full" Buyers Guide',
      'Print "Text Only" Buyers Guide',
      'Print Buyers Guide Back Page'
    ]
  };

  var VEHICLES = [
    {
      "key": "ferrari",
      "src": "d05-vehicle-editor-1.html",
      "title": "2023 Ferrari 812 GTS",
      "added": "2026-07-31 16:31:36",
      "ageDays": 40,
      "modified": "2026-08-17 18:45:58",
      "views": 0,
      "photos": 64,
      "thumb": "img/277624e2-13868_main_t.jpg",
      "status": "Available",
      "vtype": "Used",
      "certified": false,
      "vis": {"specials": false, "incoming_data_feed": true, "no_display": false, "pending_sale": false, "nofeedout": false},
      "price": "1099500",
      "priceHistory": "2 changes · last −$300",
      "discount_price": "0",
      "invoice_price": "0",
      "lease_price": "0",
      "lease_term": "1",
      "stockno": "0P0300236 PS",
      "vin": "ZFF97CMA0P0300236",
      "year": "2023",
      "make": "Ferrari",
      "model": "812 GTS",
      "trim": "Convertible Tailor Made Only 1600 Miles Final Year 1 of 1 Collector Grade",
      "body": "Convertible",
      "mileage": "1641",
      "engine": "6.5L V12 789hp 530ft. lbs.",
      "trans": "7-Speed Double Clutch",
      "mpg_cty": "12",
      "mpg_hwy": "15",
      "fuel": "Gasoline",
      "drivetrain": "RWD",
      "cylinders": "12",
      "displacement": "6.5",
      "curb_weight": "3823",
      "doors": "2",
      "vehicle_type": "Car",
      "YouTube_url": "https://www.youtube.com/embed/EuD8KI4blKM?feature=player_detailpage",
      "ext_color": "Verde Zeltweg",
      "basic_ext_color": "",
      "int_color": "Heritage Castagno",
      "basic_int_color": "",
      "bookvalue": "0",
      "discount": "0",
      "zero_down": false,
      "location": "Chicago Motor Cars",
      "original_price": "",
      "modelnumber": "",
      "bodyCode": "400924774",
      "add_options": "",
      "video_url": "",
      "custom": {"cfx_date": "", "trucks_and_equipment": false, "ove_feed_data": "", "no_carfax": false, "pending_sale_name": "", "truck_trailer": false, "truck_trailer_caregory": "", "images_timestamp": false, "no_vin": false, "carfax_timestamp": ""},
      "carfax": "https://www.carfax.com/vehiclehistory/ar20/p0_CZLWuiRee2We_KDU54ZkCbsuEyNuoeUk1TmfsECuP1T6jnF5Zz-yEcH9_Ju_UZ4VKd73fLiq4ipcFLefHcqxc39NsTY70cYM",
      main_text_1: MAIN_TEXT_FERRARI,
      std:STD_FERRARI,
      feeds: FEEDS.map(function () { return true; })
    },
    {
      "key": "agrotk",
      "src": "d05-vehicle-editor-2.html",
      "title": "2026 AGROTK KKTA27",
      "added": "2026-04-15 14:06:32",
      "ageDays": 147,
      "modified": "2026-09-03 08:28:45",
      "views": 0,
      "photos": 17,
      "thumb": null,
      "status": "Available",
      "vtype": "New",
      "certified": false,
      "vis": {"specials": false, "incoming_data_feed": true, "no_display": false, "pending_sale": false, "nofeedout": false},
      "price": "14500",
      "priceHistory": null,
      "discount_price": "0",
      "invoice_price": "0",
      "lease_price": "0",
      "lease_term": "1",
      "stockno": "22531",
      "vin": "KKTA2726L02050224",
      "year": "2026",
      "make": "AGROTK",
      "model": "KKTA27",
      "trim": "Mini Compact Track Loader",
      "body": "Trucks",
      "mileage": "0",
      "engine": "",
      "trans": "",
      "mpg_cty": "0",
      "mpg_hwy": "0",
      "fuel": "",
      "drivetrain": "",
      "cylinders": "-1",
      "displacement": "0.0",
      "curb_weight": "",
      "doors": "",
      "vehicle_type": "",
      "YouTube_url": "https://www.youtube.com/embed/09gLXQnimn0?feature=player_detailpage",
      "ext_color": "Yellow",
      "basic_ext_color": "Yellow",
      "int_color": "Black",
      "basic_int_color": "Black",
      "bookvalue": "0",
      "discount": "0",
      "zero_down": false,
      "location": "CMS Diesel",
      "original_price": "",
      "modelnumber": "",
      "bodyCode": "",
      "add_options": "",
      "video_url": "",
      "custom": {"cfx_date": "", "trucks_and_equipment": false, "ove_feed_data": "", "no_carfax": true, "pending_sale_name": "", "truck_trailer": false, "truck_trailer_caregory": "", "images_timestamp": false, "no_vin": false, "carfax_timestamp": ""},
      "carfax": null,
      main_text_1: MAIN_TEXT_AGROTK,
      std:[],
      feeds: FEEDS.map(function () { return true; })
    },
    {
      "key": "porsche",
      "src": "d05-vehicle-editor-3.html",
      "title": "2019 Porsche 911",
      "added": "2026-09-08 12:51:22",
      "ageDays": 1,
      "modified": "2026-09-08 12:52:51",
      "views": 0,
      "photos": 0,
      "thumb": null,
      "status": "Available",
      "vtype": "Used",
      "certified": false,
      "vis": {"specials": false, "incoming_data_feed": true, "no_display": false, "pending_sale": false, "nofeedout": false},
      "price": "0",
      "priceHistory": null,
      "discount_price": "0",
      "invoice_price": "0",
      "lease_price": "0",
      "lease_term": "1",
      "stockno": "22928",
      "vin": "WP0CF2A94KS172690",
      "year": "2019",
      "make": "Porsche",
      "model": "911",
      "trim": "Speedster",
      "body": "Convertible",
      "mileage": "25",
      "engine": "4.0L H6 502hp 346ft. lbs.",
      "trans": "6-Speed Manual",
      "mpg_cty": "14",
      "mpg_hwy": "19",
      "fuel": "Gasoline",
      "drivetrain": "RWD",
      "cylinders": "6",
      "displacement": "4.0",
      "curb_weight": "3230",
      "doors": "2",
      "vehicle_type": "Car",
      "YouTube_url": "",
      "ext_color": "GT Silver Metallic",
      "basic_ext_color": "",
      "int_color": "Black w/ Red Stitching",
      "basic_int_color": "",
      "bookvalue": "0",
      "discount": "0",
      "zero_down": false,
      "location": "Chicago Motor Cars",
      "original_price": "",
      "modelnumber": "",
      "bodyCode": "400908032",
      "add_options": "",
      "video_url": "",
      "custom": {"cfx_date": "", "trucks_and_equipment": false, "ove_feed_data": "", "no_carfax": true, "pending_sale_name": "", "truck_trailer": false, "truck_trailer_caregory": "", "images_timestamp": false, "no_vin": false, "carfax_timestamp": ""},
      "carfax": null,
      main_text_1: '',
      std:STD_PORSCHE,
      feeds: FEEDS.map(function () { return true; })
    }
  ];

  window.SV11 = {
    vehicles: VEHICLES,
    feeds: FEEDS,
    opt: OPT,
    custom: CUSTOM,
    vis: VIS,
    prints: PRINTS,
    /* the six description tabs in the export's order. Main Text 1 and Main Text 3
       are the two the export puts a rich-text editor on; the other four are plain
       textareas. */
    descTabs: [
      { id: 'intro_text',        label: 'Intro Text' },
      { id: 'main_text_1',       label: 'Main Text 1', rich: true },
      { id: 'main_text_2',       label: 'Main Text 2' },
      { id: 'main_text_3',       label: 'Main Text 3', rich: true },
      { id: 'caption',           label: 'Caption' },
      { id: 'buyers_guide_text', label: 'Buyers Guide Text' }
    ]
  };
})();
