/* AAN · Staff UI · Field Management — GENERATION 11 · data
   Read from the new backend (/admin/field-registry) on 2026-11-18 at 1918px.
   The registry holds 397 fields; this demo carries the first 56 rows exactly as read (key, label,
   physical type, group, core, source flag). Dealer #277's field set holds 75 fields; this demo
   carries the 10 rows that were read. Counts are the backend's, never the sample's.
   Row: [key, label, physical type, group, core, source flag] — '' where the backend shows nothing. */
window.FM = {
  read: 'Nov 18',
  total: 397,
  counts: {
    core: 66,              /* 397 − 331 custom */
    custom: 331,
    withFlag: 14,
    types: [['string', 156], ['bool', 153], ['int', 40], ['text', 39], ['date', 8], ['decimal', 1]]
  },
  /* the backend's filter options */
  groups: ['custom'],
  cores: [['core', 'Core only'], ['custom', 'Custom only']],
  sourceFlags: ['__vms_out_feeds_control', '__vms_ilusso', '__vms_curb_weight', '__vms_mundoautos', '__vms_nfiempire', '__vms_selectjeeps'],

  registry: [
    ['id', 'Id', 'int', '', 'core', ''],
    ['stockno', 'Stockno', 'string', '', 'core', ''],
    ['make', 'Make', 'string', '', 'core', ''],
    ['model', 'Model', 'string', '', 'core', ''],
    ['year', 'Year', 'int', '', 'core', ''],
    ['int_color', 'Interior Color', 'string', '', 'core', ''],
    ['ext_color', 'Exterior Color', 'string', '', 'core', ''],
    ['price', 'Price', 'int', '', 'core', ''],
    ['bookvalue', 'Bookvalue', 'int', '', 'core', ''],
    ['discount_price', 'Discount Price', 'int', '', 'core', ''],
    ['discount', 'Discount', 'int', '', 'core', ''],
    ['mileage', 'Mileage', 'int', '', 'core', ''],
    ['engine', 'Engine', 'string', '', 'core', ''],
    ['cylinders', 'Cylinders', 'bool', '', 'core', ''],
    ['displacement', 'Displacement', 'decimal', '', 'core', ''],
    ['trans', 'Transmission', 'string', '', 'core', ''],
    ['vin', 'VIN', 'string', '', 'core', ''],
    ['intro_text', 'Intro Text', 'string', '', 'core', ''],
    ['main_text_1', 'Main Text 1', 'text', '', 'core', ''],
    ['main_text_2', 'Main Text 2', 'text', '', 'core', ''],
    ['main_text_3', 'Main Text 3', 'text', '', 'core', ''],
    ['caption', 'Caption', 'string', '', 'core', ''],
    ['lease_price', 'Lease Price', 'int', '', 'core', ''],
    ['lease_term', 'Lease Term', 'int', '', 'core', ''],
    ['lease_text', 'Lease Text', 'string', '', 'core', ''],
    ['zero_down', 'Zero Down', 'bool', '', 'core', ''],
    ['type', 'Type', 'string', '', 'core', ''],
    ['sold', 'Sold', 'string', '', 'core', ''],
    ['location', 'Location', 'string', '', 'core', ''],
    ['views', 'Views', 'int', '', 'core', ''],
    ['when_added', 'When Added', 'date', '', 'core', ''],
    ['when_modified', 'When Modified', 'date', '', 'core', ''],
    ['specials', 'Specials', 'string', '', 'core', ''],
    ['buyers_guide_text', 'Buyers Guide Text', 'text', '', 'core', ''],
    ['incoming_data_feed', 'Incoming Data Feed', 'string', '', 'core', ''],
    ['trim', 'Trim', 'string', '', 'core', ''],
    ['body', 'Body', 'string', '', 'core', ''],
    ['original_price', 'Original Price', 'string', '', 'core', ''],
    ['certified', 'Certified', 'string', '', 'core', ''],
    ['modelnumber', 'Modelnumber', 'string', '', 'core', ''],
    ['nofeed_out', 'No Feed Out (per feed)', 'string', '', 'core', '__vms_out_feeds_control'],
    ['curb_weight', 'Curb Weight', 'string', '', 'core', '__vms_curb_weight'],
    ['lifestyle_categories', 'Lifestyle Categories', 'text', 'custom', 'custom', '__vms_ilusso'],
    ['notes', 'Notes', 'text', 'custom', 'custom', '__vms_ilusso'],
    ['buyer', 'Buyer', 'string', 'custom', 'custom', '__vms_ilusso'],
    ['seller', 'Seller', 'string', 'custom', 'custom', '__vms_ilusso'],
    ['seller_phone', 'Seller Phone', 'string', 'custom', 'custom', '__vms_ilusso'],
    ['no_carfax', 'No Carfax', 'bool', 'custom', 'custom', '__vms_ilusso'],
    ['carfax_timestamp', 'Carfax Timestamp', 'string', 'custom', 'custom', '__vms_ilusso'],
    ['window_sticker_upload', 'Window Sticker Upload', 'bool', 'custom', 'custom', '__vms_ilusso'],
    ['off_market', 'Off Market', 'bool', 'custom', 'custom', '__vms_ilusso'],
    ['cargurus_price', 'CarGurus Price', 'int', 'custom', 'custom', '__vms_mundoautos'],
    ['completed_projects', 'Completed Projects', 'bool', 'custom', 'custom', '__vms_nfiempire'],
    ['toys', 'Toys', 'bool', 'custom', 'custom', '__vms_selectjeeps'],
    ['new_arrivals', 'New Arrivals', 'bool', 'custom', 'custom', ''],
    ['horsepower', 'Horsepower', 'string', 'custom', 'custom', '']
  ],

  /* Dealer Field Set: the one dealer read from the backend. Row: [key, source, active] —
     label, type, group and core come from the registry row of the same key. */
  dealers: {
    '277': {
      name: 'Chicago Motor Cars',
      total: 75,
      table: 'products',
      rows: [
        ['id', 'introspection', true], ['stockno', 'introspection', true], ['make', 'introspection', true],
        ['model', 'introspection', true], ['year', 'introspection', true], ['int_color', 'introspection', true],
        ['ext_color', 'introspection', true], ['price', 'introspection', true], ['bookvalue', 'introspection', true],
        ['discount_price', 'introspection', true]
      ]
    }
  }
};
